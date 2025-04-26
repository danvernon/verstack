import "./globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { PostHogProvider } from "@/components/providers/post-hog-provider";
import { Toaster } from "@/components/ui/sonner";
import { TRPCReactProvider } from "@/trpc/react";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export const metadata: Metadata = {
  title: "Marxel - Job Requisitions",
  description: "Marxel is a job requisition management tool",
  keywords: ["marxel", "job requisitions", "job management"],
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="en" className={`${geist.variable} dark`}>
        <body>
          <PostHogProvider>
            <TRPCReactProvider>{children}</TRPCReactProvider>
            <Toaster />
          </PostHogProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
