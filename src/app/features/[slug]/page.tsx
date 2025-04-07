import Link from "next/link";
import { notFound } from "next/navigation";
import { features } from "@/lib/features";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import SmsSendForm from "@/components/sms/SmsSendForm";
import SmsBatchSendForm from "@/components/sms/SmsBatchSendForm";
import SmsScheduledSendForm from "@/components/sms/SmsScheduledSendForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from 'next/image';

export async function generateStaticParams() {
  return features.map((feature) => ({
    slug: feature.id,
  }));
}

interface PageProps {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function FeatureDetailPage({ params }: PageProps) {
  const awaitedParams = await params;
  const { slug } = awaitedParams;
  
  const feature = features.find((feature) => feature.id === slug);

  if (!feature) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <Link href="/" className="inline-block">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            戻る
          </Button>
        </Link>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <feature.icon className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">{feature.title}</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">機能概要</h2>
            <p className="text-gray-700">{feature.description}</p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">活用例</h2>
            <p className="text-gray-700">{feature.useCase}</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <h2 className="text-2xl font-semibold mb-4">機能検証</h2>

        {slug === 'batch-sms' ? (
          <div>
            <p className="mb-6">絶対リーチSMSのAPIを使って、実際にSMSを送信・確認することができます。</p>
            
            <Tabs defaultValue="single">
              <TabsList className="mb-4">
                <TabsTrigger value="single">個別送信</TabsTrigger>
                <TabsTrigger value="batch">一斉送信</TabsTrigger>
              </TabsList>
              
              <TabsContent value="single">
                <h3 className="text-xl font-medium mb-4">SMS個別送信</h3>
                <SmsSendForm />
              </TabsContent>
              
              <TabsContent value="batch">
                <h3 className="text-xl font-medium mb-4">SMS一斉送信</h3>
                <SmsBatchSendForm />
              </TabsContent>
            </Tabs>
          </div>
        ) : slug === 'scheduled-sms' ? (
          <div>
            <p className="mb-6">絶対リーチSMSのAPIを使って、指定した日時にSMSを予約送信することができます。</p>
            <h3 className="text-xl font-medium mb-4">SMS予約送信</h3>
            <SmsScheduledSendForm />
          </div>
        ) : slug === 'two-way-sms' ? (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-6 rounded-lg text-center">
            <h3 className="text-xl font-semibold mb-3">検証には追加のお手続きが必要です</h3>
            <p className="mb-4">
              双方向SMS機能のAPIを利用した検証には、「絶対リーチ！SMS」の**2-Wayプラン**へのご加入と、API利用に関する追加情報が必要です。
            </p>
            <p>
              詳細については、<a href="https://aicross.co.jp/zettai-reach/contact/" target="_blank" rel="noopener noreferrer" className="underline font-medium hover:text-yellow-900">AI CROSS Inc. へ直接お問い合わせ</a>いただき、PoC（概念実証）やAPIの利用方法についてご確認ください。
            </p>
          </div>
        ) : slug === 'message-log' ? (
          <div>
            <p className="mb-6">絶対リーチSMSの管理画面では、送信したメッセージの詳細なログを確認できます。</p>
            <div className="bg-gray-100 p-4 rounded-lg border mb-6">
              <h3 className="text-lg font-semibold mb-4 text-center">管理画面キャプチャ</h3>
              <Image
                src="/images/zettai-reach-message-log.png"
                alt="絶対リーチSMS メッセージ送信ログ画面キャプチャ"
                width={1200}
                height={750}
                className="rounded-md shadow-md mx-auto"
                priority
              />
            </div>
            <p className="text-sm text-gray-600">
              上記キャプチャのように、SMSコード、送信方法、配信結果、期間などでフィルタリングしたり、送信先番号やクライアントタグで検索したりすることが可能です。
              検索結果はCSV形式でダウンロードすることもできます。
            </p>
            <p className="mt-4 text-sm text-gray-600">
              API経由でこれらのログを取得する機能については、現在ドキュメント上では確認できていません。
              必要に応じて <a href="https://aicross.co.jp/zettai-reach/contact/" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">AI CROSS Inc. へ直接お問い合わせ</a>ください。
            </p>
          </div>
        ) : slug === 'all-carrier-support' ? (
          <div>
            {/* 機能概要と活用例は features.ts から取得されるのでここでは表示しない */}
            
            {/* 用語解説 */}
            <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg mb-6 text-sm">
              <h3 className="font-semibold mb-2 text-base">【用語解説】</h3>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>MNO (エムエヌオー):</strong> Mobile Network Operator の略。自社で通信回線網を持つ携帯電話事業者（例: ドコモ, au, ソフトバンク, 楽天モバイル）。</li>
                <li><strong>MVNO (エムブイエヌオー):</strong> Mobile Virtual Network Operator の略。MNOから回線網を借りて、格安SIMなどの独自のモバイルサービスを提供する事業者。</li>
              </ul>
            </div>

            {/* 機能検証方法の例 */}
            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <h2 className="text-xl font-semibold mb-3">機能検証方法 (例)</h2>
              <p className="text-gray-700 mb-4">
                この機能は、特定のAPIエンドポイントを呼び出すものではなく、通常のSMS送信（個別・一斉・予約）が、MNO/MVNO問わず様々なキャリアの電話番号に対して成功するかどうかで検証します。
              </p>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li><strong>テスト用電話番号の準備:</strong> 主要なMNO（ドコモ、au、ソフトバンク、楽天モバイル）および、可能であればいくつかのMVNOサービスの電話番号を準備します。</li>
                <li><strong>SMS送信の実施:</strong> 「SMS個別送信・一斉送信」または「SMS予約送信」の検証機能、あるいは直接APIを利用して、準備した各テスト番号宛にSMSを送信します。</li>
                <li><strong>送信結果の確認:</strong>
                  <ul className="list-disc list-inside ml-4 mt-1">
                    <li>各端末でSMSが正常に受信できるか確認します。</li>
                    <li>絶対リーチSMSの管理画面（メッセージ送信ログ）で、各送信のステータスが「送達」となっていることを確認します。</li>
                    <li>APIでステータスを取得する場合は、ステータス確認APIを利用して結果を確認します。</li>
                  </ul>
                </li>
              </ol>
              <p className="mt-4 text-xs text-gray-500 italic">
                ※ 実際のMVNO回線でのテストが難しい場合は、MNO回線（特に楽天モバイルへの送信成功）を確認することで、基本的な対応状況を推測できます。
              </p>
            </div>
          </div>
        ) : slug === 'sender-id' ? (
          <div>
            {/* 機能概要と活用例は features.ts から取得 */}
            
            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <h2 className="text-xl font-semibold mb-3">プランによる指定方法の違い</h2>
              <p className="text-gray-700 mb-4">
                送信元表記の指定方法は、契約している「絶対リーチ！SMS」のプランによって異なります。
              </p>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="border p-4 rounded-md">
                  <h3 className="font-medium text-lg mb-2">1-Way Alpha プラン</h3>
                  <p className="text-sm text-gray-600">3～11文字のアルファベットで送信元を指定できます。<br/>(例: &quot;ABCService&quot;)</p>
                </div>
                <div className="border p-4 rounded-md">
                  <h3 className="font-medium text-lg mb-2">2-Way プラン</h3>
                  <p className="text-sm text-gray-600">キャリアごとに定められた数字列 (0005 + 4～6桁の数字) で指定します。<br/>(例: &quot;000512345&quot;)</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 italic">
                ※ 上記以外のプランや、詳細な指定ルールについては、別途お問い合わせが必要です。
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <h2 className="text-xl font-semibold mb-3">APIでの指定について</h2>
              <p className="text-gray-700 mb-4">
                APIを利用してSMSを送信する場合、リクエストに含まれる `smsCode` パラメータが送信元表記に対応します。
                管理画面で払い出された `smsCode` を指定して送信します。
              </p>
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg text-sm">
                <p>
                  <span className="font-semibold">注意:</span> API仕様書には、`smsCode` が具体的にアルファベット形式（1-Way Alphaプランの場合など）に対応しているかどうかの明確な記述はありません。
                  アルファベット表記の送信元をAPI経由で利用したい場合は、事前に <a href="https://aicross.co.jp/zettai-reach/contact/" target="_blank" rel="noopener noreferrer" className="underline font-medium hover:text-yellow-900">AI CROSS Inc. へお問い合わせ</a>いただくことをお勧めします。
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <h2 className="text-xl font-semibold mb-3">機能検証方法 (例)</h2>
              <p className="text-gray-700 mb-4">
                送信元表記が意図通りに受信側で表示されるかは、実際の送信テストで確認します。
              </p>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li><strong>送信元設定の確認:</strong> 管理画面等で利用可能な `smsCode`（送信元表記）を確認します。契約プランに応じた形式（数字またはアルファベット）であることを確認してください。</li>
                <li><strong>SMS送信の実施:</strong> 確認した `smsCode` を使用して、テスト用の携帯電話番号にSMSを送信します。（API送信、管理画面からの送信など）</li>
                <li><strong>受信確認:</strong> テスト端末でSMSを受信し、送信元として表示される名前や番号が、指定した `smsCode` と一致するか、または意図した表記になっているかを確認します。</li>
              </ol>
              <p className="mt-4 text-xs text-gray-500 italic">
                ※ キャリアや端末によって送信元表記の表示仕様が若干異なる場合があります。
                ※ 複数の送信元表記を契約している場合は、それぞれでテストを実施します。
              </p>
            </div>

          </div>
        ) : slug === 'carrier-detection' ? (
          <div>
            {/* 機能概要と活用例は features.ts から取得 */}

            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <h2 className="text-xl font-semibold mb-3">キャリア情報の確認方法</h2>
              <p className="text-gray-700 mb-4">
                送信したSMSのキャリア情報は、以下の方法で確認できます。
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-lg mb-2">1. 管理画面のメッセージ送信ログ</h3>
                  <p className="text-sm text-gray-600 mb-3">管理画面の「メッセージ送信ログ」で、各送信履歴の「キャリア」列に判定結果が表示されます。</p>
                  <Image
                    src="/images/zettai-reach-message-log-carrier.png"
                    alt="絶対リーチSMS メッセージ送信ログ キャリア表示例"
                    width={600}
                    height={300}
                    className="rounded-md shadow-md border"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-2">2. 配信ステータスAPIのレスポンス</h3>
                  <p className="text-sm text-gray-600 mb-3">ステータス確認API (`/api/sms/status`) を利用した場合、レスポンス内の `status` 配列の各要素に `carrierId` と `carrierName` が含まれます。</p>
                  <Image
                    src="/images/zettai-reach-status-api-carrier.png"
                    alt="絶対リーチSMS 配信ステータスAPI レスポンス例"
                    width={600}
                    height={300}
                    className="rounded-md shadow-md border"
                  />
                  <p className="text-xs text-gray-500 mt-2 italic">※ `carrierId`: 101=AU, 103=Docomo, 105=Softbank, 106=楽天モバイル</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <h2 className="text-xl font-semibold mb-3">機能検証方法 (例)</h2>
              <p className="text-gray-700 mb-4">
                異なるキャリアの電話番号に対してSMSを送信し、上記の方法でキャリア情報が正しく取得・表示されるかを確認します。
              </p>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li><strong>テスト用電話番号の準備:</strong> 既知の異なるキャリア（ドコモ、au、ソフトバンク、楽天モバイルなど）の電話番号を準備します。</li>
                <li><strong>SMS送信の実施:</strong> 準備した各テスト番号宛にSMSを送信します。</li>
                <li><strong>管理画面での確認:</strong> 送信後、管理画面のメッセージ送信ログを開き、各送信履歴に対応する正しいキャリア名が表示されているか確認します。</li>
                <li><strong>APIでの確認 (任意):</strong> 送信時に指定した `clientTag` を使用してステータス確認API (`/api/sms/status`) を呼び出し、レスポンスに正しい `carrierId` と `carrierName` が含まれているか確認します。</li>
              </ol>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg text-sm">
               <p>
                  <span className="font-semibold">補足:</span> キャリア判定API ( `/p5/api/carrierjudge.json` ) というものも存在するようですが、これは送信前にキャリアを判定するためのAPIであり、送信後のログやステータス確認とは目的が異なります。
                  詳細は別途ドキュメントやお問い合わせでご確認ください。
                </p>
            </div>

          </div>
        ) : slug === 'opt-out' ? (
          <div>
            {/* 機能概要と活用例は features.ts から取得 */}

            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg mb-6 text-sm">
              <p>
                <span className="font-semibold">注意:</span> この機能は「絶対リーチ！SMS」の**有料オプション**です。利用するには別途お申し込みが必要です。
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <h2 className="text-xl font-semibold mb-3">機能の利用方法</h2>
              <p className="text-gray-700 mb-4">
                オプトアウト機能オプションを契約後、以下の手順で利用できます。
              </p>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>SMSメッセージ本文の末尾などに、配信停止案内文と共に指定のURL文字列 <code>https://ai9.jp/0PT0UT</code> を含めます。</li>
                <li>APIまたは管理画面からSMSを送信します。</li>
                <li>システムが自動的に <code>0PT0UT</code> の部分を受信者固有の識別子に変換し、ユニークな配信停止リンクとして送信します。</li>
                <li>受信者がそのリンクをクリックすると、配信停止手続き画面が表示されます。</li>
              </ol>
              <p className="mt-4 text-xs text-gray-500 italic">
                例: 「配信停止はこちら https://ai9.jp/0PT0UT」 のように本文に記載します。
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <h2 className="text-xl font-semibold mb-3">機能検証方法 (例)</h2>
              <p className="text-gray-700 mb-4">
                実際にSMSを送信し、配信停止リンクが正しく機能するかを確認します。
              </p>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li><strong>オプション契約確認:</strong> オプトアウト機能オプションが契約済みであることを確認します。</li>
                <li><strong>SMS送信:</strong> メッセージ本文に指定のURL <code>https://ai9.jp/0PT0UT</code> を含めて、テスト用の携帯電話番号にSMSを送信します。</li>
                <li><strong>受信とリンク確認:</strong> テスト端末でSMSを受信し、本文中のURLが有効なリンクになっていること、クリックできることを確認します。</li>
                <li><strong>配信停止操作:</strong> リンクをクリックし、表示される配信停止画面で手続きを行います。</li>
                <li><strong>配信停止状態の確認:</strong>
                  <ul className="list-disc list-inside ml-4 mt-1">
                    <li>管理画面などで、該当の電話番号が配信停止リストに追加されているか確認します（※管理画面の仕様によります）。</li>
                    <li>再度同じ番号にSMSを送信しようとした場合に、エラーになるか、または送信対象から除外されるかなどを確認します（※システムの挙動によります）。</li>
                  </ul>
                </li>
              </ol>
              <p className="mt-4 text-xs text-gray-500 italic">
                ※ 配信停止後の具体的な挙動（再送信時のエラーなど）や、停止リストの管理方法については、オプション契約時の資料やお問い合わせでご確認ください。
              </p>
            </div>

          </div>
        ) : slug === 'personalized-message' ? (
          <div>
            {/* 機能概要と活用例は features.ts から取得 */}

            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <h2 className="text-xl font-semibold mb-3">管理画面での設定方法</h2>
              <p className="text-gray-700 mb-4">
                管理画面の「メッセージ定型文登録」機能を利用して、差し込み項目を含むメッセージテンプレートを作成できます。
              </p>
              <div className="mb-4">
                 <Image
                    src="/images/zettai-reach-message-template.png"
                    alt="絶対リーチSMS メッセージ定型文登録画面"
                    width={1000}
                    height={500}
                    className="rounded-md shadow-md border mx-auto"
                  />
              </div>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 text-sm">
                <li><strong>テンプレート作成:</strong> 管理画面の「メッセージ定型文登録」で、テンプレートのタイトルと定型文内容を入力します。</li>
                <li><strong>パラメータ埋め込み:</strong> 定型文内容の中で、差し込みたい箇所に <code>{'{{パラメータ名}}'}</code> の形式で変数を記述します。（例: <code>{'{{氏名}}'}様、こんにちは！</code>）</li>
                <li><strong>パラメータ定義:</strong> 画面下部の「パラメータ」セクションで、本文中に埋め込んだパラメータ名（<code>{'{{ }}'}</code> を除いた部分）を追加します。</li>
                <li><strong>保存:</strong> 作成したテンプレートを保存します。</li>
              </ol>
              <p className="mt-4 text-xs text-gray-500 italic">
                ※ 登録したテンプレートは、管理画面からの個別・一斉送信や、API経由での送信時に利用できます。
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <h2 className="text-xl font-semibold mb-3">APIでの利用について</h2>
              <p className="text-gray-700 mb-4">
                API経由で差し込み機能を利用する場合、主に以下の方法が考えられます（詳細はAPI仕様書やお問い合わせでご確認ください）。
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm">
                <li><strong>テンプレート利用:</strong> 事前に管理画面で登録したテンプレートIDを指定し、送信APIリクエスト時に各パラメータに対応する値を渡して送信する。</li>
                <li><strong>直接指定:</strong> 送信APIリクエストのメッセージ本文に直接 <code>{'{{パラメータ名}}'}</code> を含め、同時にパラメータと値を指定して送信する（※この方法が可能かは要確認）。</li>
              </ul>
               <p className="mt-4 text-xs text-gray-500 italic">
                ※ テンプレート一覧を取得するAPI (`/p5/api/template.json`) も存在します。
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <h2 className="text-xl font-semibold mb-3">機能検証方法 (例)</h2>
              <p className="text-gray-700 mb-4">
                実際にパラメータを含むメッセージを送信し、受信側で正しく情報が差し込まれているかを確認します。
              </p>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li><strong>テンプレート準備:</strong> 管理画面で、差し込み用のパラメータ（例: <code>{'{{氏名}}'}</code>, <code>{'{{予約日}}'}</code>）を含むメッセージテンプレートを作成・保存します。</li>
                <li><strong>送信データ準備:</strong> 送信先の電話番号と、各パラメータに対応する値（例: 氏名=&quot;山田太郎&quot;, 予約日=&quot;明日15時&quot;）のリスト（CSVなど）を準備します。</li>
                <li><strong>SMS送信 (管理画面 or API):</strong>
                    <ul className="list-disc list-inside ml-4 mt-1">
                        <li>管理画面から一斉送信機能などを利用し、準備したテンプレートと送信データを指定して送信します。</li>
                        <li>または、送信APIを利用し、テンプレートIDとパラメータ値を指定して送信リクエストを行います。</li>
                    </ul>
                </li>
                <li><strong>受信確認:</strong> テスト端末でSMSを受信し、メッセージ本文のパラメータ部分が、指定した値（例: &quot;山田太郎様、次回の予約は明日15時です&quot;）に正しく置き換わっていることを確認します。</li>
                <li><strong>複数宛先確認:</strong> 複数の宛先に異なる値を設定した場合、それぞれ正しくパーソナライズされているかを確認します。</li>
              </ol>
            </div>

          </div>
        ) : slug === 'line-integration' ? (
          <div>
            {/* 機能概要と活用例は features.ts から取得 */}

            <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg mb-6 text-sm">
              <p>
                <span className="font-semibold">補足:</span> これは「絶対リーチ！SMS」の直接的な機能ではなく、SMSとLINE公式アカウントを組み合わせて活用する一般的なアプローチの紹介です。
                LINEメッセージの送信には、別途 <a href="https://developers.line.biz/ja/docs/messaging-api/overview/" target="_blank" rel="noopener noreferrer" className="underline font-medium hover:text-blue-900">LINE Messaging API</a> などの利用と、自社での開発・実装が必要です。
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <h2 className="text-xl font-semibold mb-3">SMSとLINEの組み合わせ例</h2>
              <p className="text-gray-700 mb-4">
                SMSの確実なリーチ力と、LINEのリッチな表現力や双方向性を組み合わせることで、より効果的な顧客コミュニケーションを実現できます。
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm">
                <li><strong>LINEへの誘導:</strong> SMSでキャンペーン告知や重要なお知らせの概要を送り、「詳細やクーポンはLINEで！」のようにLINE公式アカウントへの友だち追加やアクセスを促す。</li>
                <li><strong>補完的な情報提供:</strong> SMSで予約リマインダーを送り、地図や持ち物などの補足情報をLINEで送信する。</li>
                <li><strong>代替チャネル:</strong> SMSの受信を希望しない、またはSMSが届かない顧客に対して、同意を得た上でLINEを主要な連絡手段とする。</li>
                <li><strong>詳細なやり取り:</strong> SMSで簡単な案内を送り、個別の質問や相談はLINEのチャットで対応する。</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <h2 className="text-xl font-semibold mb-3">実現に必要な要素 (一般例)</h2>
              <p className="text-gray-700 mb-4">
                SMSとLINEを連携させるシステムを構築する場合、一般的に以下の要素が必要になります。
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm">
                <li><strong>顧客データベース:</strong> 電話番号とLINEアカウント情報（UserIDなど）を管理するデータベース。</li>
                <li><strong>LINE Messaging API の利用:</strong> LINEメッセージを送受信するためのAPI連携実装。</li>
                <li><strong>絶対リーチSMS API の利用:</strong> SMSを送信するためのAPI連携実装。</li>
                <li><strong>連携ロジック:</strong> どの顧客に、どのタイミングで、SMSとLINEのどちら（または両方）でメッセージを送るかを制御するビジネスロジックの実装。</li>
                <li><strong>ユーザー同意管理:</strong> LINEでの連絡に対するユーザーの同意を取得・管理する仕組み。</li>
              </ul>
            </div>
            
            {/* 検証方法のセクションは、具体的な機能ではないため削除 */}

          </div>
        ) : slug === 'trial-optimization' ? (
          <div>
            {/* 機能概要と活用例は features.ts から取得 */}

            <div className="bg-orange-50 border border-orange-200 text-orange-800 p-4 rounded-lg mb-6 text-sm">
              <p>
                <span className="font-semibold">注記:</span> これは「絶対リーチ！SMS」の特定の機能ではなく、既存機能を組み合わせて**自社開発で実現する施策例**です。
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <h2 className="text-xl font-semibold mb-3">実現する仕組み (例)</h2>
              <p className="text-gray-700 mb-4">
                体験レッスンの申込受付から入会までのプロセスを自動化・効率化し、顧客体験と入会率の向上を目指します。
              </p>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 text-sm">
                <li><strong>申込トリガー:</strong> Webサイトの申込フォーム送信などをトリガーに、顧客情報を自社システムに登録します。</li>
                <li><strong>自動アンケートSMS送信:</strong> 絶対リーチSMSの送信APIを利用し、申込直後に事前アンケート（Googleフォームなど）のURLを含むSMSを自動送信します。（メッセージ差し込み機能で氏名などをパーソナライズ可能）</li>
                <li><strong>リマインダーSMS送信:</strong> 予約日時が近づいたら、予約送信APIを利用してリマインダーSMSを自動送信します。</li>
                <li><strong>担当者への情報連携:</strong> 申込情報やアンケート回答結果を社内システム（CRM、Slackなど）に自動通知し、担当者がスムーズに対応できるようにします。</li>
                <li><strong>双方向SMSでの質疑応答 (オプション):</strong> 2-Wayプランを契約していれば、顧客からの質問にSMSで直接対応できます。</li>
                <li><strong>ログ分析と改善:</strong> 送信ログAPIや管理画面ログでSMSの到達状況や開封率（URLクリックなどから推測）を分析し、メッセージ内容や送信タイミングを改善します。</li>
              </ol>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <h2 className="text-xl font-semibold mb-3">開発・実装のポイント</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm">
                <li><strong>API連携:</strong> 絶対リーチSMSの各種API（送信、予約送信、ステータス確認など）と自社システムを連携させる開発が必要です。</li>
                <li><strong>ワークフロー設計:</strong> 申込から入会までのどの段階で、どのようなSMSを、どのタイミングで送るか、詳細なワークフローを設計します。</li>
                <li><strong>データ管理:</strong> 顧客情報、申込情報、アンケート回答、SMS送信履歴などを一元管理するデータベースが必要です。</li>
                <li><strong>エラーハンドリング:</strong> APIエラーや送信失敗時の処理を考慮します。</li>
              </ul>
            </div>
          </div>
        ) : slug === 'retention-improvement' ? (
           <div>
            {/* 機能概要と活用例は features.ts から取得 */}

            <div className="bg-orange-50 border border-orange-200 text-orange-800 p-4 rounded-lg mb-6 text-sm">
              <p>
                <span className="font-semibold">注記:</span> これは「絶対リーチ！SMS」の特定の機能ではなく、既存機能を組み合わせて**自社開発で実現する施策例**です。
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <h2 className="text-xl font-semibold mb-3">実現する仕組み (例)</h2>
              <p className="text-gray-700 mb-4">
                顧客の利用状況や属性に合わせてパーソナライズされたフォローアップを自動化し、エンゲージメントと継続率の向上を目指します。
              </p>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 text-sm">
                <li><strong>データ連携:</strong> 会員管理システムやPOSシステムから顧客の最終利用日、利用頻度、購入履歴などのデータを取得します。</li>
                <li><strong>セグメント化とトリガー設定:</strong> 取得したデータに基づき、「最終利用日からX日経過」「累計利用回数Y回達成」などの条件で顧客をセグメント化し、自動送信のトリガーを設定します。</li>
                <li><strong>パーソナライズドSMS送信:</strong>
                     <ul className="list-disc list-inside ml-4 mt-1">
                        <li>絶対リーチSMSの予約送信APIまたは通常の送信APIを利用します。</li>
                        <li>メッセージ差し込み機能（テンプレートAPIまたは送信時のパラメータ指定）を使い、顧客名や利用状況に応じたメッセージ（例: <code>{"{{氏名}}様、お久しぶりです。新しいプログラムのご案内です"}</code><code>{"{{氏名}}様、X回目のご利用ありがとうございます！クーポンをどうぞ"}</code>）を送信します。</li>
                     </ul>
                </li>
                 <li><strong>効果測定と改善:</strong> 送信ログやその後の顧客行動（再来店、クーポン利用など）を分析し、セグメント条件、メッセージ内容、送信タイミングなどを継続的に改善します。</li>
              </ol>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <h2 className="text-xl font-semibold mb-3">開発・実装のポイント</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm">
                <li><strong>データ分析基盤:</strong> 顧客データを分析し、効果的なセグメントやトリガーを見つけ出すための基盤が必要です。</li>
                <li><strong>API連携とバッチ処理:</strong> 定期的に顧客データをチェックし、条件に合致した顧客に自動でSMSを送信するためのAPI連携とバッチ処理等の開発が必要です。</li>
                <li><strong>メッセージテンプレート管理:</strong> 様々なセグメントやシナリオに対応するための、柔軟なメッセージテンプレート管理機能が有効です。</li>
                 <li><strong>配信停止連携:</strong> オプトアウト機能を利用している場合、配信停止した顧客には自動送信しないように連携させる必要があります。</li>
              </ul>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 italic text-center py-12">
            この機能の検証内容はまだ準備中です。
          </p>
        )}
      </div>
    </div>
  );
} 