import "./globals.css";
import Header from "@/components/header/Header";
import type { Metadata } from "next";

// Unser Portal-Controller (Client)
import PortalProvider from "@/components/portal/PortalProvider";

export const metadata: Metadata = {
  title: "AILEXSI",
  description:
    "Skylounge – AILEXSI · We Are Who We AIM for Love and Love aims for us. Relax, nothing is under control.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" className="h-full">
      <body
        className="
          bg-black 
          text-white 
          overflow-x-hidden 
          h-full 
          relative
        "
      >
        {/* GLOBAL HEADER */}
        <Header />

        {/* GLOBAL MODAL-CONTROLLER (Client Component) */}
        <PortalProvider />

        {/* PAGE-CONTENT mit Background */}
        <main
          className="
            mt-[70px]
            min-h-screen
            w-full
            relative
            z-10
          "
        >
          {children}
        </main>
      </body>
    </html>
  );
}
