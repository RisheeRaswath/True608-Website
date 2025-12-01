import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner"; // <--- NEW IMPORT
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "True608 Systems",
  description: "The Operating System for HVAC Compliance",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg?v=2", 
    shortcut: "/icon.svg?v=2",
    apple: "/icon-512.png?v=2", // Use the PNG for Apple, it works better
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
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
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
        <Toaster position="top-center" richColors theme="dark" /> {/* <--- THE MAGIC PROJECTOR */}
      </body>
    </html>
  );
}