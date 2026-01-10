import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Provider from "./Provider";
import { Toaster } from "@/components/ui/sonner";
import DashNavbar from "@/components/DashNavbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MediTalk AI",
  description: "AI Medical Voice Agent",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Provider>
            <DashNavbar />
            {children}
            <Toaster
              position="top-right"
              visibleToasts={4}
              expand
              richColors
            />
          </Provider>
        </body>
      </html>
    </ClerkProvider>
  );
}
