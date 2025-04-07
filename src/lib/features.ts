import { LucideIcon, MessageSquare, Calendar, Users, History, Phone, Building, ArrowRight, ActivitySquare, XCircle, FileText, MessagesSquare, Smartphone } from "lucide-react";

export interface Feature {
  id: string;
  title: string;
  description: string;
  useCase: string;
  icon: LucideIcon;
  verified: boolean;
  requiresInquiry?: boolean;
  requiresDevelopment?: boolean;
}

export const features: Feature[] = [
  {
    id: "two-way-sms",
    title: "双方向SMS（送信受信）",
    description: "SMSを送信するだけでなく、SMSで返信することもでき、管理画面上からチャット形式で過去のメッセージのやり取りが確認できる",
    useCase: "会員からの予約変更や質問にSMSで直接応答可能。例えば「本日のヨガクラスに空きはありますか？」という質問に即座に返信でき、予約状況をリアルタイムで伝達できる",
    icon: MessageSquare,
    verified: true,
    requiresInquiry: true
  },
  {
    id: "scheduled-sms",
    title: "SMS予約送信",
    description: "予め指定しておいたSMSを、指定した日時に自動送信する機能",
    useCase: "会員の誕生日に自動でお祝いメッセージや特別オファーを送信。また、体験レッスン前日のリマインダーを自動送信し、キャンセル率を低減",
    icon: Calendar,
    verified: true
  },
  {
    id: "batch-sms",
    title: "SMS個別送信・一斉送信",
    description: "ユーザーごとにSMSを送ることはもちろん、CSVファイルをインポートして一斉にSMSを送ることができる",
    useCase: "急なトレーナー変更や施設メンテナンスによる休館情報を全会員に一斉通知。また、特定のトレーニングプログラム参加者だけにターゲットを絞った情報提供も可能",
    icon: Users,
    verified: true
  },
  {
    id: "message-log",
    title: "メッセージ送信ログ",
    description: "過去に送信したSMSをいつ誰に送ったかの履歴が確認できる",
    useCase: "体験レッスン後のアンケートフォームへの誘導SMSに対する開封・回答率を分析し、フォローアップの最適なタイミングを特定",
    icon: History,
    verified: true
  },
  {
    id: "all-carrier-support",
    title: "国内の全キャリアへSMS送信",
    description: "大手キャリア（MNO）だけでなく、格安SIMなど（MVNO）の携帯電話にもSMS送信が可能です。楽天モバイル（MNO）にも正式対応しています。",
    useCase: "\n          キャリアの種類を問わず、ほぼ全ての携帯電話ユーザーにリーチできるため、重要な会員制度の変更、緊急のお知らせ、プロモーション情報などを確実に届けられます。\n          特に、ターゲット層が多様なキャリアを利用している場合や、連絡先リストにMVNOユーザーが多く含まれる場合に有効です。\n        ",
    icon: Phone,
    verified: true
  },
  {
    id: "sender-id",
    title: "送信元表記指定",
    description: "SMSを受信した際に表示される送信元名（数字またはアルファベット）を指定する機能です。指定方法は契約プランによって異なります。",
    useCase: "送信元をサービス名（例: 〇〇フィットネス）や特定の番号で表示することで、受信者はどこからのメッセージか認識しやすくなり、信頼性が向上します。開封率の向上や、フィッシングSMSとの区別にも繋がります。",
    icon: Building,
    verified: true,
    requiresInquiry: true
  },
  {
    id: "carrier-detection",
    title: "キャリア判定",
    description: "SMSを送信した電話番号（または送信前の電話番号）のキャリア（ドコモ、au、ソフトバンク、楽天モバイルなど）を判定する機能です。管理画面のログやAPIレスポンスで確認できます。",
    useCase: "キャリアごとのSMS到達率を分析し、キャンペーン効果測定や配信戦略の最適化に活用できます。また、特定のキャリアで配信失敗が多い場合に、代替連絡手段（例: LINE連携）を検討する判断材料になります。",
    icon: ActivitySquare,
    verified: true
  },
  {
    id: "opt-out",
    title: "オプトアウト機能",
    description: "SMS受信者が簡単に配信停止できる機能（有料オプション）。メッセージ本文に特定のURLを含めることで、受信者ごとにユニークな配信停止リンクを自動生成します。",
    useCase: "特定電子メール法などの法令遵守に役立ちます。受信者が不要なメッセージを簡単に停止できるようにすることで、顧客満足度を維持し、クレームを減らす効果も期待できます。",
    icon: XCircle,
    verified: true,
    requiresInquiry: true
  },
  {
    id: "personalized-message",
    title: "メッセージ差し込み機能",
    description: "管理画面でメッセージテンプレートを作成し、{{パラメータ名}} 形式で変数を埋め込むことで、宛先ごとにパーソナライズされたSMSを送信できます。",
    useCase: "会員の名前、予約日時、ポイント残高などをメッセージに自動挿入し、個別最適化されたコミュニケーションを実現します。例えば「{{氏名}}様、次回の予約は{{予約日時}}です」のように活用できます。",
    icon: FileText,
    verified: true
  },
  {
    id: "line-integration",
    title: "LINE連携活用",
    description: "SMSとLINE公式アカウントを組み合わせて活用するアプローチ。SMSでLINEの友だち追加を促したり、連絡手段として併用したりします。",
    useCase: "SMSで「LINEで詳細情報をお送りします」と友だち追加リンクを送信。SMSが届かない場合の代替や、リッチコンテンツでの補足情報提供としてLINEを活用。別途LINEのメッセージングAPI等の利用が必要。",
    icon: MessagesSquare,
    verified: false,
    requiresDevelopment: true
  },
  {
    id: "trial-optimization",
    title: "体験レッスン最適化",
    description: "双方向SMSや送信ログ等の機能を組み合わせ、自社開発で体験レッスンの申込から入会までのプロセスを最適化するアプローチです。",
    useCase: "申込後の自動アンケート送信、リマインダー、担当者への情報連携などをシステム化し、対応漏れ防止や顧客満足度向上、入会率アップを目指します。",
    icon: ArrowRight,
    verified: false,
    requiresDevelopment: true
  },
  {
    id: "retention-improvement",
    title: "継続率向上施策",
    description: "予約送信やメッセージ差し込み等の機能を組み合わせ、自社開発で顧客の利用状況に応じたフォローアップを自動化するアプローチです。",
    useCase: "休眠顧客への自動アプローチ、利用頻度に応じたクーポン配信、パーソナルなトレーニング推奨などをシステム化し、顧客エンゲージメントと継続率を高めます。",
    icon: Smartphone,
    verified: false,
    requiresDevelopment: true
  }
]; 