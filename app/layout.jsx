import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

import { Toaster } from "@/components/ui/sonner";
import TawkChat from "@/components/Tawk/Tawk";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Authorized QFS Vault App",
  description: "QFS Vault App authorised by Flare Network",

  openGraph: {
    title: "Authorized QFS Vault App",
    description: "QFS Vault App authorised by Flare Network",
    type: "website",
    images: [
      {
        url: "/qfs-logo.jpeg",
        width: 1200,
        height: 630,
        alt: "Authorized QFS Vault App",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Authorized QFS Vault App",
    description: "QFS Vault App authorised by Flare Network",
    images: ["/qfs-logo.jpeg"],
  },

  icons: {
    icon: "/qfs-logo.jpeg",
    shortcut: "/qfs-logo.jpeg",
    apple: "/qfs-logo.jpeg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}

        <Toaster
          richColors
          position="top-center"
        />

        <TawkChat />
      </body>
    </html>
  );
}
