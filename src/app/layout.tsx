import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google"; // The "Coder" Font
import "./globals.css";
import { Toaster } from "sonner";

// Font Setup
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "True608 | Intelligence Terminal",
  description: "Real-time EPA 608 Compliance & Supply Chain Monitoring.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${mono.variable} font-sans bg-[#0B0F19]`}>
        {children}
        <Toaster position="top-center" theme="dark" richColors />
      </body>
    </html>
  );
}