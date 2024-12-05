import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { QueryProvider } from "@/providers/query-provider";
import { SheetProvider } from "@/providers/sheet-provider";

import { Toaster } from "@/components/ui/sonner";
import { Suspense } from "react"; // Import Suspense

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
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
          <QueryProvider>
            <SheetProvider />
            <Toaster />

            {/* Wrap the entire app in Suspense for handling dynamic loading */}
            <Suspense
              fallback={
                <div className="flex justify-center items-center h-screen">
                  <p>Loading...</p>
                </div>
              }
            >
              {children}
            </Suspense>
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
