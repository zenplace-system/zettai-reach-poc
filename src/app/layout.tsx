import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "zenシステム開発: 絶対リーチSMS PoC",
  description: "会員管理システムにおけるSMS活用例を検証するサイト",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="border-b shadow-sm py-4">
          <div className="container mx-auto px-4">
            <Link href="/" className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-primary"
              >
                <path d="M15 10v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2Z" />
                <path d="m22 6-5 3 5 3Z" />
                <path d="M15 12.1v-5a2 2 0 0 0-2-2H8.8" />
              </svg>
              <span className="font-bold text-xl">絶対リーチSMS</span>
            </Link>
          </div>
        </header>
        <main>
          {children}
        </main>
        <footer className="border-t py-6 mt-12">
          <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
            &copy; 2024 絶対リーチSMS PoC
          </div>
        </footer>
        <Toaster />
      </body>
    </html>
  );
}
