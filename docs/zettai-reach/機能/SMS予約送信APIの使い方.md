はい、SMS予約送信APIの使い方について、提供された情報に基づいてMarkdown形式でまとめます。

## SMS予約送信APIの使い方

このドキュメントでは、「絶対リーチ！® SMS Communication Platform」のAPIを利用したSMSの予約送信機能について説明します。

### 予約送信の仕組み

SMSの予約送信は、**CommonMT送信 API** (`/p5/api/mt.json`) を利用して行います。リクエスト時に、送信日時を指定するためのパラメータ **`scheduleTime`** を含めることで、指定した日時にSMSを送信するように予約できます。

### 予約送信関連API

予約送信に関連するAPIは以下の通りです。

*   **CommonMT 送信 (予約送信)**
    *   **エンドポイント:** `https://sms-api.aossms.com/p5/api/mt.json`
    *   **メソッド:** POST
    *   **概要:** SMSメッセージを送信します。**`scheduleTime`** パラメータを指定することで予約送信が可能です。
    *   **リクエストボディ (application/x-www-form-urlencoded):**
        *   **`token` (必須):** アカウント登録時に発行されるアクセスキー。
        *   **`clientId` (必須):** 契約クライアントID。管理画面で確認できます。
        *   **`smsCode` (必須):** 送信元SMSコード。管理画面で確認できます。5桁または6桁です。
        *   **`message` (必須):** 送信するメッセージ内容。最大660文字。
        *   **`phoneNumber` (必須):** 送信先電話番号。日本国内形式または国際電話番号形式で指定します。国際電話番号形式については「別記事項・国際電話番号形式について」を参照してください。
        *   `carrierId` (任意): キャリアID。指定しない場合は自動判定されます。利用可能なキャリアIDは 101 (AU), 103 (Docomo), 105 (Softbank), 106 (楽天モバイル) です。
        *   `clientTag` (任意): 送信ステータス確認用の任意の識別文字列。ユニークな値を指定してください。最大200文字。DLR通知を受け取る場合に指定します。
        *   **`scheduleTime` (任意):** 予約送信時間。形式は **`YYYY-MM-dd HH:mm`** です。
        *   `groupTag` (任意): 予約確認・一括キャンセル用の任意の識別文字列。最大200文字。
    *   **レスポンス:**
        *   `responseCode`: 応答コード。0が成功。
        *   `responseMessage`: 応答メッセージ。
        *   `phoneNumber`: リクエストで指定した送信先電話番号 (国際電話番号形式)。
        *   `smsMessage`: 送信したメッセージ内容。
    *   **注意:** KDDIへの送信で失敗した場合、KDDIからの失敗ステータス通知に20分程度かかる場合があります。

*   **CommonMT 予約送信確認**
    *   **エンドポイント:** `https://sms-api.aossms.com/p5/api/checkreservation.json`
    *   **メソッド:** GET
    *   **概要:** 予約送信の状況を確認します。
    *   **クエリパラメータ:**
        *   **`token` (必須):** アクセスキー。
        *   **`clientId` (必須):** クライアントID。
        *   **`smsCode` (必須):** 送信元SMSコード。
        *   `clientTag` (任意): 確認したい予約のclientTag。`scheduleTime`または`scheduleDate`のいずれかが必須です。優先度は `clientTag` > `scheduleTime` > `scheduleDate` です。
        *   `scheduleTime` (任意): 確認したい予約の送信時間 (YYYY-MM-dd HH:mm)。`clientTag`または`scheduleDate`のいずれかが必須です。`groupTag`も指定されている場合は組み合わせ条件になります。
        *   `scheduleDate` (任意): 確認したい予約の送信日 (YYYYMMdd)。`clientTag`または`scheduleTime`のいずれかが必須です。`groupTag`も指定されている場合は組み合わせ条件になります。
        *   `groupTag` (任意): 予約リクエスト時に指定したgroupTag。`scheduleTime`または`scheduleDate`と組み合わせて検索できます。
    *   **レスポンス:**
        *   `responseCode`: 応答コード。0が成功。
        *   `responseMessage`: 応答メッセージ。
        *   `count`: 予約中のジョブの件数。
        *   `status`: 予約情報の配列。各要素には `scheduleTime`, `phoneNumber`, `message`, `smsCode`, `clientTag` が含まれます。

*   **CommonMT 予約送信キャンセル**
    *   **エンドポイント:** `https://sms-api.aossms.com/p5/api/cancelreservation.json`
    *   **メソッド:** GET
    *   **概要:** clientTagを指定して予約送信をキャンセルします。
    *   **クエリパラメータ:**
        *   **`token` (必須):** アクセスキー。
        *   **`clientId` (必須):** クライアントID。半角数字で指定します。
        *   **`clientTag` (必須):** キャンセルしたい予約のclientTag。
    *   **レスポンス:**
        *   `responseCode`: 応答コード。0が成功。
        *   `responseMessage`: 応答メッセージ。
        *   `clientTag`: キャンセルを試みたclientTag。

*   **CommonMT 予約送信一括キャンセル**
    *   **エンドポイント:** `https://sms-api.aossms.com/p5/api/cancelreservationall.json`
    *   **メソッド:** GET
    *   **概要:** 条件を指定して複数の予約送信をまとめてキャンセルします。
    *   **クエリパラメータ:**
        *   **`token` (必須):** アクセスキー。
        *   **`clientId` (必須):** クライアントID。半角数字で指定します。
        *   `startDate` (任意): キャンセルする予約の開始日 (YYYYMMdd)。endDateを指定しない場合は、startDate以降の予約がキャンセルされます。
        *   `endDate` (任意): キャンセルする予約の終了日 (YYYYMMdd)。startDateを指定しない場合は、endDate以前の予約がキャンセルされます。
        *   `groupTag` (任意): キャンセルする予約のgroupTag。startDate、endDateを指定しない場合は、groupTagが一致する予約がキャンセルされます。startDate、endDateのいずれかまたは両方が指定されている場合は、groupTagと日付範囲が一致する予約がキャンセルされます。
        *   startDate、endDate、groupTagをすべて指定しない場合は、すべての予約がキャンセルされます。
    *   **レスポンス:**
        *   `responseCode`: 応答コード。0が成功。
        *   `responseMessage`: 応答メッセージ。

### 注意点

*   **`scheduleTime` の形式:** 予約送信時間を指定する **`scheduleTime`** パラメータは、**`YYYY-MM-dd HH:mm`** の形式で指定する必要があります。
*   **接続方式:** API接続はHTTPSのGET/POSTメソッドを使用します。SSL/TLSの方式はTLS1.2に限定されています。
*   **接続元IPアドレスの制限:** セキュリティのため、APIを使用するアクセス元IPアドレスを制限できます。管理画面で設定可能です。
*   **TPS (Transactions Per Second):** CommonMT送信 APIリクエストは全体で600TPSでの受け付けが可能です。上限を超過した場合は一時的に流量制限が実施される場合があります。
*   **`clientTag` の管理:** `clientTag` は送信ステータスの確認や、個別予約のキャンセルに利用されます。予約送信時に `clientTag` を指定することで、後からその `clientTag` を使って予約状況の確認やキャンセルができます。
*   **`groupTag` の管理:** `groupTag` は複数の予約をまとめて管理したり、一括でキャンセルしたりする際に便利です。

### 参考情報

各APIのリクエストやレスポンスの具体的な例は、ソース内の以下の箇所に記載されています。

*   **CommonMT 送信:**
*   **CommonMT 予約送信確認:**
*   **CommonMT 予約送信キャンセル:**
*   **CommonMT 予約送信一括キャンセル:**

これらの情報を参考に、SMS予約送信APIをご利用ください。
