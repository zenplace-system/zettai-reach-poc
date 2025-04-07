import { NextResponse } from 'next/server';

/**
 * SMS配信状況確認APIエンドポイント
 * GET /api/sms/status?clientTag=xxx
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
    const clientTag = searchParams.get('clientTag');
    const date = searchParams.get('date');

    // clientTagまたはdateが必要
    if (!clientTag && !date) {
      return NextResponse.json(
        { error: 'clientTagまたはdateパラメータが必要です。' },
        { status: 400 }
      );
    }

    // 絶対リーチAPI用のクエリパラメータ
    const params = new URLSearchParams();
    params.append('token', token);
    params.append('clientId', clientId);
    
    if (clientTag) {
      params.append('clientTag', clientTag);
    }
    
    if (date) {
      params.append('date', date);
    }

    console.log(`SMS配信状況確認リクエスト: ${apiEndpoint}/p5/api/status.json?${params.toString()}`);

    // 絶対リーチAPIへのリクエスト
    const response = await fetch(`${apiEndpoint}/p5/api/status.json?${params.toString()}`, {
      method: 'GET',
    });

    // レスポンスの取得
    const data = await response.json();
    
    console.log('絶対リーチAPIからのレスポンス:', data);

    // レスポンスの返却
    return NextResponse.json({
      ...data,
      success: data.responseCode === 0,
    });
  } catch (error) {
    console.error('SMS配信状況確認APIエラー:', error);
    return NextResponse.json(
      { error: 'SMS配信状況確認中にエラーが発生しました。', details: (error as Error).message },
      { status: 500 }
    );
  }
} 