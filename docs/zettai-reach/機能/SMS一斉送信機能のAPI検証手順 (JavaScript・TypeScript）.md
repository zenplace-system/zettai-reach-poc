はい、SMS一斉送信機能（CommonMT送信 APIを想定）のAPI検証手順をJavaScript/TypeScriptで記述したmarkdown形式のドキュメントを作成します。

# SMS一斉送信機能 (CommonMT送信 API) 検証手順 (JavaScript/TypeScript)

このドキュメントでは、「絶対リーチ！® SMS Communication Platform」の**CommonMT送信 API** を用いたSMS一斉送信機能の検証手順をJavaScript/TypeScriptで記述する方法について説明します。

## 前提条件

*   **API接続設定**:
    *   API接続は **HTTPS の POST メソッド** を使用します。
    *   SSL/TLS の方式は **TLS1.2 に限定** されています。TLS1.0、1.1 では接続できません。
    *   セキュリティのため、必要に応じて**アクセス元 IP アドレスの制限**を管理画面で設定してください。
*   **認証情報**:
    *   APIリクエストには **token (アクセスキー)** と **clientId (契約クライアント ID)** が必須です。
    *   これらの情報は管理画面のアカウント情報およびクライアント情報で確認してください。
*   **送信元 SMS コード**:
    *   送信には**smsCode (送信元 SMS コード)** が必須です。管理画面のクライアント情報で割り当てられているSMSコードを確認してください。smsCodeは **5桁または6桁** の文字数です。
*   **テスト環境**:
    *   本番環境のAPI URLは `https://sms-api.aossms.com /p5/api/mt.json` です。

## 検証手順

### 1. 必要なライブラリのインストール (JavaScript/TypeScript)

APIリクエストを送信するために、`node-fetch` などのHTTPクライアントライブラリをインストールします。

```bash
npm install node-fetch --save
# または
yarn add node-fetch
```

TypeScriptを使用する場合は、型定義もインストールします。

```bash
npm install @types/node-fetch --save-dev
# または
yarn add @types/node-fetch -D
```

### 2. APIリクエストの作成

`CommonMT送信 API` へリクエストを送信する関数をJavaScript/TypeScriptで作成します。

```typescript
import fetch, { URLSearchParams } from 'node-fetch';

interface SendSMSPayload {
  token: string;
  clientId: string;
  smsCode: string;
  message: string;
  phoneNumber: string;
  carrierId?: '101' | '103' | '105' | '106';
  clientTag?: string;
  scheduleTime?: string; // YYYY-MM-dd HH:mm
  groupTag?: string;
}

async function sendSMS(payload: SendSMSPayload): Promise<any> {
  const endpoint = 'https://sms-api.aossms.com/p5/api/mt.json';
  const params = new URLSearchParams();
  params.append('token', payload.token);
  params.append('clientId', payload.clientId);
  params.append('smsCode', payload.smsCode);
  params.append('message', payload.message);
  params.append('phoneNumber', payload.phoneNumber);
  if (payload.carrierId) {
    params.append('carrierId', payload.carrierId);
  }
  if (payload.clientTag) {
    params.append('clientTag', payload.clientTag);
  }
  if (payload.scheduleTime) {
    params.append('scheduleTime', payload.scheduleTime);
  }
  if (payload.groupTag) {
    params.append('groupTag', payload.groupTag);
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      body: params,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    console.error('API request failed:', error);
    return { status: -1, data: { responseMessage: 'API request failed' } };
  }
}

// 検証用のデータ
const testPayload: SendSMSPayload = {
  token: 'YOUR_API_TOKEN', // ご自身のトークンに置き換えてください
  clientId: 'YOUR_CLIENT_ID', // ご自身のクライアントIDに置き換えてください
  smsCode: 'YOUR_SMS_CODE', // ご自身のSMSコードに置き換えてください
  message: 'テストメッセージ',
  phoneNumber: '+819012345678', // テスト送信先の電話番号
  clientTag: 'test_single_send_' + Date.now(),
};

// APIの実行
sendSMS(testPayload)
  .then(result => {
    console.log('Status:', result.status);
    console.log('Response:', result.data);
    // レスポンスに基づいた検証処理
  });
```

### 3. リクエストパラメータの設定

`CommonMT送信 API` のリクエストボディには以下のパラメータを指定します:

*   **token (必須)**: アカウント登録時に発行されるアクセスキー (32文字).
*   **clientId (必須)**: 契約クライアント ID (半角数字).
*   **smsCode (必須)**: 送信元 SMS コード (5～6文字).
*   **message (必須)**: 送信メッセージ (1～660文字、全角/半角問わず文字数でカウント).
*   **phoneNumber (必須)**: 送信先電話番号 (日本国内形式または国際電話番号形式。国際電話番号形式についてはを参照).
*   **carrierId (任意)**: キャリア ID ( `"101"`: AU, `"103"`: Docomo, `"105"`: Softbank, `"106"`: 楽天モバイル)。指定しない場合は自動判定.
*   **clientTag (任意)**: 送信ステータス確認用の任意の識別文字列 (1～200文字)。**必ずユニークな値** を指定してください。重複があるとエラーになります.
*   **scheduleTime (任意)**: 予約送信時間 (形式: `yyyy-MM-dd HH:mm`).
*   **groupTag (任意)**: 予約確認・一括キャンセル用の任意識別文字列 (1～200文字). **2023/12/27 に追加されたパラメータ** です.

**一斉送信** を行う場合は、`phoneNumber` に複数の電話番号をループ処理などで指定し、上記の `sendSMS` 関数を複数回呼び出すことになります。ただし、**TPS (Transactions Per Second)** の上限は **600TPS** ですので、上限を超過しないように注意してください。

### 4. レスポンスの確認

APIリクエストが成功した場合、HTTPステータスコード `200` が返され、レスポンスボディは以下のJSON形式となります:

```json
{
  "responseCode": 0,
  "responseMessage": "Success.",
  "phoneNumber": "+819012345678",
  "smsMessage": "example message"
}
```

*   `responseCode`: `0` は成功を示します。
*   `responseMessage`: 成功時のメッセージは `"Success."` です。
*   `phoneNumber`: 送信先の電話番号。
*   `smsMessage`: 送信したメッセージ内容。

`responseCode` が `0` 以外の場合はエラーが発生しています。`responseMessage` を確認し、必要に応じてリクエストパラメータなどを修正してください。

### 5. コールバックの確認 (DLR通知)

`CommonMT送信 API` では、送信結果（配信状況）を **コールバック** で受け取ることができます.

*   **本番環境コールバックURL**: `https://sms-api.aossms.com /p5/api/mt.json`. (実際にはこのURLにPOSTリクエストが送信されます)
*   コールバックのペイロードは以下のJSON形式です:

```json
{
  "eventNotifications": [
    {
      "type": "DLR",
      "dateTime": "2023/01/01 12:30:00",
      "messageId": "abcdefghijklmnopqrstuv0123456789",
      "phoneNumber": "+819012345678",
      "smsCode": 12345,
      "carrierId": 101,
      "carrierName": "AU",
      "messageText": "example message",
      "clientId": 12345,
      "clientTag": "example tag",
      "statusId": 2,
      "statusDescription": "Message delivered",
      "detailedStatusId": 2,
      "separatedSuccessCount": 1
    }
  ]
}
```

*   `statusId`: 送信ステータス (参照: `0`: 不明, `1`: 配信中, `2`: 送達, `3`: 配信失敗).
*   `statusDescription`: `statusId` に対応する説明.
*   `detailedStatusId`: 詳細内部コード (配信失敗の場合に詳細な理由が提供される。将来予告なく変更される可能性があるため、厳密な参照は非推奨).
*   `separatedSuccessCount`: 分割送信された成功数 (). **2023/11/21 にレスポンスに追加された項目** です.

コールバックを受け取るためのAPIエンドポイントを別途用意し、上記の形式のJSONデータを受信して処理を行う必要があります。

### 6. 予約送信の検証

`scheduleTime` パラメータを指定することで予約送信が可能です. 指定した日時にSMSが送信されることを確認してください。

また、**CommonMT 予約送信確認 API** () を利用することで、予約状況を確認できます。`clientTag`、`scheduleTime`、`scheduleDate`、`groupTag` などのパラメータを指定して、予約情報が正しく登録されているかを確認してください。

```typescript
// CommonMT 予約送信確認 API の利用例 (簡略化)
async function checkReservation(token: string, clientId: string, clientTag: string): Promise<any> {
  const endpoint = `https://sms-api.aossms.com/p5/api/checkreservation.json?token=${token}&clientId=${clientId}&clientTag=${clientTag}`;
  // ... fetch処理 ...
}
```

### 7. 送信ステータスの確認

`CommonMT ステータス取得 API` () を利用することで、個別の送信ステータスを確認できます。`date` (送信日) または `clientTag` を指定して、送信結果を取得できます。`clientTag` は、`CommonMT送信 API` のリクエスト時に指定したユニークな識別文字列です.

```typescript
// CommonMT ステータス取得 API の利用例 (簡略化)
async function getStatus(token: string, clientId: string, clientTag: string): Promise<any> {
  const endpoint = `https://sms-api.aossms.com/p5/api/status.json?token=${token}&clientId=${clientId}&clientTag=${clientTag}`;
  // ... fetch処理 ...
}
```

### 8. エラーケースの検証

以下の点に注意してエラーケースの検証を行ってください。

*   **必須パラメータの欠如**: `token`, `clientId`, `smsCode`, `message`, `phoneNumber` のいずれかが欠けている場合のエラーレスポンスを確認します。
*   **パラメータの形式不正**: `token` の文字数、`smsCode` の文字数、`phoneNumber` の形式などに誤りがある場合のエラーレスポンスを確認します。
*   **文字数上限**: `message` の文字数が上限を超えている場合のエラーレスポンスを確認します。
*   **存在しない `smsCode`、`clientId`**: 無効な値を指定した場合のエラーレスポンスを確認します。
*   **TPS超過**: 短時間に大量のリクエストを送信し、流量制限が実施されることを確認します。
*   **`clientTag` の重複**: `CommonMT送信 API` で重複した `clientTag` を指定した場合のエラーレスポンスを確認します。

## 注意事項

*   **KDDI の送信失敗通知**: KDDI宛の送信で失敗した場合、KDDIからの失敗ステータスの通知に**20分程度**時間を要する場合があります。
*   **詳細内部コード**: `detailedStatusId` は将来予告なく追加・変更される可能性があるため、プログラム実装では厳密に参照せず、例外を許容するよう推奨されています。
*   **Y!Mobile (旧 Willcom、PHS 回線)**: 2021年1月31日にサービス終了しています。
*   **レスポンスの rawdata**: 各レスポンスの rawdata は廃止予定のため参照は推奨されません。
*   APIのURLは **2022年3月に変更** されています。旧URLではなく、このドキュメントに記載されている新URLを使用してください。
*   **国際電話番号形式**: 国際電話番号を指定する場合は、の形式に従い、URLエンコードが必要な場合があります。

上記の手順と注意点に従って、SMS一斉送信機能のAPI検証を行ってください。
