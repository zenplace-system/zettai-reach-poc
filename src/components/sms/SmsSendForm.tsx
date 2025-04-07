"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2, Send, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// フォームのバリデーションスキーマ
const formSchema = z.object({
  phoneNumber: z
    .string()
    .min(1, "送信先電話番号は必須です")
    .regex(
      /^(\+81|0)(([26789]0[1-9][0-9]{7}$)|(20[1-9][0-9]{10}$))/,
      "有効な電話番号形式を入力してください (例: 09012345678 または +819012345678)"
    ),
  message: z
    .string()
    .min(1, "メッセージは必須です")
    .max(660, "メッセージは660文字以内で入力してください"),
  clientTag: z
    .string()
    .max(200, "クライアントタグは200文字以内で入力してください")
    .optional(),
});

// フォームの入力値の型
type FormValues = z.infer<typeof formSchema>;

// 送信レスポンスの型
interface SendResponse {
  responseCode: number;
  responseMessage: string;
  phoneNumber: string;
  smsMessage: string;
  clientTag: string;
  success: boolean;
  error?: string;
  details?: string;
}

// ステータス取得レスポンスの型
interface StatusResponse {
  responseCode: number;
  responseMessage: string;
  status?: Array<{
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
  }>;
  success: boolean;
  error?: string;
}

// ステータスIDとその説明
const statusMessages: Record<string, string> = {
  "0": "状態不明",
  "1": "配信中",
  "2": "送達済み",
  "3": "配信失敗",
};

export default function SmsSendForm() {
  // 送信結果の状態
  const [sendResult, setSendResult] = useState<SendResponse | null>(null);
  const [statusResult, setStatusResult] = useState<StatusResponse | null>(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);

  // フォームの初期化
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumber: "",
      message: "",
      clientTag: `test_${Date.now()}`,
    },
  });

  // 送信処理
  const onSubmit = async (data: FormValues) => {
    try {
      // 送信中は結果をクリア
      setSendResult(null);
      setStatusResult(null);

      // APIにリクエスト
      const response = await fetch("/api/sms/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      // レスポンスの取得
      const result = await response.json();

      // 結果を保存
      setSendResult(result);

      // トースト通知
      if (result.success) {
        toast.success("SMSの送信リクエストが成功しました");
      } else {
        toast.error(`SMSの送信に失敗しました: ${result.responseMessage || result.error || "不明なエラー"}`);
      }
    } catch (error) {
      console.error("SMS送信エラー:", error);
      toast.error("SMS送信中にエラーが発生しました");
    }
  };

  // ステータス確認処理
  const checkStatus = async () => {
    if (!sendResult?.clientTag) {
      toast.error("ステータス確認するには、まずSMSを送信してください");
      return;
    }

    try {
      setIsLoadingStatus(true);

      // APIにリクエスト
      const response = await fetch(`/api/sms/status?clientTag=${encodeURIComponent(sendResult.clientTag)}`);

      // レスポンスの取得
      const result = await response.json();

      // 結果を保存
      setStatusResult(result);

      // トースト通知
      if (result.success) {
        if (result.status && result.status.length > 0) {
          toast.success("SMS配信ステータスを取得しました");
        } else {
          toast.info("SMS配信ステータスが見つかりませんでした");
        }
      } else {
        toast.error(`ステータス取得に失敗しました: ${result.responseMessage || result.error || "不明なエラー"}`);
      }
    } catch (error) {
      console.error("ステータス確認エラー:", error);
      toast.error("ステータス確認中にエラーが発生しました");
    } finally {
      setIsLoadingStatus(false);
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>送信先電話番号</FormLabel>
                <FormControl>
                  <Input placeholder="09012345678 または +819012345678" {...field} />
                </FormControl>
                <FormDescription>
                  国内形式（090xxxxxxxx）または国際電話番号形式（+819xxxxxxxx）で入力してください。
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>メッセージ</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="送信するメッセージを入力してください"
                    rows={4}
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  全角/半角問わず最大660文字まで送信できます。
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="clientTag"
            render={({ field }) => (
              <FormItem>
                <FormLabel>クライアントタグ(オプション)</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  ステータス確認用の識別子です。デフォルトではタイムスタンプが設定されます。
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-4">
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  送信中...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  送信
                </>
              )}
            </Button>

            {sendResult?.success && (
              <Button type="button" variant="outline" onClick={checkStatus} disabled={isLoadingStatus}>
                {isLoadingStatus ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    確認中...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    ステータス確認
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </Form>

      {sendResult && (
        <Card className="mt-6">
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-2">送信結果</h3>
            <div className="grid gap-2 text-sm">
              <div><span className="font-medium">ステータス:</span> {sendResult.success ? '成功' : '失敗'}</div>
              <div><span className="font-medium">レスポンスコード:</span> {sendResult.responseCode}</div>
              <div><span className="font-medium">メッセージ:</span> {sendResult.responseMessage}</div>
              {sendResult.phoneNumber && <div><span className="font-medium">送信先電話番号:</span> {sendResult.phoneNumber}</div>}
              {sendResult.smsMessage && <div><span className="font-medium">送信メッセージ:</span> {sendResult.smsMessage}</div>}
              {sendResult.clientTag && <div><span className="font-medium">クライアントタグ:</span> {sendResult.clientTag}</div>}
              {sendResult.error && <div className="text-red-500"><span className="font-medium">エラー:</span> {sendResult.error}</div>}
              {sendResult.details && <div className="text-red-500"><span className="font-medium">詳細:</span> {sendResult.details}</div>}
            </div>
          </CardContent>
        </Card>
      )}

      {statusResult && statusResult.status && statusResult.status.length > 0 && (
        <Card className="mt-4">
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-2">配信ステータス</h3>
            <div className="space-y-4">
              {statusResult.status.map((status, index) => (
                <div key={index} className="border p-3 rounded-md">
                  <div className="grid gap-2 text-sm">
                    <div><span className="font-medium">取得日時:</span> {status.dateTime}</div>
                    <div><span className="font-medium">送信先電話番号:</span> {status.phoneNumber}</div>
                    <div><span className="font-medium">ステータスID:</span> {status.statusId} - {statusMessages[status.statusId] || status.statusDescription || "不明"}</div>
                    {status.carrierId && <div><span className="font-medium">キャリアID:</span> {status.carrierId} ({status.carrierName || "不明"})</div>}
                    {status.detailedStatusId && <div><span className="font-medium">詳細内部コード:</span> {status.detailedStatusId}</div>}
                    {status.separatedSuccessCount !== undefined && <div><span className="font-medium">課金通数:</span> {status.separatedSuccessCount}</div>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 