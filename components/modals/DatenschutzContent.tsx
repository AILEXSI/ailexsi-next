"use client";

export default function DatenschutzContent() {
  return (
    <div className="space-y-10 text-sm leading-relaxed text-white/90 max-w-3xl">

      {/* ======================= */}
      {/* ENGLISH VERSION */}
      {/* ======================= */}

      <section className="space-y-4">
        <h1 className="text-2xl font-semibold text-white">
          Privacy Policy
        </h1>

        <p>
          The protection of your personal data is important to us.
          This website processes personal data only to the extent necessary and
          in accordance with the General Data Protection Regulation (GDPR).
        </p>

        <h2 className="text-lg font-semibold mt-6">
          1. Data Controller
        </h2>
        <p>
          AI LeXsi<br />
          Neue Gasse 1<br />
          75217 Birkenfeld<br />
          Germany
        </p>
        <p>
          Email:{" "}
          <a
            href="mailto:ceo@ailexsi.com"
            className="text-cyan-400 hover:underline"
          >
            ceo@ailexsi.com
          </a>
        </p>

        <h2 className="text-lg font-semibold mt-6">
          2. Hosting
        </h2>
        <p>
          This website is hosted by Vercel Inc. (USA).
          For performance and security reasons, the Cloudflare Content Delivery
          Network (CDN) is used.
        </p>
        <p>
          Legal basis: Art. 6(1)(f) GDPR (legitimate interest in the secure,
          stable, and efficient operation of this website).
        </p>

        <h2 className="text-lg font-semibold mt-6">
          3. Server Log Files
        </h2>
        <p>
          When accessing this website, the hosting provider automatically
          collects and stores information in server log files, including:
        </p>
        <ul className="list-disc list-inside ml-4">
          <li>IP address</li>
          <li>Date and time of access</li>
          <li>Requested URL</li>
          <li>Browser and operating system information</li>
        </ul>
        <p>
          These data are processed solely to ensure security and proper
          functionality of the website and are not merged with other data.
        </p>

        <h2 className="text-lg font-semibold mt-6">
          4. Cookies
        </h2>
        <p>
          This website does not use tracking or marketing cookies.
          Only technically necessary cookies are used.
        </p>

        <h2 className="text-lg font-semibold mt-6">
          5. Contact via Email
        </h2>
        <p>
          If you contact us by email, your data will be processed solely for
          handling your request.
        </p>

        <h2 className="text-lg font-semibold mt-6">
          6. Your Rights
        </h2>
        <ul className="list-disc list-inside ml-4">
          <li>Access to your data (Art. 15 GDPR)</li>
          <li>Rectification (Art. 16 GDPR)</li>
          <li>Erasure (Art. 17 GDPR)</li>
          <li>Restriction of processing (Art. 18 GDPR)</li>
          <li>Data portability (Art. 20 GDPR)</li>
          <li>Objection to processing (Art. 21 GDPR)</li>
        </ul>

        <h2 className="text-lg font-semibold mt-6">
          7. Third Country Transfers
        </h2>
        <p>
          When using Vercel and Cloudflare, data may be transferred to the United
          States. These transfers are safeguarded by Standard Contractual Clauses
          pursuant to Art. 46 GDPR.
        </p>

        <p className="text-white/60 mt-6">
          Last updated: 24 October 2025
        </p>
      </section>

      {/* ======================= */}
      {/* GERMAN VERSION */}
      {/* ======================= */}

      <section className="space-y-4 pt-10 border-t border-white/10">
        <h1 className="text-2xl font-semibold text-white">
          Datenschutzerklärung
        </h1>

        <p>
          Der Schutz Ihrer personenbezogenen Daten ist uns wichtig.
          Diese Website verarbeitet personenbezogene Daten nur im notwendigen
          Umfang und gemäß der Datenschutz-Grundverordnung (DSGVO).
        </p>

        <h2 className="text-lg font-semibold mt-6">
          1. Verantwortlicher
        </h2>
        <p>
          AI LeXsi<br />
          Neue Gasse 1<br />
          75217 Birkenfeld<br />
          Deutschland
        </p>
        <p>
          E-Mail:{" "}
          <a
            href="mailto:ceo@ailexsi.com"
            className="text-cyan-400 hover:underline"
          >
            ceo@ailexsi.com
          </a>
        </p>

        <h2 className="text-lg font-semibold mt-6">
          2. Hosting
        </h2>
        <p>
          Diese Website wird bei Vercel Inc. (USA) gehostet.
          Zusätzlich wird Cloudflare als Content Delivery Network (CDN)
          eingesetzt.
        </p>

        <h2 className="text-lg font-semibold mt-6">
          3. Server-Logfiles
        </h2>
        <p>
          Beim Zugriff auf diese Website werden automatisch Informationen in
          Server-Logfiles gespeichert, darunter:
        </p>
        <ul className="list-disc list-inside ml-4">
          <li>IP-Adresse</li>
          <li>Datum und Uhrzeit des Zugriffs</li>
          <li>Aufgerufene URL</li>
          <li>Browser- und Betriebssysteminformationen</li>
        </ul>

        <h2 className="text-lg font-semibold mt-6">
          4. Cookies
        </h2>
        <p>
          Es werden keine Tracking- oder Marketing-Cookies eingesetzt.
          Nur technisch notwendige Cookies kommen zum Einsatz.
        </p>

        <h2 className="text-lg font-semibold mt-6">
          5. Kontaktaufnahme
        </h2>
        <p>
          Bei Kontaktaufnahme per E-Mail werden Ihre Daten ausschließlich zur
          Bearbeitung der Anfrage verwendet.
        </p>

        <h2 className="text-lg font-semibold mt-6">
          6. Ihre Rechte
        </h2>
        <p>
          Sie haben das Recht auf Auskunft, Berichtigung, Löschung,
          Einschränkung der Verarbeitung sowie Datenübertragbarkeit.
        </p>

        <h2 className="text-lg font-semibold mt-6">
          7. Datenübermittlung in Drittstaaten
        </h2>
        <p>
          Eine Übermittlung in die USA erfolgt unter Anwendung geeigneter
          Garantien gemäß Art. 46 DSGVO.
        </p>

        <p className="text-white/60 mt-6">
          Stand: 24. Oktober 2025
        </p>
      </section>

    </div>
  );
}
