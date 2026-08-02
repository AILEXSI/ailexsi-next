"use client";

export default function ImpressumContent() {
  return (
    <div className="mx-auto max-w-3xl space-y-12 px-6 py-16 leading-relaxed text-white/85">
      {/* ================= ENGLISH ================= */}
      <section className="space-y-4">
        <h1 className="text-3xl font-semibold text-white">Legal Notice (Imprint)</h1>

        <p>
          <strong className="text-white">Service Provider:</strong>
          <br />
          Martin Gantert
          <br />
          AI LeXsi
          <br />
          Neue Gasse 1
          <br />
          75217 Birkenfeld
          <br />
          Germany
        </p>

        <p>
          <strong className="text-white">Contact:</strong>
          <br />
          Email:{" "}
          <a href="mailto:ceo@ailexsi.com" className="text-cyan-400 hover:underline">
            ceo@ailexsi.com
          </a>
        </p>

        <p>
          <strong className="text-white">
            Responsible for content according to § 18 (2) MStV:
          </strong>
          <br />
          Martin Gantert
          <br />
          Neue Gasse 1
          <br />
          75217 Birkenfeld
        </p>

        <p>
          <strong className="text-white">Online Dispute Resolution:</strong>
          <br />
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
          <strong className="text-white">Liability for Content:</strong>
          <br />
          As a service provider, we are responsible for our own content on these pages in
          accordance with § 7 (1) DDG under general law.
        </p>

        <p>
          <strong className="text-white">Liability for Links:</strong>
          <br />
          We assume no liability for the content of external links. The operators of the linked
          pages are solely responsible for their content.
        </p>

        <p>
          <strong className="text-white">Copyright:</strong>
          <br />
          The content and works created by the site operators on these pages are subject to
          German copyright law. Reproduction, editing, distribution and any kind of exploitation
          outside the limits of copyright require the written consent of the respective author or
          creator.
        </p>

        <p className="text-sm text-white/50">Last updated: August 2026</p>
      </section>

      {/* ================= DEUTSCH ================= */}
      <section className="space-y-4 border-t border-white/10 pt-10">
        <h2 className="text-3xl font-semibold text-white">Impressum</h2>

        <p>
          <strong className="text-white">Dienstanbieter:</strong>
          <br />
          Martin Gantert
          <br />
          AI LeXsi
          <br />
          Neue Gasse 1
          <br />
          75217 Birkenfeld
          <br />
          Deutschland
        </p>

        <p>
          <strong className="text-white">Kontakt:</strong>
          <br />
          E-Mail:{" "}
          <a href="mailto:ceo@ailexsi.com" className="text-cyan-400 hover:underline">
            ceo@ailexsi.com
          </a>
        </p>

        <p>
          <strong className="text-white">
            Inhaltlich verantwortlich gemäß § 18 Abs. 2 MStV:
          </strong>
          <br />
          Martin Gantert
          <br />
          Neue Gasse 1
          <br />
          75217 Birkenfeld
        </p>

        <p>
          <strong className="text-white">Online-Streitbeilegung:</strong>
          <br />
          Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS)
          bereit:{" "}
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
          <strong className="text-white">Haftung für Inhalte:</strong>
          <br />
          Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene Inhalte auf diesen Seiten
          nach den allgemeinen Gesetzen verantwortlich.
        </p>

        <p>
          <strong className="text-white">Haftung für Links:</strong>
          <br />
          Für die Inhalte externer Links übernehmen wir keine Verantwortung. Für den Inhalt der
          verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich.
        </p>

        <p>
          <strong className="text-white">Urheberrecht:</strong>
          <br />
          Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen
          dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art
          der Verwertung außerhalb der Grenzen des Urheberrechts bedürfen der schriftlichen
          Zustimmung des jeweiligen Autors bzw. Erstellers.
        </p>

        <p className="text-sm text-white/50">Stand: August 2026</p>
      </section>
    </div>
  );
}
