import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const TITLE = "배드민턴 룰 교실 - 복식 서브 위치 완벽 정리";
const DESCRIPTION =
  "복식 경기, 헷갈리는 위치 선정 완벽 정리! 인터랙티브 튜토리얼·점수 시뮬레이터·퀴즈로 배드민턴 복식 규칙을 쉽게 배워보세요.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["배드민턴", "복식", "규칙", "서브 위치", "배드민턴 룰", "점수 계산", "초보"],
  alternates: { canonical: "/" },
  openGraph: {
    title: "🏸 배드민턴 룰 교실",
    description: DESCRIPTION,
    type: "website",
    locale: "ko_KR",
    siteName: "배드민턴 룰 교실",
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
  themeColor: "#f97316",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
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
