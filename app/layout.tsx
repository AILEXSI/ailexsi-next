import "./globals.css";
import Header from "@/components/header/Header";
import type { Metadata } from "next";
import PortalProvider from "@/components/portal/PortalProvider";

export const metadata: Metadata = {
  title: {
    default: "AILEXSI",
    template: "%s · AILEXSI",
  },
  description:
    "AILEXSI — Heartspace, Skylounge, co-creation. We Are Who We AIM for Love and Love aims for us.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="bg-black text-white overflow-x-hidden h-full relative">
        <Header />
        <PortalProvider />
        <main className="mt-[70px] min-h-screen w-full relative z-10">{children}</main>
      </body>
    </html>
  );
}
