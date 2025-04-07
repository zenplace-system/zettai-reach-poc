"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2, Send, CalendarClock } from "lucide-react";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { cn } from "@/lib/utils";

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
  scheduledTime: z.date({
    required_error: "予約日時は必須です。",
  }).refine(date => date > new Date(), {
    message: "予約日時は現在時刻より未来である必要があります。",
  }),
});

// フォームの入力値の型
type FormValues = z.infer<typeof formSchema>;

// 送信レスポンスの型 (仮)
interface ScheduleResponse {
  responseCode: number;
  responseMessage: string;
  success: boolean;
  error?: string;
  details?: string;
  scheduledJobId?: string; // 予約ジョブIDなどを返す想定
}


export default function SmsScheduledSendForm() {
  // 送信結果の状態
  const [scheduleResult, setScheduleResult] = useState<ScheduleResponse | null>(null);

  // フォームの初期化
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumber: "",
      message: "",
      clientTag: `schedule_test_${Date.now()}`,
      scheduledTime: undefined, // 初期値は未設定
    },
  });

  // 送信処理 (予約APIを想定)
  const onSubmit = async (data: FormValues) => {
    try {
      setScheduleResult(null);

      const formattedData = {
        ...data,
        scheduledTime: data.scheduledTime.toISOString(), // ISO 8601形式で送信
      };

      // APIにリクエスト (予約用エンドポイント /api/sms/schedule を想定)
      const response = await fetch("/api/sms/schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      const result = await response.json();
      setScheduleResult(result);

      if (result.success) {
        toast.success("SMSの予約リクエストが成功しました");
        // フォームをリセットするなど、成功時の挙動を追加可能
        form.reset(); // 例: 成功したらフォームをリセット
        form.setValue('clientTag', `schedule_test_${Date.now()}`); // clientTagを再生成
      } else {
        toast.error(`SMSの予約に失敗しました: ${result.responseMessage || result.error || "不明なエラー"}`);
      }
    } catch (error) {
      console.error("SMS予約エラー:", error);
      toast.error("SMS予約中にエラーが発生しました");
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* 電話番号、メッセージ、クライアントタグのフィールドはSmsSendFormと同様 */}
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
                  予約管理用の識別子です。デフォルトではタイムスタンプが設定されます。
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 予約日時フィールド */}
          <FormField
            control={form.control}
            name="scheduledTime"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>予約日時</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP HH:mm", { locale: ja })
                        ) : (
                          <span>日時を選択</span>
                        )}
                        <CalendarClock className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date: Date) => date < new Date(new Date().setHours(0, 0, 0, 0))} // 過去日は選択不可
                      initialFocus
                      locale={ja}
                    />
                    {/* 時刻入力 */}
                    <div className="p-3 border-t border-border">
                      <p className="text-sm mb-2">時刻 (HH:mm)</p>
                      <Input
                        type="time"
                        defaultValue={field.value ? format(field.value, "HH:mm") : ""}
                        onChange={(e) => {
                          const time = e.target.value;
                          const [hours, minutes] = time.split(':').map(Number);
                          const newDate = field.value ? new Date(field.value) : new Date();
                          newDate.setHours(hours, minutes, 0, 0); // 秒、ミリ秒は0に設定
                          field.onChange(newDate);
                        }}
                      />
                    </div>
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  SMSを送信する日時を指定してください。
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
                  予約中...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  予約送信
                </>
              )}
            </Button>
            {/* 予約送信では即時ステータス確認は通常不要 */}
          </div>
        </form>
      </Form>

      {scheduleResult && (
        <Card className="mt-6">
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-2">予約結果</h3>
            <div className="grid gap-2 text-sm">
              <div><span className="font-medium">ステータス:</span> {scheduleResult.success ? '成功' : '失敗'}</div>
              <div><span className="font-medium">レスポンスコード:</span> {scheduleResult.responseCode}</div>
              <div><span className="font-medium">メッセージ:</span> {scheduleResult.responseMessage}</div>
              {scheduleResult.scheduledJobId && <div><span className="font-medium">予約ID:</span> {scheduleResult.scheduledJobId}</div>}
              {scheduleResult.error && <div className="text-red-500"><span className="font-medium">エラー:</span> {scheduleResult.error}</div>}
              {scheduleResult.details && <div className="text-red-500"><span className="font-medium">詳細:</span> {scheduleResult.details}</div>}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 