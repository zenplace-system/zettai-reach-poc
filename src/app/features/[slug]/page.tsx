import Link from "next/link";
import { notFound } from "next/navigation";
import { features } from "@/lib/features";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import SmsSendForm from "@/components/sms/SmsSendForm";
import SmsBatchSendForm from "@/components/sms/SmsBatchSendForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
        ) : (
          <p className="text-gray-500 italic text-center py-12">
            この機能の検証内容はまだ準備中です。
          </p>
        )}
      </div>
    </div>
  );
} 