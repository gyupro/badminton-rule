import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "배드민턴 룰 교실",
  description: "초심자를 위한 배드민턴 복식 경기 규칙 튜토리얼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
