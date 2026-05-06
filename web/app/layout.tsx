import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Restore — AI that wins dental claims back",
  description:
    "Restore is an AI agent for dental specialty practices. Pre-authorizations, claim appeals, and referral letters drafted from your PMS — approved in one click.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">{children}</body>
    </html>
  );
}
