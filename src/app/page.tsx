import Link from "next/link";
import { features } from "@/lib/features";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Page() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">zenシステム開発: 絶対リーチSMS PoC</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          当社の会員管理システムにおけるSMS活用例を検証するサイトです。
          以下の機能について検証結果をご確認いただけます。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <Link href={`/features/${feature.id}`} key={feature.id} className="block transition-transform hover:scale-105">
            <Card className="h-full hover:shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <feature.icon className="h-6 w-6 text-primary" />
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </div>
                <CardDescription className="line-clamp-2">{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 line-clamp-3">
                  <span className="font-medium">活用例：</span>
                  {feature.useCase}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
