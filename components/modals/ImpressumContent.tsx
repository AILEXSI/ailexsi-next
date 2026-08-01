"use client";

export default function ImpressumContent() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 space-y-12 text-white/85 leading-relaxed">

      {/* ================= ENGLISH ================= */}
      <section className="space-y-4">
        <h1 className="text-3xl font-semibold text-white">
          Legal Notice (Imprint)
        </h1>

        <p>
          <strong>Service Provider:</strong><br />
          AI LeXsi<br />
          Neue Gasse 1<br />
          75217 Birkenfeld<br />
          Germany
        </p>

        <p>
          <strong>Contact:</strong><br />
          Email:{" "}
          <a
            href="mailto:ceo@ailexsi.com"
            className="text-cyan-400 hover:underline"
          >
            ceo@ailexsi.com
          </a>
        </p>

        <p>
          <strong>Responsible for content according to § 18 (2) MStV:</strong><br />
          AI LeXsi
        </p>

        <p>
          <strong>Online Dispute Resolution:</strong><br />
          The European Commission provides a platform for online dispute resolution (ODR):{" "}
          <a
            href="https://ec.europa.eu/consumers/odr/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:underline"
          >
            https://ec.europa.eu/consumers/odr/
          </a>
        </p>

        <p>
          <strong>Liability for Content:</strong><br />
          As a service provider, we are responsible for our own content on these pages
          in accordance with § 7 (1) TMG under general law.
        </p>

        <p>
          <strong>Liability for Links:</strong><br />
          We assume no liability for the content of external links.
        </p>

        <p>
          <strong>Copyright:</strong><br />
          German copyright law applies.
        </p>

        <p className="text-white/50 text-sm">
          Last updated: 2025-10-24
        </p>
      </section>

      {/* ================= DEUTSCH ================= */}
      <section className="space-y-4 pt-8 border-t border-white/10">
        <h1 className="text-3xl font-semibold text-white">
          Impressum
        </h1>

        <p>
          <strong>Dienstanbieter:</strong><br />
          AI LeXsi<br />
          Neue Gasse 1<br />
          75217 Birkenfeld<br />
          Deutschland
        </p>

        <p>
          <strong>Kontakt:</strong><br />
          E-Mail:{" "}
          <a
            href="mailto:ceo@ailexsi.com"
            className="text-cyan-400 hover:underline"
          >
            ceo@ailexsi.com
          </a>
        </p>

        <p>
          <strong>Inhaltlich verantwortlich gemäß § 18 Abs. 2 MStV:</strong><br />
          AI LeXsi
        </p>

        <p>
          <strong>Online-Streitbeilegung:</strong><br />
          Plattform der EU-Kommission zur Online-Streitbeilegung (OS):{" "}
          <a
            href="https://ec.europa.eu/consumers/odr/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:underline"
          >
            https://ec.europa.eu/consumers/odr/
          </a>
        </p>

        <p>
          <strong>Haftung für Inhalte:</strong><br />
          Gemäß § 7 Abs. 1 TMG sind wir für eigene Inhalte auf diesen Seiten
          nach den allgemeinen Gesetzen verantwortlich.
        </p>

        <p>
          <strong>Haftung für Links:</strong><br />
          Keine Verantwortung für externe Inhalte verlinkter Seiten.
        </p>

        <p>
          <strong>Urheberrecht:</strong><br />
          Es gilt deutsches Urheberrecht.
        </p>

        <p className="text-white/50 text-sm">
          Stand: 24.10.2025
        </p>
      </section>

    </div>
  );
}
