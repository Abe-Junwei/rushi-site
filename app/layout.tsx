import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "如是我闻 Rushi - 本地中文课录音转写与校对",
  description:
    "如是我闻是面向中文课录音的本地转写与校对桌面应用，支持波形语段校对、TXT/SRT/DOCX 导出与 macOS、Windows 下载。",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "如是我闻 Rushi",
    description: "本地中文课录音，转写与校对。",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
