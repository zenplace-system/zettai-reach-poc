import { NextResponse } from 'next/server';

// ステータスの型定義
interface SmsStatus {
  dateTime: string;
  phoneNumber: string;
  message: string;
  smsCode: string;
  carrierId: string | null;
  carrierName: string;
  statusId: string;
  statusDescription?: string;
  clientTag: string;
  detailedStatusId: string;
  separatedSuccessCount?: number;
}

/**
 * SMS一斉送信ステータス確認APIエンドポイント
 * GET /api/sms/batch-status?groupTag=xxx
 */
export async function GET(request: Request) {
  try {
    // 環境変数のチェック
    const token = process.env.ZETTAI_REACH_TOKEN;
    const clientId = process.env.ZETTAI_REACH_CLIENT_ID;
    const apiEndpoint = process.env.ZETTAI_REACH_API_ENDPOINT || 'https://sms-api.aossms.com';

    if (!token || !clientId) {
      return NextResponse.json(
        { error: '環境変数が設定されていません。.env.localファイルを確認してください。' },
        { status: 500 }
      );
    }

    // URLからクエリパラメータを取得
    const { searchParams } = new URL(request.url);
    const groupTag = searchParams.get('groupTag');
    const date = searchParams.get('date');

    // groupTagまたはdateが必要
    if (!groupTag && !date) {
      return NextResponse.json(
        { error: 'groupTagまたはdateパラメータが必要です。' },
        { status: 400 }
      );
    }

    console.log(`SMS一斉送信ステータス確認リクエスト: groupTag=${groupTag || 'なし'}, date=${date || 'なし'}`);

    // 予約送信確認APIのパラメータ
    const params = new URLSearchParams();
    params.append('token', token);
    params.append('clientId', clientId);
    
    if (groupTag) {
      params.append('groupTag', groupTag);
    }
    
    // dateが指定されている場合はscheduleDate形式で設定
    if (date) {
      // YYYYMMDDの形式に変換（必要であれば）
      const formattedDate = date.replace(/-/g, '');
      params.append('scheduleDate', formattedDate);
    }

    // 予約送信確認APIをコール（一斉送信の予約状況確認用）
    const reservationCheckEndpoint = `${apiEndpoint}/p5/api/checkreservation.json`;
    let reservationResponse;
    try {
      console.log(`予約送信確認APIコール: ${reservationCheckEndpoint}?${params.toString()}`);
      reservationResponse = await fetch(`${reservationCheckEndpoint}?${params.toString()}`);
      reservationResponse = await reservationResponse.json();
    } catch (error) {
      console.error('予約送信確認APIエラー:', error);
      reservationResponse = { error: '予約送信確認APIのコールに失敗しました。' };
    }

    // ステータス確認APIのパラメータ
    const statusParams = new URLSearchParams();
    statusParams.append('token', token);
    statusParams.append('clientId', clientId);
    
    if (groupTag) {
      // groupTagがある場合はclientTagとして使用（完全に一致するものではなく、前方一致で検索される）
      statusParams.append('clientTag', groupTag);
    }
    
    if (date) {
      statusParams.append('date', date.replace(/-/g, ''));
    }

    // ステータス確認APIをコール
    let statusResult;
    try {
      console.log(`ステータス確認APIコール: ${apiEndpoint}/p5/api/status.json?${statusParams.toString()}`);
      const statusResponse = await fetch(`${apiEndpoint}/p5/api/status.json?${statusParams.toString()}`);
      statusResult = await statusResponse.json();
    } catch (error) {
      console.error('ステータス確認APIエラー:', error);
      statusResult = { error: 'ステータス確認APIのコールに失敗しました。' };
    }

    // 結果のサマリー集計
    const summary = {
      total: statusResult?.status?.length || 0,
      byStatusId: {} as Record<string, number>,
    };

    // ステータスIDごとの件数を集計
    if (statusResult?.status && Array.isArray(statusResult.status)) {
      statusResult.status.forEach((status: SmsStatus) => {
        const statusId = status.statusId || 'unknown';
        summary.byStatusId[statusId] = (summary.byStatusId[statusId] || 0) + 1;
      });
    }

    // レスポンスの返却
    return NextResponse.json({
      groupTag,
      date,
      reservationStatus: reservationResponse,
      deliveryStatus: statusResult,
      summary,
      success: statusResult?.responseCode === 0 || reservationResponse?.responseCode === 0,
    });
  } catch (error) {
    console.error('一斉送信ステータス確認APIエラー:', error);
    return NextResponse.json(
      { error: '一斉送信ステータス確認中にエラーが発生しました。', details: (error as Error).message },
      { status: 500 }
    );
  }
} 