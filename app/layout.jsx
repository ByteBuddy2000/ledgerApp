import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Tawk from "@/components/Tawk/Tawk";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Authorized QFS Vault App",
  description: "QFS Vault App authorised by Flare Network",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} cz-shortcut-listen="true">
        {children}
        <Toaster richColors position="top-center" /> {/* ✅ Sonner Toaster here */}
        <Tawk />
      </body>
    </html>
  );
}
