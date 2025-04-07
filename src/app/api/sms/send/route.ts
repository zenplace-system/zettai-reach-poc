import { NextResponse } from 'next/server';

/**
 * SMS送信APIエンドポイント
 * POST /api/sms/send
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
    const { phoneNumber, message, clientTag = `test_${Date.now()}` } = body;

    // 必須パラメータのチェック
    if (!phoneNumber || !message) {
      return NextResponse.json(
        { error: '電話番号とメッセージは必須です。' },
        { status: 400 }
      );
    }

    // 絶対リーチAPI用のリクエストパラメータ
    const params = new URLSearchParams();
    params.append('token', token);
    params.append('clientId', clientId);
    params.append('smsCode', smsCode);
    params.append('phoneNumber', phoneNumber);
    params.append('message', message);
    params.append('clientTag', clientTag);

    console.log(`SMS送信リクエスト: ${apiEndpoint}/p5/api/mt.json`, {
      phoneNumber,
      clientTag,
      messageLength: message.length,
    });

    console.log(`params: ${params.toString()}`);

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
    
    console.log('絶対リーチAPIからのレスポンス:', data);

    // レスポンスの返却（clientTagを含める）
    return NextResponse.json({
      ...data,
      clientTag,
      success: data.responseCode === 0,
    });
  } catch (error) {
    console.error('SMS送信APIエラー:', error);
    return NextResponse.json(
      { error: 'SMS送信中にエラーが発生しました。', details: (error as Error).message },
      { status: 500 }
    );
  }
} 