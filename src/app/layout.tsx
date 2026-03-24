import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OpenUCLA — Course Materials by Students",
  description:
    "An open-source archive of UCLA syllabi, notes, and study resources. Built by Bruins, for Bruins.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-gray-200 bg-white py-6 text-center text-xs text-gray-400">
          <p>
            OpenUCLA is open source ·{" "}
            <a href="https://github.com/DNKYr/open-ucla" className="text-[#2774AE] hover:underline">
              GitHub
            </a>{" "}
            ·{" "}
            <a href="/takedown" className="text-[#2774AE] hover:underline">
              Takedown Request
            </a>{" "}
            ·{" "}
            <a href="/about" className="text-[#2774AE] hover:underline">
              About
            </a>
          </p>
          <p className="mt-1">Built by UCLA students. Not affiliated with UCLA administration.</p>
        </footer>
      </body>
    </html>
  );
}
