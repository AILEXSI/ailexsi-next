import type { Metadata } from "next";
import { notFound } from "next/navigation";
import StromrechnerApp from "@/components/stromrechner/StromrechnerApp";
import { getOperator, listOperators } from "@/lib/stromrechner/operators";

export function generateStaticParams() {
  return listOperators().map((operator) => ({ slug: operator.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const operator = getOperator(slug);
  if (!operator) return { title: "Stromkosten-Rechner" };
  return {
    title: `Stromkosten-Rechner ${operator.shortName}`,
    description: `Stromkosten-Schätzung mit Netzentgelten von ${operator.name}. CSV bleibt im Browser.`,
  };
}

export default async function StromrechnerOperatorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const operator = getOperator(slug);
  if (!operator) notFound();
  return <StromrechnerApp operatorId={operator.id} />;
}
