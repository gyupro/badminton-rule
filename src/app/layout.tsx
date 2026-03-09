import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "배드민턴 룰 교실",
  description: "초심자를 위한 배드민턴 복식 경기 규칙 튜토리얼",
  openGraph: {
    title: "🏸 배드민턴 룰 교실",
    description: "복식 경기, 헷갈리는 위치 선정 완벽 정리! 인터랙티브 튜토리얼로 배드민턴 규칙을 쉽게 배워보세요.",
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "🏸 배드민턴 룰 교실",
    description: "복식 경기, 헷갈리는 위치 선정 완벽 정리!",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
