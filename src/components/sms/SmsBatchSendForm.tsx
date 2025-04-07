"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2, Send, RefreshCw, Upload, Download } from "lucide-react";
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
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

// フォームのバリデーションスキーマ
const formSchema = z.object({
  phoneNumbersText: z
    .string()
    .min(1, "少なくとも1つの電話番号が必要です"),
  message: z
    .string()
    .min(1, "メッセージは必須です")
    .max(660, "メッセージは660文字以内で入力してください"),
  groupTag: z
    .string()
    .max(200, "グループタグは200文字以内で入力してください")
    .optional(),
});

// フォームの入力値の型
type FormValues = z.infer<typeof formSchema>;

// 送信状態の型
type SendState = {
  inProgress: boolean;
  totalItems: number;
  processedItems: number;
  success: number;
  failed: number;
  groupTag: string | null;
};

// 電話番号のバリデーション関数
const validatePhoneNumber = (phoneNumber: string) => {
  return /^(\+81|0)(([26789]0[1-9][0-9]{7}$)|(20[1-9][0-9]{10}$))/.test(phoneNumber);
};

export default function SmsBatchSendForm() {
  // 送信状態
  const [sendState, setSendState] = useState<SendState>({
    inProgress: false,
    totalItems: 0,
    processedItems: 0,
    success: 0,
    failed: 0,
    groupTag: null,
  });

  // 送信結果
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [batchResult, setBatchResult] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [statusResult, setStatusResult] = useState<any>(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);

  // フォームの初期化
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumbersText: "",
      message: "",
      groupTag: `batch_${Date.now()}`,
    },
  });

  // 電話番号テキストをパースして配列に変換
  const parsePhoneNumbers = (text: string): string[] => {
    // 改行で分割
    let lines = text.split(/\r?\n/);
    
    // カンマ区切りもサポート
    if (lines.length === 1 && lines[0].includes(',')) {
      lines = lines[0].split(',');
    }
    
    // 空文字をフィルタリングして整形
    return lines
      .map(line => line.trim())
      .filter(line => line.length > 0);
  };

  // 送信処理
  const onSubmit = async (data: FormValues) => {
    try {
      // テキストを電話番号配列にパース
      const phoneNumbers = parsePhoneNumbers(data.phoneNumbersText);
      
      if (phoneNumbers.length === 0) {
        toast.error("有効な電話番号がありません。");
        return;
      }

      // バリデーション
      const invalidNumbers = phoneNumbers.filter(num => !validatePhoneNumber(num));
      if (invalidNumbers.length > 0) {
        toast.error(`無効な電話番号があります: ${invalidNumbers.slice(0, 3).join(', ')}${invalidNumbers.length > 3 ? ' など' : ''}`);
        return;
      }

      // 送信状態を初期化
      setBatchResult(null);
      setStatusResult(null);
      setSendState({
        inProgress: true,
        totalItems: phoneNumbers.length,
        processedItems: 0,
        success: 0,
        failed: 0,
        groupTag: data.groupTag || `batch_${Date.now()}`,
      });

      // APIにリクエスト
      const response = await fetch("/api/sms/batch-send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumbers,
          message: data.message,
          groupTag: data.groupTag || `batch_${Date.now()}`,
        }),
      });

      // レスポンスの取得
      const result = await response.json();

      // 結果を保存
      setBatchResult(result);
      setSendState(prev => ({
        ...prev,
        inProgress: false,
        processedItems: prev.totalItems,
        success: result.summary?.success || 0,
        failed: (result.summary?.failed || 0) + (result.summary?.errors || 0),
      }));

      // トースト通知
      if (result.success) {
        toast.success(`${result.summary.total}件中${result.summary.success}件のSMS送信リクエストが成功しました`);
      } else {
        toast.error(`SMS一斉送信に失敗しました: ${result.error || "不明なエラー"}`);
      }
    } catch (error) {
      console.error("SMS一斉送信エラー:", error);
      toast.error("SMS一斉送信中にエラーが発生しました");
      setSendState(prev => ({
        ...prev,
        inProgress: false,
      }));
    }
  };

  // ステータス確認処理
  const checkStatus = async () => {
    if (!batchResult?.groupTag) {
      toast.error("ステータス確認するには、まずSMS一斉送信を実行してください");
      return;
    }

    try {
      setIsLoadingStatus(true);

      // APIにリクエスト
      const response = await fetch(`/api/sms/batch-status?groupTag=${encodeURIComponent(batchResult.groupTag)}`);

      // レスポンスの取得
      const result = await response.json();

      // 結果を保存
      setStatusResult(result);

      // トースト通知
      if (result.success) {
        if (result.summary?.total > 0) {
          toast.success(`${result.summary.total}件のSMS配信ステータスを取得しました`);
        } else {
          toast.info("SMS配信ステータスが見つかりませんでした");
        }
      } else {
        toast.error(`ステータス取得に失敗しました: ${result.error || "不明なエラー"}`);
      }
    } catch (error) {
      console.error("一斉送信ステータス確認エラー:", error);
      toast.error("ステータス確認中にエラーが発生しました");
    } finally {
      setIsLoadingStatus(false);
    }
  };

  // サンプルCSVダウンロード
  const downloadSampleCsv = () => {
    const csvContent = "09012345678\n09023456789\n09034567890";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'sample_phone_numbers.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success("サンプルCSVファイルをダウンロードしました");
  };

  // ファイルアップロードハンドラ
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      form.setValue('phoneNumbersText', content);
      toast.success(`${parsePhoneNumbers(content).length}件の電話番号を読み込みました`);
    };
    reader.readAsText(file);
  };

  // 進捗率の計算
  const progressPercentage = sendState.totalItems > 0
    ? Math.round((sendState.processedItems / sendState.totalItems) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="text">
            <TabsList className="mb-2">
              <TabsTrigger value="text">テキスト入力</TabsTrigger>
              <TabsTrigger value="file">ファイル</TabsTrigger>
            </TabsList>
            
            <TabsContent value="text">
              <FormField
                control={form.control}
                name="phoneNumbersText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>送信先電話番号一覧</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="09012345678
09023456789
09034567890"
                        rows={6}
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      電話番号を1行ごとに入力してください。（カンマ区切りも可）
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>
            
            <TabsContent value="file">
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={downloadSampleCsv}>
                    <Download className="mr-2 h-4 w-4" />
                    サンプルCSVダウンロード
                  </Button>
                  <div className="relative">
                    <Input
                      type="file"
                      id="csvFile"
                      accept=".csv,.txt"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={handleFileUpload}
                    />
                    <Button type="button" variant="secondary">
                      <Upload className="mr-2 h-4 w-4" />
                      CSVアップロード
                    </Button>
                  </div>
                </div>
                <FormDescription>
                  CSVファイルは電話番号のみを含む1列のデータ形式です。
                </FormDescription>
              </div>
            </TabsContent>
          </Tabs>

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
            name="groupTag"
            render={({ field }) => (
              <FormItem>
                <FormLabel>グループタグ(オプション)</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  一斉送信のグループを識別するタグです。デフォルトではタイムスタンプが設定されます。
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-4">
            <Button 
              type="submit" 
              className="w-full md:w-auto" 
              disabled={form.formState.isSubmitting || sendState.inProgress}
            >
              {form.formState.isSubmitting || sendState.inProgress ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  送信中...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  一斉送信
                </>
              )}
            </Button>

            {batchResult?.success && !sendState.inProgress && (
              <Button 
                type="button" 
                variant="outline" 
                className="w-full md:w-auto" 
                onClick={checkStatus} 
                disabled={isLoadingStatus}
              >
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

      {sendState.inProgress && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-500">
            <span>処理中: {sendState.processedItems}/{sendState.totalItems}</span>
            <span>{progressPercentage}%</span>
          </div>
          <Progress value={progressPercentage} />
        </div>
      )}

      {batchResult && (
        <Card className="mt-6">
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-2">送信結果</h3>
            <div className="grid gap-2 text-sm">
              <div><span className="font-medium">グループタグ:</span> {batchResult.groupTag}</div>
              <div><span className="font-medium">送信先数:</span> {batchResult.summary?.total || 0}</div>
              <div><span className="font-medium">成功:</span> {batchResult.summary?.success || 0}</div>
              <div><span className="font-medium">失敗:</span> {batchResult.summary?.failed || 0}</div>
              <div><span className="font-medium">エラー:</span> {batchResult.summary?.errors || 0}</div>
              
              {batchResult.results && batchResult.results.length > 0 && (
                <div className="mt-2">
                  <details className="cursor-pointer">
                    <summary className="font-medium">詳細結果 ({batchResult.results.length}件)</summary>
                    <div className="mt-2 border rounded-md p-2 max-h-60 overflow-y-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="p-1 text-left">No.</th>
                            <th className="p-1 text-left">電話番号</th>
                            <th className="p-1 text-left">結果</th>
                            <th className="p-1 text-left">メッセージ</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                          {batchResult.results.map((result: any, index: number) => (
                            <tr key={index} className="border-t">
                              <td className="p-1">{index + 1}</td>
                              <td className="p-1">{result.phoneNumber}</td>
                              <td className="p-1">{result.success ? '成功' : '失敗'}</td>
                              <td className="p-1">{result.responseMessage}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </details>
                </div>
              )}
              
              {batchResult.errors && batchResult.errors.length > 0 && (
                <div className="mt-2">
                  <details className="cursor-pointer">
                    <summary className="font-medium text-red-500">エラー詳細 ({batchResult.errors.length}件)</summary>
                    <div className="mt-2 border border-red-200 rounded-md p-2 max-h-40 overflow-y-auto bg-red-50">
                      <ul className="list-disc pl-5">
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {batchResult.errors.map((error: any, index: number) => (
                          <li key={index} className="text-red-600">
                            {error.phoneNumber}: {error.error}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </details>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {statusResult && (
        <Card className="mt-4">
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-2">配信ステータス</h3>
            <div className="grid gap-2 text-sm">
              <div><span className="font-medium">グループタグ:</span> {statusResult.groupTag}</div>
              <div><span className="font-medium">総件数:</span> {statusResult.summary?.total || 0}</div>
              
              {statusResult.summary?.byStatusId && Object.keys(statusResult.summary.byStatusId).length > 0 && (
                <div>
                  <span className="font-medium">ステータス別件数:</span>
                  <ul className="list-disc pl-5 mt-1">
                    {Object.entries(statusResult.summary.byStatusId).map(([statusId, count]) => (
                      <li key={statusId}>
                        {statusId === '0' ? '状態不明' :
                         statusId === '1' ? '配信中' :
                         statusId === '2' ? '送達済み' :
                         statusId === '3' ? '配信失敗' : `ステータス${statusId}`}: {count}件
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {statusResult.deliveryStatus?.status && statusResult.deliveryStatus.status.length > 0 && (
                <div className="mt-2">
                  <details className="cursor-pointer">
                    <summary className="font-medium">配信詳細 ({statusResult.deliveryStatus.status.length}件)</summary>
                    <div className="mt-2 border rounded-md p-2 max-h-60 overflow-y-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="p-1 text-left">電話番号</th>
                            <th className="p-1 text-left">ステータス</th>
                            <th className="p-1 text-left">キャリア</th>
                            <th className="p-1 text-left">時刻</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                          {statusResult.deliveryStatus.status.map((status: any, index: number) => (
                            <tr key={index} className="border-t">
                              <td className="p-1">{status.phoneNumber}</td>
                              <td className="p-1">
                                {status.statusId === '0' ? '状態不明' :
                                 status.statusId === '1' ? '配信中' :
                                 status.statusId === '2' ? '送達済み' :
                                 status.statusId === '3' ? '配信失敗' : 
                                 status.statusDescription || `ステータス${status.statusId}`}
                              </td>
                              <td className="p-1">{status.carrierName || '-'}</td>
                              <td className="p-1">{status.dateTime}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </details>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 