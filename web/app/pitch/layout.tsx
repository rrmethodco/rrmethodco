import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Restore — Investor pitch deck",
  description:
    "Restore. Insurance operations infrastructure for dental specialty practices. Seed round, $2.5M, milestone-tranched.",
};

export default function PitchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
