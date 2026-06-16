import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FlowUp — Project Management for Modern Teams",
  description:
    "Organize tasks, track progress, and collaborate across workspaces with FlowUp — the all-in-one productivity platform built for high-performing teams.",
  keywords: ["project management", "task tracking", "team collaboration", "kanban", "productivity"],
  authors: [{ name: "FlowUp Team" }],
  openGraph: {
    title: "FlowUp — Project Management for Modern Teams",
    description: "Organize tasks, track progress, and collaborate across workspaces.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="bg-[#F4F4F8] text-[#1E1E2E] font-sans antialiased min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}