import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "Kriya 26 | PSG COLLEGE",
  description: "Event conducted By The Student Union at PSG College of Technology",
  icons: {
    icon: "/Logo/kriya.png",
    shortcut: "/Logo/kriya.png",
    apple: "/Logo/kriya.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          src="https://kriya26-umami.vercel.app/script.js"
          data-website-id="ed8cc4ab-cee3-4234-8b38-c3573e389e14"
          strategy="afterInteractive"
        />
      </head>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

