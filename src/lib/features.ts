import { LucideIcon, MessageSquare, Calendar, Users, History, Phone, Building, ArrowRight, ActivitySquare, XCircle, FileText, MessagesSquare, Smartphone } from "lucide-react";

export interface Feature {
  id: string;
  title: string;
  description: string;
  useCase: string;
  icon: LucideIcon;
}

export const features: Feature[] = [
  {
    id: "two-way-sms",
    title: "双方向SMS（送信受信）",
    description: "SMSを送信するだけでなく、SMSで返信することもでき、管理画面上からチャット形式で過去のメッセージのやり取りが確認できる",
    useCase: "会員からの予約変更や質問にSMSで直接応答可能。例えば「本日のヨガクラスに空きはありますか？」という質問に即座に返信でき、予約状況をリアルタイムで伝達できる",
    icon: MessageSquare
  },
  {
    id: "scheduled-sms",
    title: "SMS予約送信",
    description: "予め指定しておいたSMSを、指定した日時に自動送信する機能",
    useCase: "会員の誕生日に自動でお祝いメッセージや特別オファーを送信。また、体験レッスン前日のリマインダーを自動送信し、キャンセル率を低減",
    icon: Calendar
  },
  {
    id: "batch-sms",
    title: "SMS個別送信・一斉送信",
    description: "ユーザーごとにSMSを送ることはもちろん、CSVファイルをインポートして一斉にSMSを送ることができる",
    useCase: "急なトレーナー変更や施設メンテナンスによる休館情報を全会員に一斉通知。また、特定のトレーニングプログラム参加者だけにターゲットを絞った情報提供も可能",
    icon: Users
  },
  {
    id: "message-log",
    title: "メッセージ送信ログ",
    description: "過去に送信したSMSをいつ誰に送ったかの履歴が確認できる",
    useCase: "体験レッスン後のアンケートフォームへの誘導SMSに対する開封・回答率を分析し、フォローアップの最適なタイミングを特定",
    icon: History
  },
  {
    id: "all-carrier-support",
    title: "国内の全キャリアへSMS送信",
    description: "MNOだけでなく、MVNO事業者にもSMS送信が可能",
    useCase: "キャリアに関係なく全会員に確実にリーチできるため、重要な会員制度変更や緊急のお知らせも漏れなく配信可能",
    icon: Phone
  },
  {
    id: "sender-id",
    title: "送信元表記指定",
    description: "SMSを受信した際の送信元表記を指定することができる",
    useCase: "送信元を「〇〇フィットネス」と明示することで、会員が安心して開封・対応できる環境を整備。体験レッスン申込者にも信頼感を与える",
    icon: Building
  },
  {
    id: "carrier-detection",
    title: "キャリア判定",
    description: "SMSを送信した電話番号のキャリアを判定する機能",
    useCase: "キャリアごとの配信成功率を分析し、届きにくいキャリアの会員には代替連絡手段（LINE等）を優先的に提案",
    icon: ActivitySquare
  },
  {
    id: "opt-out",
    title: "オプトアウト機能",
    description: "SMSの受信を希望しないエンドユーザーが、自ら送信できる機能",
    useCase: "会員のコミュニケーション選好を尊重しながら、オプトアウトした会員には代替手段（アプリ通知やメール）に自動的に切り替え可能",
    icon: XCircle
  },
  {
    id: "personalized-message",
    title: "メッセージ差し込み機能",
    description: "カスタマイズ項目を設定することで、宛先ごとに異なる内容の個別差し込みSMSを送信可能",
    useCase: "会員の利用状況や前回のトレーニング内容に基づき、「〇〇様、前回の筋力トレーニングから3日経ちました。本日は有酸素運動がおすすめです」など、パーソナライズされたメッセージで継続率向上",
    icon: FileText
  },
  {
    id: "line-integration",
    title: "LINE連携活用",
    description: "LINE友達にもSMSと同レベルの通知が可能",
    useCase: "SMS受信を希望しない会員や、よりリッチなコンテンツでのコミュニケーションを望む会員にはLINEで代替。予約確認画面や施設案内図などをLINEで送信し、LINEでの返信も可能に",
    icon: MessagesSquare
  },
  {
    id: "trial-optimization",
    title: "体験レッスン最適化",
    description: "双方向SMSと送信ログ分析を組み合わせた活用",
    useCase: "体験レッスン申込後、自動SMSでアンケートフォームURLを送信。事前に悩みや目標を収集し、インストラクターが準備してから電話対応することで、顧客満足度と入会率の向上を実現",
    icon: ArrowRight
  },
  {
    id: "retention-improvement",
    title: "継続率向上施策",
    description: "予約送信と差し込み機能の組み合わせ",
    useCase: "2週間ジムに来ていない会員に「〇〇様、お久しぶりです。新しいヨガプログラムが始まりました。次回ご来店時に無料体験できます」など、自動でフォローアップメッセージを送信",
    icon: Smartphone
  }
]; 