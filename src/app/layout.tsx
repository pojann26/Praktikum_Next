import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getUserPreferences } from "@/lib/preferences";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HematKu - Dashboard Keuangan Mahasiswa",
  description: "Kelola pemasukan dan pengeluaran dengan mudah",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const preferences = await getUserPreferences();
  const themeClass = preferences.theme === "light" ? "light" : "dark";

  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased ${themeClass}`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
