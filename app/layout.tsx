import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConfigProvider } from "./context/ConfigContext";

// 폰트 설정: 자간을 좁게(-0.02em 등) 설정하여 애플 스타일처럼 렌더링되게 합니다.
const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });

export const metadata: Metadata = {
  title: "채채의 수학",
  description: "선생님과 학생을 위한 깔끔하고 모던한 교육 웹 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${inter.variable} tracking-tight`}>
        <ConfigProvider>
          {children}
        </ConfigProvider>
      </body>
    </html>
  );
}
