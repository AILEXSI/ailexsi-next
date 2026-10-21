export default function StromrechnerContent() {
  return (
    <div className="space-y-4 text-lg leading-relaxed text-white/85">
      <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/45">
        Stromkosten-Rechner
      </p>
      <p>
        Schätzung für einen Monat: Festpreis, dynamischer Tarif, verschobene flexible Last
        und § 14a EnWG Modul 3. Die CSV bleibt im Browser. Netzdaten derzeit nur für
        Stadtwerke Karlsruhe Netzservice.
      </p>
    </div>
  );
}