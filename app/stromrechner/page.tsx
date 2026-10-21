import type { Metadata } from "next";
import StromrechnerApp from "@/components/stromrechner/StromrechnerApp";
import { DEFAULT_OPERATOR_ID } from "@/lib/stromrechner/operators";

export const metadata: Metadata = {
  title: "Stromkosten-Rechner",
  description:
    "Stromkosten-Schätzung für Haushalte: Festpreis, dynamischer Tarif, Lastverschiebung und § 14a EnWG Modul 3. CSV bleibt im Browser.",
};

export default function StromrechnerPage() {
  return <StromrechnerApp operatorId={DEFAULT_OPERATOR_ID} />;
}
