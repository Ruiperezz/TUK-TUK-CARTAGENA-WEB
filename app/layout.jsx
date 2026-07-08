import "../src/styles/globals.css";
import { headers } from "next/headers";

const SITE_URL = "https://tuktukcartagena.com";

export const viewport = {
  themeColor: "#0F1419",
  width: "device-width",
  initialScale: 1,
};

export const metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "TUK TUK Cartagena | Tours en Tuk Tuk por Cartagena, Murcia",
    template: "%s | TUK TUK Cartagena",
  },
  description:
    "Tours en tuk tuk por Cartagena, Murcia. Casco antiguo romano, bahía y rutas personalizadas. Ideal para cruceristas. 120 € por tuk tuk · Reserva online · Todos los días 08:00-19:00.",

  keywords: [
    "tuk tuk cartagena",
    "tours cartagena",
    "turismo cartagena",
    "actividades cartagena",
    "excursiones cartagena",
    "visitas guiadas cartagena",
    "tours cartagena murcia",
    "que hacer en cartagena",
    "que ver en cartagena",
    "tours crucero cartagena",
    "cruceros cartagena actividades",
    "turismo murcia",
    "rutas cartagena",
    "casco antiguo cartagena",
    "bahia cartagena",
    "tuk tuk tour cartagena spain",
    "cartagena city tour",
    "things to do cartagena spain",
    "cartagena sightseeing",
    "cruise shore excursion cartagena",
    "ausflüge cartagena",
    "tuk tuk cartagena spanien",
    "sehenswürdigkeiten cartagena",
    "tour tuk tuk cartagene espagne",
    "activites cartagene espagne",
  ],

  authors: [{ name: "TUK TUK Cartagena", url: SITE_URL }],
  creator: "TUK TUK Cartagena",
  publisher: "TUK TUK Cartagena",

  alternates: {
    canonical: SITE_URL,
    languages: {
      "es-ES": SITE_URL,
      "en-GB": `${SITE_URL}?lang=en`,
      "de-DE": `${SITE_URL}?lang=de`,
      "fr-FR": `${SITE_URL}?lang=fr`,
      "x-default": SITE_URL,
    },
  },

  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "TUK TUK Cartagena",
    title: "TUK TUK Cartagena — Tours en Tuk Tuk por Cartagena, Murcia",
    description:
      "Tours turísticos en tuk tuk. Casco antiguo, bahía y rutas personalizadas. 120 € · Reserva online · Todos los días.",
    locale: "es_ES",
    alternateLocale: ["en_GB", "de_DE", "fr_FR"],
    images: [
      {
        url: `${SITE_URL}/images/gallery-1.jpg`,
        width: 1200,
        height: 900,
        alt: "Tour en tuk tuk por Cartagena, Murcia — TUK TUK Cartagena",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "TUK TUK Cartagena — Tours en Tuk Tuk por Cartagena",
    description:
      "Tours turísticos en tuk tuk. Casco antiguo, bahía y rutas personalizadas. 120 € · Todos los días.",
    images: [`${SITE_URL}/images/gallery-1.jpg`],
  },

  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// ─── Rich JSON-LD structured data ────────────────────────────────────────────
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    // ── LocalBusiness ─────────────────────────────────────────────────────
    {
      "@type": ["LocalBusiness", "TouristInformationCenter"],
      "@id": `${SITE_URL}/#business`,
      name: "TUK TUK Cartagena",
      alternateName: ["Tuk Tuk Cartagena", "TukTuk Cartagena Tours"],
      description:
        "Tours turísticos en tuk tuk por Cartagena, Murcia. Descubre el casco antiguo romano, la bahía y el patrimonio militar en excursiones de 60-90 minutos. Ideal para cruceristas y turistas.",
      url: SITE_URL,
      email: "reservas@tuktukcartagena.com",
      image: `${SITE_URL}/images/gallery-1.jpg`,
      logo: `${SITE_URL}/logo/tuktuk-logo-cartagena.png`,
      address: {
        "@type": "PostalAddress",
        streetAddress: "Paseo Alfonso XII, 8",
        addressLocality: "Cartagena",
        addressRegion: "Murcia",
        postalCode: "30201",
        addressCountry: "ES",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 37.5979,
        longitude: -0.9968,
      },
      hasMap:
        "https://maps.google.com/?q=Terminal+Juan+Sebastián+El+Cano,+Paseo+Alfonso+XII,+Cartagena,+España",
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday", "Tuesday", "Wednesday", "Thursday",
            "Friday", "Saturday", "Sunday",
          ],
          opens: "08:00",
          closes: "19:00",
        },
      ],
      priceRange: "€€",
      currenciesAccepted: "EUR",
      paymentAccepted: "Cash, Credit Card",
      availableLanguage: [
        { "@type": "Language", name: "Spanish" },
        { "@type": "Language", name: "English" },
        { "@type": "Language", name: "German" },
        { "@type": "Language", name: "French" },
      ],
      areaServed: { "@type": "City", name: "Cartagena, Murcia" },
    },

    // ── Tour 1: Cartagena City ────────────────────────────────────────────
    {
      "@type": "TouristTrip",
      "@id": `${SITE_URL}/#tour-city`,
      name: "Cartagena City Tour en Tuk Tuk",
      alternateName: "Tour casco antiguo Cartagena",
      description:
        "Tour de 90 minutos en tuk tuk por el casco histórico de Cartagena: ruinas romanas, arquitectura modernista, Paseo Alfonso XII, Calle Real, Plaza de España, Muralla del Mar y Parque Torres. Ideal para cruceristas.",
      provider: { "@id": `${SITE_URL}/#business` },
      touristType: ["Cruise passengers", "Cultural tourists", "History enthusiasts"],
      availableLanguage: [
        { "@type": "Language", name: "Spanish" },
        { "@type": "Language", name: "English" },
        { "@type": "Language", name: "German" },
        { "@type": "Language", name: "French" },
      ],
      duration: "PT90M",
      maximumAttendeeCapacity: 12,
      offers: {
        "@type": "Offer",
        name: "Tuk tuk privado 1-4 personas",
        price: "120",
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
        url: SITE_URL,
      },
      image: `${SITE_URL}/images/gallery-1.jpg`,
      url: SITE_URL,
    },

    // ── Tour 2: Cartagena Bay ─────────────────────────────────────────────
    {
      "@type": "TouristTrip",
      "@id": `${SITE_URL}/#tour-bay`,
      name: "Cartagena Bay Tour en Tuk Tuk",
      alternateName: "Tour bahía Cartagena",
      description:
        "Tour de 90 minutos en tuk tuk por la bahía de Cartagena: Puente Quitapellejos, Algameca Chica, Faro de Navidad, Faro Verde y Cala Cortina. Patrimonio militar y vistas únicas al puerto.",
      provider: { "@id": `${SITE_URL}/#business` },
      touristType: ["Cruise passengers", "Nature tourists", "History enthusiasts"],
      availableLanguage: [
        { "@type": "Language", name: "Spanish" },
        { "@type": "Language", name: "English" },
        { "@type": "Language", name: "German" },
        { "@type": "Language", name: "French" },
      ],
      duration: "PT90M",
      maximumAttendeeCapacity: 12,
      offers: {
        "@type": "Offer",
        name: "Tuk tuk privado 1-4 personas",
        price: "120",
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
        url: SITE_URL,
      },
      image: `${SITE_URL}/images/gallery-3.jpg`,
      url: SITE_URL,
    },

    // ── Tour 3: My Way ────────────────────────────────────────────────────
    {
      "@type": "TouristTrip",
      "@id": `${SITE_URL}/#tour-myway`,
      name: "Cartagena My Way — Tour Personalizado en Tuk Tuk",
      alternateName: "Tour personalizado Cartagena",
      description:
        "Tour de 60 minutos en tuk tuk completamente personalizado. Tú decides la ruta y los lugares a visitar en Cartagena. Perfecto para repetidores o quien tiene un lugar concreto en mente.",
      provider: { "@id": `${SITE_URL}/#business` },
      touristType: ["Tourists", "Independent travelers"],
      availableLanguage: [
        { "@type": "Language", name: "Spanish" },
        { "@type": "Language", name: "English" },
        { "@type": "Language", name: "German" },
        { "@type": "Language", name: "French" },
      ],
      duration: "PT60M",
      maximumAttendeeCapacity: 12,
      offers: {
        "@type": "Offer",
        name: "Tuk tuk privado 1-4 personas",
        price: "120",
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
        url: SITE_URL,
      },
      url: SITE_URL,
    },

    // ── FAQPage ───────────────────────────────────────────────────────────
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name: "¿Cuánto cuesta un tour en tuk tuk por Cartagena?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "El precio es 120 € por tuk tuk completo (1-4 personas). Para grupos de 5-8 personas: 2 tuk tuks (240 €). Para 9-12 personas: 3 tuk tuks (360 €). El precio es el mismo para el City Tour (90 min), el Bay Tour (90 min) y el My Way Tour (60 min).",
          },
        },
        {
          "@type": "Question",
          name: "¿Dónde es el punto de encuentro de los tours en tuk tuk en Cartagena?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "El punto de encuentro es la Terminal Juan Sebastián El Cano, Paseo Alfonso XII 8, Cartagena (Muelle de Cruceros, 30201). Los pasajeros de crucero llegan caminando en pocos minutos desde el barco.",
          },
        },
        {
          "@type": "Question",
          name: "¿En qué idiomas se hacen los tours en tuk tuk por Cartagena?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Los tours se realizan en español, inglés, alemán y francés. La web detecta automáticamente tu idioma y la reserva puede hacerse en los cuatro idiomas.",
          },
        },
        {
          "@type": "Question",
          name: "¿Puedo reservar un tour en tuk tuk siendo pasajero de un crucero en Cartagena?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Sí, los tours están especialmente diseñados para cruceristas. El punto de salida es el muelle de cruceros. Los tours duran 60 o 90 minutos y permiten conocer Cartagena y volver a tiempo al barco.",
          },
        },
        {
          "@type": "Question",
          name: "¿Cuántas personas caben en un tuk tuk en Cartagena?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Cada tuk tuk tiene capacidad para 4 personas. Para grupos más grandes se reservan varios tuk tuks: 2 para grupos de 5-8 personas y 3 para grupos de 9-12 personas. No se permiten niños menores de 2 años o con peso inferior a 9 kg.",
          },
        },
        {
          "@type": "Question",
          name: "¿Cuál es el horario de TUK TUK Cartagena?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Abierto todos los días de lunes a domingo, de 08:00 a 19:00 horas.",
          },
        },
        {
          "@type": "Question",
          name: "¿Cómo se reserva un tour en tuk tuk en Cartagena?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "La reserva se realiza online en tuktukcartagena.com: elige el tour, la fecha, la hora y el número de personas. El pago es con tarjeta. Recibirás una confirmación por email con todos los detalles.",
          },
        },
        {
          "@type": "Question",
          name: "¿Cuál es la diferencia entre el Cartagena City Tour y el Cartagena Bay Tour?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "El City Tour (90 min) recorre el casco antiguo: ruinas romanas, modernismo, Paseo Alfonso XII, Muralla del Mar. El Bay Tour (90 min) recorre la bahía: faros históricos, Algameca Chica y Cala Cortina. Ambos a 120 € con tuk tuk privado.",
          },
        },
      ],
    },

    // ── BreadcrumbList ────────────────────────────────────────────────────
    {
      "@type": "BreadcrumbList",
      "@id": `${SITE_URL}/#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Tours en Tuk Tuk Cartagena", item: `${SITE_URL}/#tours` },
        { "@type": "ListItem", position: 3, name: "Precios", item: `${SITE_URL}/#prices` },
        { "@type": "ListItem", position: 4, name: "Reservar", item: `${SITE_URL}/#booking` },
      ],
    },
  ],
};

export default function RootLayout({ children }) {
  const nonce = headers().get("x-nonce") ?? undefined;

  return (
    <html lang="es">
      <head>
        {/* Fuentes */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />

        {/* Preload del poster del vídeo hero — mejora LCP */}
        <link rel="preload" as="image" href="/images/hero-poster.jpg" fetchPriority="high" />

        {/* Geo meta tags — refuerza la señal local para Google Maps y búsquedas locales */}
        <meta name="geo.region" content="ES-MC" />
        <meta name="geo.placename" content="Cartagena, Murcia, España" />
        <meta name="geo.position" content="37.5979;-0.9968" />
        <meta name="ICBM" content="37.5979, -0.9968" />

        {/* Datos estructurados JSON-LD */}
        <script
          type="application/ld+json"
          nonce={nonce}
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
