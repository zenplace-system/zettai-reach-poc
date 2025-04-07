import { NextResponse } from 'next/server';
import { z } from 'zod';
import { format } from 'date-fns';

// フロントエンドからのリクエストボディのスキーマ
const requestBodySchema = z.object({
  phoneNumber: z.string(),
  message: z.string(),
  clientTag: z.string().optional(),
  scheduledTime: z.string().datetime(), // ISO 8601形式で受け取る
});

// 絶対リーチSMS APIのレスポンス形式 (CommonMT送信)
interface ZettaiReachMtResponse {
  responseCode: number;
  responseMessage: string;
  phoneNumber?: string; // 成功時は返却される
  smsMessage?: string; // 成功時は返却される
}

// フロントエンドへのレスポンス形式
interface ScheduleResponse {
  success: boolean;
  responseCode: number;
  responseMessage: string;
  error?: string;
  details?: string;
  // scheduledJobId は CommonMT API のレスポンスには含まれないため削除
}

export async function POST(request: Request) {
  try {
    // 環境変数のチェック
    const token = process.env.ZETTAI_REACH_TOKEN;
    const clientId = process.env.ZETTAI_REACH_CLIENT_ID;
    const smsCode = process.env.ZETTAI_REACH_SMS_CODE;

    if (!token || !clientId || !smsCode) {
      console.error("環境変数が設定されていません: ZETTAI_REACH_API_TOKEN, ZETTAI_REACH_CLIENT_ID, ZETTAI_REACH_SMS_CODE");
      return NextResponse.json<ScheduleResponse>(
        {
          success: false,
          responseCode: 500, // 内部サーバーエラーを示すコード
          responseMessage: "サーバー設定エラー",
          error: "必要な環境変数が設定されていません。",
        },
        { status: 500 }
      );
    }

    // リクエストボディのパースとバリデーション
    const body = await request.json();
    const validationResult = requestBodySchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json<ScheduleResponse>(
        {
          success: false,
          responseCode: 400, // Bad Request
          responseMessage: "リクエスト形式エラー",
          error: "リクエストの形式が正しくありません。",
          details: validationResult.error.errors.map(e => `${e.path.join('.')} - ${e.message}`).join(', '),
        },
        { status: 400 }
      );
    }

    const { phoneNumber, message, clientTag, scheduledTime } = validationResult.data;

    // scheduledTimeを YYYY-MM-dd HH:mm 形式にフォーマット
    const formattedScheduledTime = format(new Date(scheduledTime), 'yyyy-MM-dd HH:mm');

    // 絶対リーチSMS APIへのリクエストボディを作成 (x-www-form-urlencoded)
    const apiRequestBody = new URLSearchParams({
      token,
      clientId,
      smsCode,
      phoneNumber,
      message,
      scheduleTime: formattedScheduledTime, // フォーマットした日時を使用
    });

    if (clientTag) {
      apiRequestBody.append('clientTag', clientTag);
    }

    // 絶対リーチSMS API (CommonMT送信) にリクエスト
    const apiResponse = await fetch('https://sms-api.aossms.com/p5/api/mt.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: apiRequestBody.toString(),
    });

    // レスポンスのパース
    const result: ZettaiReachMtResponse = await apiResponse.json();

    // フロントエンドへのレスポンスを作成
    const response: ScheduleResponse = {
      success: result.responseCode === 0,
      responseCode: result.responseCode,
      responseMessage: result.responseMessage,
    };

    return NextResponse.json(response, { status: apiResponse.status });

  } catch (error) {
    console.error("SMS予約APIエラー:", error);
    // 詳細なエラーはログに出力し、クライアントには汎用的なエラーを返す
    let errorMessage = "予期せぬエラーが発生しました。";
    if (error instanceof Error) {
        errorMessage = error.message;
    }

    return NextResponse.json<ScheduleResponse>(
      {
        success: false,
        responseCode: 500, // Internal Server Error
        responseMessage: "サーバー内部エラー",
        error: "SMS予約処理中にエラーが発生しました。",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
} 