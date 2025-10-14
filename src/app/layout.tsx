import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "@/components/layout/ConditionalLayout";
import { SidebarProvider } from "@/contexts/SidebarContext";
import { FocusProvider } from "@/contexts/FocusContext";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Beeylo Dashboard",
  description: "Customer service dashboard for Beeylo",
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
        <AuthProvider>
          <SidebarProvider>
            <FocusProvider>
              <ConditionalLayout>{children}</ConditionalLayout>
            </FocusProvider>
          </SidebarProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
