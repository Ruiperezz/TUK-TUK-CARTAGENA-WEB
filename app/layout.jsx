import "../src/styles/globals.css";

const SITE_URL = "https://tuktukcartagena.com";

export const viewport = {
  themeColor: "#0F1419",
};

export const metadata = {
  title: "TUK TUK Cartagena — Tours únicos en tuk tuk por Cartagena",
  description:
    "Descubre Cartagena en tuk tuk. Tres tours por el casco antiguo, la bahía y a tu medida. Reserva online en español, English, Deutsch o français.",
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: SITE_URL,
    languages: {
      es: SITE_URL,
      en: `${SITE_URL}?lang=en`,
      de: `${SITE_URL}?lang=de`,
      fr: `${SITE_URL}?lang=fr`,
      "x-default": SITE_URL,
    },
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "TUK TUK Cartagena",
    title: "TUK TUK Cartagena — Tours únicos en tuk tuk",
    description:
      "Descubre Cartagena desde el mejor asiento de la ciudad. Reserva online.",
    locale: "es_ES",
    alternateLocale: ["en_GB", "de_DE", "fr_FR"],
  },
  twitter: {
    card: "summary_large_image",
    title: "TUK TUK Cartagena — Tours únicos en tuk tuk",
    description:
      "Descubre Cartagena desde el mejor asiento de la ciudad. Reserva online.",
  },
  icons: {
    icon: "/favicon.svg",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      "@id": `${SITE_URL}/#business`,
      name: "TUK TUK Cartagena",
      description:
        "Tours turísticos en tuk tuk por Cartagena, Murcia. Descubre el casco antiguo, la bahía y mucho más.",
      url: SITE_URL,
      telephone: "",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Cartagena",
        addressRegion: "Murcia",
        addressCountry: "ES",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 37.6,
        longitude: -0.9816,
      },
      priceRange: "€€",
      currenciesAccepted: "EUR",
      paymentAccepted: "Cash, Credit Card, PayPal, Bizum",
      availableLanguage: ["Spanish", "English", "German", "French"],
    },
    {
      "@type": "TouristAttraction",
      "@id": `${SITE_URL}/#tour-city`,
      name: "Cartagena City Tour",
      description:
        "90-minute tuk tuk tour through the old town: Roman ruins, Modernist architecture, Paseo Alfonso XII, Plaza de España, Muralla del Mar.",
      touristType: "Cruise ship passengers, Tourists",
      isAccessibleForFree: false,
      url: SITE_URL,
    },
    {
      "@type": "TouristAttraction",
      "@id": `${SITE_URL}/#tour-bay`,
      name: "Cartagena Bay Tour",
      description:
        "90-minute tuk tuk tour across the bay: Faro de Navidad, Algameca Chica, Cala Cortina, strategic military heritage.",
      touristType: "Cruise ship passengers, Tourists",
      isAccessibleForFree: false,
      url: SITE_URL,
    },
    {
      "@type": "TouristAttraction",
      "@id": `${SITE_URL}/#tour-myway`,
      name: "Cartagena My Way Tour",
      description:
        "60-minute custom tuk tuk tour. You decide the route and sights to visit in Cartagena.",
      touristType: "Tourists",
      isAccessibleForFree: false,
      url: SITE_URL,
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
