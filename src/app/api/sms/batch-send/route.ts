import { NextResponse } from 'next/server';

/**
 * SMS一斉送信APIエンドポイント
 * POST /api/sms/batch-send
 */
export async function POST(request: Request) {
  try {
    // 環境変数のチェック
    const token = process.env.ZETTAI_REACH_TOKEN;
    const clientId = process.env.ZETTAI_REACH_CLIENT_ID;
    const smsCode = process.env.ZETTAI_REACH_SMS_CODE;
    const apiEndpoint = process.env.ZETTAI_REACH_API_ENDPOINT || 'https://sms-api.aossms.com';

    if (!token || !clientId || !smsCode) {
      return NextResponse.json(
        { error: '環境変数が設定されていません。.env.localファイルを確認してください。' },
        { status: 500 }
      );
    }

    // リクエストボディの取得
    const body = await request.json();
    const { phoneNumbers, message, groupTag = `batch_${Date.now()}` } = body;

    // 必須パラメータのチェック
    if (!phoneNumbers || !Array.isArray(phoneNumbers) || phoneNumbers.length === 0 || !message) {
      return NextResponse.json(
        { error: '電話番号（配列）とメッセージは必須です。' },
        { status: 400 }
      );
    }

    console.log(`SMS一斉送信リクエスト: ${phoneNumbers.length}件の送信先に送信します`);

    // 送信結果の配列
    const results = [];
    const errors = [];

    // 各電話番号に対して順次送信
    for (let i = 0; i < phoneNumbers.length; i++) {
      const phoneNumber = phoneNumbers[i];
      
      // 空の電話番号はスキップ
      if (!phoneNumber) continue;

      try {
        // 絶対リーチAPI用のリクエストパラメータ
        const params = new URLSearchParams();
        params.append('token', token);
        params.append('clientId', clientId);
        params.append('smsCode', smsCode);
        params.append('phoneNumber', phoneNumber);
        params.append('message', message);
        
        // 個別の識別子とグループタグを設定
        const clientTag = `${groupTag}_${i}`;
        params.append('clientTag', clientTag);
        params.append('groupTag', groupTag);

        console.log(`SMS送信 ${i+1}/${phoneNumbers.length}: ${phoneNumber}`);

        // 絶対リーチAPIへのリクエスト
        const response = await fetch(`${apiEndpoint}/p5/api/mt.json`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: params.toString(),
        });

        // レスポンスの取得
        const data = await response.json();
        
        // 結果を配列に追加
        results.push({
          index: i,
          phoneNumber,
          clientTag,
          ...data,
          success: data.responseCode === 0,
        });
      } catch (error) {
        console.error(`電話番号 ${phoneNumber} への送信中にエラーが発生:`, error);
        errors.push({
          index: i,
          phoneNumber,
          error: (error as Error).message,
        });
      }

      // TPSを考慮して少し待機（600TPS制限対策）
      if (i < phoneNumbers.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 10)); // 10ms待機
      }
    }

    // 送信結果のサマリーを計算
    const summary = {
      total: phoneNumbers.length,
      success: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      errors: errors.length,
    };

    // レスポンスの返却
    return NextResponse.json({
      summary,
      groupTag,
      results,
      errors,
      success: summary.success > 0,
    });
  } catch (error) {
    console.error('SMS一斉送信APIエラー:', error);
    return NextResponse.json(
      { error: 'SMS一斉送信中にエラーが発生しました。', details: (error as Error).message },
      { status: 500 }
    );
  }
} 