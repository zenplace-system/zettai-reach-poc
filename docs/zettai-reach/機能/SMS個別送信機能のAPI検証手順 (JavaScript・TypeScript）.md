## SMS個別送信機能のAPI検証手順 (JavaScript/TypeScript)

「絶対リーチ！® SMS Communication Platform」のAPIを利用してSMSの個別送信をテストし、ステータス取得APIで配信状況を確認する手順を以下に説明します。

### 1. 事前準備

*   **APIキーの取得**: 管理画面のアカウント情報から**トークン**（アクセスキー）と**契約クライアントID**を取得します。これらはAPIリクエストの認証に必要です。
*   **送信元SMSコードの確認**: 管理画面のクライアント情報から、利用可能な**送信元SMSコード**を確認します。
*   **テスト送信先の電話番号**: テスト用にSMSを送信する電話番号を用意します。国内形式または国際電話番号形式が利用可能です。国際電話番号形式の場合は、先頭に`+81`を付け、URLエンコードが必要な場合は`%2b81`のようにエンコードします。
*   **API接続**: API接続は**HTTPSのGET/POSTメソッド**を利用します。**SSL/TLSの方式はTLS1.2に限定**されているため、注意してください。

### 2. SMS送信テスト (CommonMT 送信)

1.  **APIエンドポイント**: 最新の「CommonMT 送信」APIのエンドポイントは以下です。
    ```
    https://sms-api.aossms.com /p5/api/mt.json
    ```
2.  **HTTPメソッド**: **POST** メソッドを使用します。
3.  **Content-Type**: リクエストの `Content-Type` は `application/x-www-form-urlencoded` です。
4.  **リクエストパラメータ**: 以下のパラメータをリクエストボディに含めます。
    *   **token** (必須): 取得したトークン (32文字)。
    *   **clientId** (必須): 取得した契約クライアントID。
    *   **smsCode** (必須): 確認した送信元SMSコード (5桁または6桁)。
    *   **phoneNumber** (必須): テスト送信先の電話番号 (国内または国際形式)。
    *   **message** (必須): 送信するメッセージ (1～660文字)。
    *   **clientTag** (推奨): 送信ステータス確認用の任意のユニークな識別文字列 (1～200文字)。**ステータス取得時に必要となるため、必ずユニークな値を指定してください**。
    *   **scheduleTime** (任意): 予約送信時間 (`yyyy-MM-dd HH:mm`形式)。
    *   **groupTag** (任意): 予約確認・一括キャンセル用の任意識別文字列 (1～200文字)。
    *   **carrierId** (任意): 送信先キャリアID (例: `101` (AU), `103` (Docomo), `105` (Softbank), `106` (楽天モバイル))。指定しない場合は自動判定されます。

5.  **JavaScript/TypeScriptでの実装例 (fetch APIを使用)**:

    ```javascript
    const token = 'YOUR_TOKEN'; // 取得したトークンに置き換えてください
    const clientId = 'YOUR_CLIENT_ID'; // 取得したクライアントIDに置き換えてください
    const smsCode = 'YOUR_SMS_CODE'; // 確認したSMSコードに置き換えてください
    const phoneNumber = '+81XXXXXXXXXX'; // テスト送信先の電話番号に置き換えてください
    const message = 'テストメッセージ';
    const clientTag = 'test_' + Date.now(); // ユニークなclientTagを生成

    const params = new URLSearchParams();
    params.append('token', token);
    params.append('clientId', clientId);
    params.append('smsCode', smsCode);
    params.append('phoneNumber', phoneNumber);
    params.append('message', message);
    params.append('clientTag', clientTag);

    fetch('https://sms-api.aossms.com/p5/api/mt.json', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
    })
    .then(response => response.json())
    .then(data => {
        console.log('送信APIレスポンス:', data);
        if (data.responseCode === 0) {
            console.log('SMS送信成功. phoneNumber:', data.phoneNumber, 'message:', data.smsMessage);
            // ここで clientTag を保存しておくと、後のステータス取得に利用できます
        } else {
            console.error('SMS送信失敗:', data.responseMessage);
        }
    })
    .catch(error => {
        console.error('送信APIリクエストエラー:', error);
    });
    ```

6.  **レスポンス**: 成功した場合、`responseCode` は `0`、`responseMessage` は `"Success."` となり、送信先の電話番号などが返却されます。

### 3. 配信状況の確認 (CommonMT ステータス取得)

1.  **APIエンドポイント**: 「CommonMT ステータス取得」APIのエンドポイントは以下です。
    ```
    https://sms-api.aossms.com /p5/api/status.json
    ```
2.  **HTTPメソッド**: **GET** メソッドを使用します。
3.  **クエリパラメータ**: 以下のいずれかのパラメータをクエリパラメータとして含めます。
    *   **token** (必須): 取得したトークン (32文字)。
    *   **clientId** (必須): 取得した契約クライアントID。
    *   **clientTag** (必須または date が必須): SMS送信時に指定した **clientTag** (推奨)。
    *   **date** (必須または clientTag が必須): SMS送信日 (`yyyyMMdd`形式)。

4.  **JavaScript/TypeScriptでの実装例 (fetch APIを使用)**:

    ```javascript
    const token = 'YOUR_TOKEN'; // 取得したトークンに置き換えてください
    const clientId = 'YOUR_CLIENT_ID'; // 取得したクライアントIDに置き換えてください
    const clientTagToCheck = 'test_' + /* 送信時に生成したclientTag */; // 送信時に使用したclientTag

    const queryParams = new URLSearchParams();
    queryParams.append('token', token);
    queryParams.append('clientId', clientId);
    queryParams.append('clientTag', clientTagToCheck);

    const apiUrl = `https://sms-api.aossms.com/p5/api/status.json?${queryParams.toString()}`;

    fetch(apiUrl, {
        method: 'GET',
    })
    .then(response => response.json())
    .then(data => {
        console.log('ステータス取得APIレスポンス:', data);
        if (data.responseCode === 0) {
            if (data.status && data.status.length > 0) {
                data.status.forEach(status => {
                    console.log('phoneNumber:', status.phoneNumber);
                    console.log('statusId:', status.statusId, 'statusDescription:', status.statusDescription);
                    console.log('detailedStatusId:', status.detailedStatusId);
                    console.log('キャリアID:', status.carrierId, 'キャリア名:', status.carrierName);
                    console.log('配信成功数 (分割送信時):', status.separatedSuccessCount);
                });
            } else {
                console.log('該当するステータス情報は見つかりませんでした。');
            }
        } else {
            console.error('ステータス取得API失敗:', data.responseMessage);
        }
    })
    .catch(error => {
        console.error('ステータス取得APIリクエストエラー:', error);
    });
    ```

5.  **レスポンス**: 成功した場合、`responseCode` は `0`、`responseMessage` は `"Success."` となり、`status` 配列に配信状況の詳細が含まれます。
    *   `statusId`: 配信ステータス (0: 不明, 1: 配信中, 2: 送達, 3: 配信失敗)。
    *   `statusDescription`: `statusId` の説明。
    *   `detailedStatusId`: 詳細内部コード (配信失敗時)。詳細については を参照ください。
    *   `carrierId`: キャリアID。
    *   `carrierName`: キャリア名。
    *   `separatedSuccessCount`: 分割送信時の成功カウント。

### 注意事項

*   **KDDIの遅延**: KDDI宛の送信が失敗した場合、KDDIからの失敗ステータスの通知に**20分程度**時間を要する場合があります。
*   **clientTagのユニーク性**: 「CommonMT 送信」APIで `clientTag` を指定する場合は、**必ずユニークな値を指定**してください。重複があるとエラーになります。
*   **TPS制限**: 「CommonMT 送信」APIのリクエストは全体で**600TPS** (1秒あたりのリクエスト件数) での受け付けが可能です。上限を超過した場合は一時的に流量制限が実施される場合があります。
*   **詳細内部コード**: `detailedStatusId` は将来予告なく追加・変更される可能性があるため、プログラム実装では厳密に参照することは避け、例外を許容することが推奨されます。
*   **国際電話番号形式**: 国際電話番号形式を使用する場合は、指定された形式に従い、URLエンコードが必要な場合は適切に処理してください。

上記の手順とコード例を参考に、JavaScript/TypeScriptで「絶対リーチ！® SMS Communication Platform」のSMS個別送信機能のAPI検証を行ってください。
