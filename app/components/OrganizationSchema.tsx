// Only real, already-established facts (Footer.tsx's own contact info) —
// no invented social profiles, no sameAs array, since none exist yet.
export default function OrganizationSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Nettyo Solutions",
    url: "https://nettyo.com",
    logo: "https://nettyo.com/icon.png",
    email: "contacto@nettyo.com",
    telephone: "+526571014531",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Ciudad Juárez",
      addressRegion: "Chihuahua",
      addressCountry: "MX",
    },
    areaServed: "Worldwide",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
