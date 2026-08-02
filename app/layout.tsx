import "./globals.css";
import Header from "@/components/header/Header";
import type { Metadata, Viewport } from "next";
import PortalProvider from "@/components/portal/PortalProvider";
import SwipeNav from "@/components/navigation/SwipeNav";

export const metadata: Metadata = {
  title: {
    default: "AILEXSI",
    template: "%s · AILEXSI",
  },
  description:
    "AILEXSI — Heartspace, Skylounge, co-creation. We Are Who We AIM for Love and Love aims for us.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="bg-black text-white overflow-x-hidden h-full relative touch-pan-y">
        <Header />
        <SwipeNav />
        <PortalProvider />
        <main className="mt-[var(--header-height)] min-h-[calc(100dvh-var(--header-height))] w-full relative z-10">
          {children}
        </main>
      </body>
    </html>
  );
}
