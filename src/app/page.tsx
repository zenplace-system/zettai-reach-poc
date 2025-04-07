import Link from "next/link";
import { features } from "@/lib/features";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, AlertTriangle, Wrench } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function Page() {
  return (
    <TooltipProvider>
      <div className="container mx-auto py-8 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">zenシステム開発: 絶対リーチSMS PoC</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            当社の会員管理システムにおけるSMS活用例を検証するサイトです。
            以下の機能について検証結果をご確認いただけます。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            let statusIcon = null;
            let cardBorderClass = "";

            if (feature.requiresDevelopment) {
              cardBorderClass = "border-orange-500 border-2";
              statusIcon = (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center text-orange-600 cursor-help">
                      <Wrench className="h-5 w-5 mr-1" />
                      <span className="text-xs font-medium">要開発</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>この施策の実現には自社開発が必要です。</p>
                  </TooltipContent>
                </Tooltip>
              );
            } else if (feature.verified && feature.requiresInquiry) {
              cardBorderClass = "border-yellow-500 border-2";
              statusIcon = (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center text-yellow-600 cursor-help">
                      <AlertTriangle className="h-5 w-5 mr-1" />
                      <span className="text-xs font-medium">要問合せ</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>検証には追加プラン/開発や確認が必要です。</p>
                  </TooltipContent>
                </Tooltip>
              );
            } else if (feature.verified) {
              cardBorderClass = "border-green-500 border-2";
              statusIcon = (
                <div className="flex items-center text-green-600">
                  <CheckCircle2 className="h-5 w-5 mr-1" />
                  <span className="text-xs font-medium">機能検証済み</span>
                </div>
              );
            }

            return (
              <Link href={`/features/${feature.id}`} key={feature.id} className="block transition-transform hover:scale-105">
                <Card className={`h-full hover:shadow-lg ${cardBorderClass}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <feature.icon className="h-6 w-6 text-primary" />
                        <CardTitle className="text-xl">{feature.title}</CardTitle>
                      </div>
                      {statusIcon}
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
            );
          })}
        </div>
      </div>
    </TooltipProvider>
  );
}
