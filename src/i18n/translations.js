/**
 * Traducciones — TUK TUK Cartagena
 *
 * Estructura: cada idioma replica EXACTAMENTE las mismas claves.
 * Si añades una clave en `es`, replica en `en`, `de` y `fr`.
 * Idiomas soportados: ES (default), EN, DE, FR.
 *
 * Cuando se renderiza, el componente detecta `navigator.language`
 * y si está en la lista, lo usa por defecto. Si no, fallback a ES.
 */

export const LANGS = [
  { code: "es", label: "ES" },
  { code: "en", label: "EN" },
  { code: "de", label: "DE" },
  { code: "fr", label: "FR" }
];

export const I18N = {
  es: {
    nav: { home: "Inicio", tours: "Nuestros Tours", prices: "Precios", about: "Quiénes Somos", book: "Reservar", contact: "Contacto" },
    hero: {
      eyebrow: "Cartagena · desde 2025",
      title: "Descubre Cartagena",
      subtitle: "Tours únicos en tuk tuk por el corazón de la ciudad",
      cta: "Reserva tu tour",
      scroll: "Desliza"
    },
    tours: {
      eyebrow: "Tres formas de conocer la ciudad",
      title: "Nuestros tours",
      book: "Reservar este tour",
      duration: "min",
      mapCaption: "Recorrido orientativo, sujeto a confirmación",
      routeDisclaimer: "Las rutas podrán verse modificadas debido a cortes de tráfico, celebraciones u otros eventos que tengan lugar en la ciudad.",
      list: [
        {
          id: "city",
          name: "Cartagena City",
          duration: "90",
          tagline: "El alma de la ciudad",
          desc: "Desde las ruinas romanas hasta la arquitectura modernista y el legado militar. Una ruta por las calles más icónicas: Paseo Alfonso XII, Calle Real, Plaza de España, Muralla del Mar y Parque Torres.",
          highlights: ["Casco antiguo", "Historia romana", "Arquitectura modernista"]
        },
        {
          id: "bay",
          name: "Cartagena Bay",
          duration: "90",
          tagline: "La bahía legendaria",
          desc: "Un recorrido de punta a punta de la bahía. Entiende su importancia geográfica y estratégica. Incluye Puente Quitapellejos, Algameca Chica, Faro de Navidad, Faro Verde y Cala Cortina.",
          highlights: ["Faros históricos", "Vistas al puerto", "Cala Cortina"]
        },
        {
          id: "myway",
          name: "Cartagena My Way",
          duration: "60",
          tagline: "Tú decides",
          desc: "60 minutos para explorar Cartagena exactamente como quieres. Si ya conoces la ciudad o tienes un lugar concreto en mente, este es tu tour personalizado.",
          highlights: ["Ruta libre", "Personalizado", "60 minutos"]
        }
      ]
    },
    gallery: {
      eyebrow: "La experiencia en imágenes",
      title: "Así es viajar en tuk tuk"
    },
    prices: {
      eyebrow: "Tarifas claras, sin sorpresas",
      title: "Precios",
      perTuktukTitle: "Precio por tuk tuk",
      perTuktuk: "1 a 4 personas · tuk tuk privado",
      perTuktukPrice: "120 €",
      perTuktukNote: "El precio es por tuk tuk completo, no por persona. Máximo 4 personas.",
      private6: "Tuk tuk · 6 plazas (próximamente)",
      private6Price: "180 €",
      payment: "Efectivo y tarjeta en el momento · pago online al reservar",
      childNote: "No se permiten niños menores de 2 años o con menos de 9 kg de peso",
      comingSoon: "PRÓXIMAMENTE"
    },
    booking: {
      eyebrow: "Reserva en menos de 60 segundos",
      title: "Reserva tu tour",
      subtitle: "Disponible todos los días de lunes a domingo, de 08:00 a 19:00",
      tour: "Tour",
      tourPlaceholder: "Selecciona un tour",
      date: "Fecha",
      time: "Hora de salida",
      timePlaceholder: "Selecciona una hora",
      timeSlotFull: "Completo",
      people: "Personas",
      peopleMax: "Máximo 12 personas (hasta 3 tuk tuks)",
      tuktukLabel: "tuk tuk privado",
      tuktuksLabel: "tuk tuks privados",
      name: "Tu nombre",
      email: "Tu email",
      total: "Total a pagar",
      submit: "Confirmar reserva y pagar",
      paymentMethods: "Pago seguro con tarjeta",
      dateUnavailable: "Esta fecha no está disponible",
      noSlots: "No hay horarios disponibles para esta fecha",
      success: "¡Reserva confirmada!",
      successDesc: "Te hemos enviado un email con todos los detalles. Nos vemos en Cartagena.",
      reset: "Nueva reserva"
    },
    about: {
      eyebrow: "Quiénes somos",
      title: "Cartagena, contada por quien la vive",
      body: "TUK TUK CARTAGENA nace de la pasión por una ciudad con más de tres mil años de historia. Recorremos sus calles cada día y queremos que tú las descubras desde el mejor asiento posible: cómodo, abierto, y con alguien local que conoce cada esquina. Una experiencia única para entender por qué Cartagena enamora a quien la visita."
    },
    practical: {
      eyebrow: "Información práctica",
      title: "Todo lo que necesitas saber",
      openMaps: "Abrir en Google Maps",
      items: [
        { label: "Punto de encuentro", value: "Paseo Alfonso XII 8, entrada Terminal Juan Sebastián El Cano (Muelle de Cruceros), 30201, Cartagena, Murcia", mapUrl: "https://maps.google.com/?q=Terminal+Juan+Sebastián+El+Cano,+Paseo+Alfonso+XII,+Cartagena,+España" },
        { label: "Horario", value: "Lunes a domingo · de 08:00 a 19:00" },
        { label: "Qué llevar", value: "Ropa cómoda, protección solar y cámara" }
      ]
    },
    contact: {
      eyebrow: "¿Hablamos?",
      title: "Contacto",
      subtitle: "Para grupos grandes, eventos privados o cualquier consulta",
      name: "Nombre",
      email: "Email",
      message: "Mensaje",
      submit: "Enviar mensaje",
      sent: "Mensaje enviado. Te respondemos en menos de 24h."
    },
    footer: {
      tag: "Cartagena, Murcia · España",
      legal: "Aviso legal",
      privacy: "Política de privacidad",
      cookies: "Cookies",
      rights: "Todos los derechos reservados"
    },
    menu: { lang: "Idioma", close: "Cerrar" }
  },

  en: {
    nav: { home: "Home", tours: "Our Tours", prices: "Prices", about: "About Us", book: "Book", contact: "Contact" },
    hero: {
      eyebrow: "Cartagena · since 2025",
      title: "Discover Cartagena",
      subtitle: "Unique tuk tuk tours through the heart of the city",
      cta: "Book your tour",
      scroll: "Scroll"
    },
    tours: {
      eyebrow: "Three ways to know the city",
      title: "Our tours",
      book: "Book this tour",
      duration: "min",
      mapCaption: "Indicative route, subject to confirmation",
      routeDisclaimer: "Routes may be modified due to road closures, celebrations or other events taking place in the city.",
      list: [
        {
          id: "city",
          name: "Cartagena City",
          duration: "90",
          tagline: "The soul of the city",
          desc: "From Roman ruins to Modernist architecture and military heritage. A route through the most iconic streets: Paseo Alfonso XII, Calle Real, Plaza de España, Muralla del Mar and Parque Torres.",
          highlights: ["Old town", "Roman history", "Modernist architecture"]
        },
        {
          id: "bay",
          name: "Cartagena Bay",
          duration: "90",
          tagline: "The legendary harbour",
          desc: "A journey from one end of the bay to the other. Understand its geographic and strategic importance. Includes Puente Quitapellejos, Algameca Chica, Faro de Navidad, Faro Verde and Cala Cortina.",
          highlights: ["Historic lighthouses", "Harbour views", "Cala Cortina"]
        },
        {
          id: "myway",
          name: "Cartagena My Way",
          duration: "60",
          tagline: "You decide",
          desc: "60 minutes to explore Cartagena exactly the way you want. Already know the city or have a place in mind? This is your custom tour.",
          highlights: ["Free route", "Personalised", "60 minutes"]
        }
      ]
    },
    gallery: {
      eyebrow: "The experience in pictures",
      title: "This is what it's like to ride a tuk tuk"
    },
    prices: {
      eyebrow: "Clear pricing, no surprises",
      title: "Prices",
      perTuktukTitle: "Price per tuk tuk",
      perTuktuk: "1 to 4 people · private tuk tuk",
      perTuktukPrice: "€120",
      perTuktukNote: "The price is per complete tuk tuk, not per person. Maximum 4 people.",
      private6: "Tuk tuk · 6 seats (coming soon)",
      private6Price: "€180",
      payment: "Cash and card on the day · online payment when booking",
      childNote: "Children under 2 years or weighing less than 9 kg are not permitted",
      comingSoon: "COMING SOON"
    },
    booking: {
      eyebrow: "Book in under 60 seconds",
      title: "Book your tour",
      subtitle: "Available every day, Monday to Sunday, 08:00 to 19:00",
      tour: "Tour",
      tourPlaceholder: "Choose a tour",
      date: "Date",
      time: "Departure time",
      timePlaceholder: "Choose a time",
      timeSlotFull: "Full",
      people: "People",
      peopleMax: "Maximum 12 people (up to 3 tuk tuks)",
      tuktukLabel: "private tuk tuk",
      tuktuksLabel: "private tuk tuks",
      name: "Your name",
      email: "Your email",
      total: "Total to pay",
      submit: "Confirm and pay",
      paymentMethods: "Secure card payment",
      dateUnavailable: "This date is not available",
      noSlots: "No time slots available for this date",
      success: "Booking confirmed!",
      successDesc: "We've sent you an email with all the details. See you in Cartagena.",
      reset: "New booking"
    },
    about: {
      eyebrow: "About us",
      title: "Cartagena, told by someone who lives it",
      body: "TUK TUK CARTAGENA was born from a passion for a city with over three thousand years of history. We travel its streets every day, and we want you to discover them from the best seat possible: comfortable, open, with a local who knows every corner. A unique experience to understand why Cartagena captivates everyone who visits."
    },
    practical: {
      eyebrow: "Practical info",
      title: "Everything you need to know",
      openMaps: "Open in Google Maps",
      items: [
        { label: "Meeting point", value: "Paseo Alfonso XII 8, Terminal Juan Sebastián El Cano entrance (Cruise Terminal), 30201, Cartagena, Murcia, Spain", mapUrl: "https://maps.google.com/?q=Terminal+Juan+Sebastián+El+Cano,+Paseo+Alfonso+XII,+Cartagena,+España" },
        { label: "Schedule", value: "Monday to Sunday · 08:00 to 19:00" },
        { label: "What to bring", value: "Comfortable clothing, sunscreen and a camera" }
      ]
    },
    contact: {
      eyebrow: "Let's talk?",
      title: "Contact",
      subtitle: "For large groups, private events or any inquiry",
      name: "Name",
      email: "Email",
      message: "Message",
      submit: "Send message",
      sent: "Message sent. We'll reply within 24 hours."
    },
    footer: {
      tag: "Cartagena, Murcia · Spain",
      legal: "Legal notice",
      privacy: "Privacy policy",
      cookies: "Cookies",
      rights: "All rights reserved"
    },
    menu: { lang: "Language", close: "Close" }
  },

  de: {
    nav: { home: "Start", tours: "Unsere Touren", prices: "Preise", about: "Über uns", book: "Buchen", contact: "Kontakt" },
    hero: {
      eyebrow: "Cartagena · seit 2025",
      title: "Entdecke Cartagena",
      subtitle: "Einzigartige Tuk-Tuk-Touren durch das Herz der Stadt",
      cta: "Tour buchen",
      scroll: "Scrollen"
    },
    tours: {
      eyebrow: "Drei Wege, die Stadt kennenzulernen",
      title: "Unsere Touren",
      book: "Diese Tour buchen",
      duration: "Min",
      mapCaption: "Voraussichtliche Route, vorbehaltlich Bestätigung",
      routeDisclaimer: "Die Routen können aufgrund von Straßensperrungen, Feierlichkeiten oder anderen Veranstaltungen in der Stadt geändert werden.",
      list: [
        {
          id: "city",
          name: "Cartagena City",
          duration: "90",
          tagline: "Die Seele der Stadt",
          desc: "Von römischen Ruinen über modernistische Architektur bis zum militärischen Erbe. Eine Route durch die berühmtesten Straßen: Paseo Alfonso XII, Calle Real, Plaza de España, Muralla del Mar und Parque Torres.",
          highlights: ["Altstadt", "Römische Geschichte", "Modernistische Architektur"]
        },
        {
          id: "bay",
          name: "Cartagena Bay",
          duration: "90",
          tagline: "Der legendäre Hafen",
          desc: "Eine Reise von einem Ende der Bucht zum anderen. Verstehen Sie ihre geografische und strategische Bedeutung. Inklusive Puente Quitapellejos, Algameca Chica, Faro de Navidad, Faro Verde und Cala Cortina.",
          highlights: ["Historische Leuchttürme", "Hafenblick", "Cala Cortina"]
        },
        {
          id: "myway",
          name: "Cartagena My Way",
          duration: "60",
          tagline: "Sie entscheiden",
          desc: "60 Minuten, um Cartagena ganz nach Ihren Wünschen zu erkunden. Kennen Sie die Stadt schon oder haben Sie einen bestimmten Ort im Sinn? Das ist Ihre individuelle Tour.",
          highlights: ["Freie Route", "Personalisiert", "60 Minuten"]
        }
      ]
    },
    gallery: {
      eyebrow: "Das Erlebnis in Bildern",
      title: "So fühlt sich eine Tuk-Tuk-Fahrt an"
    },
    prices: {
      eyebrow: "Klare Preise, keine Überraschungen",
      title: "Preise",
      perTuktukTitle: "Preis pro Tuk-Tuk",
      perTuktuk: "1 bis 4 Personen · privates Tuk-Tuk",
      perTuktukPrice: "120 €",
      perTuktukNote: "Der Preis gilt für das gesamte Tuk-Tuk, nicht pro Person. Maximal 4 Personen.",
      private6: "Tuk-Tuk · 6 Plätze (bald)",
      private6Price: "180 €",
      payment: "Bar und Karte vor Ort · Online-Zahlung bei Buchung",
      childNote: "Kinder unter 2 Jahren oder mit einem Gewicht unter 9 kg sind nicht erlaubt",
      comingSoon: "BALD"
    },
    booking: {
      eyebrow: "In unter 60 Sekunden buchen",
      title: "Buchen Sie Ihre Tour",
      subtitle: "Täglich von Montag bis Sonntag, 08:00 bis 19:00 Uhr verfügbar",
      tour: "Tour",
      tourPlaceholder: "Tour wählen",
      date: "Datum",
      time: "Abfahrtszeit",
      timePlaceholder: "Uhrzeit wählen",
      timeSlotFull: "Ausgebucht",
      people: "Personen",
      peopleMax: "Maximal 12 Personen (bis zu 3 Tuk-Tuks)",
      tuktukLabel: "privates Tuk-Tuk",
      tuktuksLabel: "private Tuk-Tuks",
      name: "Ihr Name",
      email: "Ihre E-Mail",
      total: "Gesamtbetrag",
      submit: "Bestätigen und zahlen",
      paymentMethods: "Sichere Kartenzahlung",
      dateUnavailable: "Dieses Datum ist nicht verfügbar",
      noSlots: "Für dieses Datum sind keine Abfahrtszeiten verfügbar",
      success: "Buchung bestätigt!",
      successDesc: "Wir haben Ihnen eine E-Mail mit allen Details geschickt. Bis bald in Cartagena.",
      reset: "Neue Buchung"
    },
    about: {
      eyebrow: "Über uns",
      title: "Cartagena, erzählt von jemandem, der hier lebt",
      body: "TUK TUK CARTAGENA entstand aus der Leidenschaft für eine Stadt mit über dreitausend Jahren Geschichte. Wir fahren jeden Tag durch ihre Straßen und möchten, dass Sie sie vom besten Platz aus entdecken: bequem, offen, mit einem Einheimischen, der jede Ecke kennt. Ein einzigartiges Erlebnis, um zu verstehen, warum Cartagena jeden Besucher verzaubert."
    },
    practical: {
      eyebrow: "Praktische Infos",
      title: "Alles, was Sie wissen müssen",
      openMaps: "In Google Maps öffnen",
      items: [
        { label: "Treffpunkt", value: "Paseo Alfonso XII 8, Eingang Terminal Juan Sebastián El Cano (Kreuzfahrtterminal), 30201, Cartagena, Murcia, Spanien", mapUrl: "https://maps.google.com/?q=Terminal+Juan+Sebastián+El+Cano,+Paseo+Alfonso+XII,+Cartagena,+España" },
        { label: "Zeitplan", value: "Montag bis Sonntag · 08:00 bis 19:00 Uhr" },
        { label: "Was mitbringen", value: "Bequeme Kleidung, Sonnenschutz und Kamera" }
      ]
    },
    contact: {
      eyebrow: "Reden wir?",
      title: "Kontakt",
      subtitle: "Für große Gruppen, private Veranstaltungen oder jede Anfrage",
      name: "Name",
      email: "E-Mail",
      message: "Nachricht",
      submit: "Nachricht senden",
      sent: "Nachricht gesendet. Wir antworten innerhalb von 24 Stunden."
    },
    footer: {
      tag: "Cartagena, Murcia · Spanien",
      legal: "Impressum",
      privacy: "Datenschutz",
      cookies: "Cookies",
      rights: "Alle Rechte vorbehalten"
    },
    menu: { lang: "Sprache", close: "Schließen" }
  },

  fr: {
    nav: { home: "Accueil", tours: "Nos Tours", prices: "Tarifs", about: "Qui sommes-nous", book: "Réserver", contact: "Contact" },
    hero: {
      eyebrow: "Cartagène · depuis 2025",
      title: "Découvrez Cartagène",
      subtitle: "Des tours uniques en tuk tuk au cœur de la ville",
      cta: "Réservez votre tour",
      scroll: "Défiler"
    },
    tours: {
      eyebrow: "Trois façons de connaître la ville",
      title: "Nos tours",
      book: "Réserver ce tour",
      duration: "min",
      mapCaption: "Itinéraire indicatif, sous réserve de confirmation",
      routeDisclaimer: "Les itinéraires peuvent être modifiés en raison de coupures de circulation, de célébrations ou d'autres événements ayant lieu dans la ville.",
      list: [
        {
          id: "city",
          name: "Cartagena City",
          duration: "90",
          tagline: "L'âme de la ville",
          desc: "Des ruines romaines à l'architecture moderniste et l'héritage militaire. Un itinéraire à travers les rues les plus emblématiques : Paseo Alfonso XII, Calle Real, Plaza de España, Muralla del Mar et Parque Torres.",
          highlights: ["Vieille ville", "Histoire romaine", "Architecture moderniste"]
        },
        {
          id: "bay",
          name: "Cartagena Bay",
          duration: "90",
          tagline: "La baie légendaire",
          desc: "Un parcours d'un bout à l'autre de la baie. Comprenez son importance géographique et stratégique. Comprend Puente Quitapellejos, Algameca Chica, Faro de Navidad, Faro Verde et Cala Cortina.",
          highlights: ["Phares historiques", "Vues sur le port", "Cala Cortina"]
        },
        {
          id: "myway",
          name: "Cartagena My Way",
          duration: "60",
          tagline: "Vous décidez",
          desc: "60 minutes pour explorer Cartagène exactement comme vous le souhaitez. Vous connaissez déjà la ville ou avez un endroit en tête ? C'est votre tour personnalisé.",
          highlights: ["Itinéraire libre", "Personnalisé", "60 minutes"]
        }
      ]
    },
    gallery: {
      eyebrow: "L'expérience en images",
      title: "Voilà ce que c'est de voyager en tuk tuk"
    },
    prices: {
      eyebrow: "Tarifs clairs, sans surprises",
      title: "Tarifs",
      perTuktukTitle: "Prix par tuk tuk",
      perTuktuk: "1 à 4 personnes · tuk tuk privé",
      perTuktukPrice: "120 €",
      perTuktukNote: "Le prix est pour le tuk tuk complet, pas par personne. Maximum 4 personnes.",
      private6: "Tuk tuk · 6 places (bientôt)",
      private6Price: "180 €",
      payment: "Espèces et carte sur place · paiement en ligne lors de la réservation",
      childNote: "Les enfants de moins de 2 ans ou pesant moins de 9 kg ne sont pas admis",
      comingSoon: "BIENTÔT"
    },
    booking: {
      eyebrow: "Réservez en moins de 60 secondes",
      title: "Réservez votre tour",
      subtitle: "Disponible tous les jours du lundi au dimanche, de 08h00 à 19h00",
      tour: "Tour",
      tourPlaceholder: "Choisir un tour",
      date: "Date",
      time: "Heure de départ",
      timePlaceholder: "Choisir une heure",
      timeSlotFull: "Complet",
      people: "Personnes",
      peopleMax: "Maximum 12 personnes (jusqu'à 3 tuk tuks)",
      tuktukLabel: "tuk tuk privé",
      tuktuksLabel: "tuk tuks privés",
      name: "Votre nom",
      email: "Votre email",
      total: "Total à payer",
      submit: "Confirmer et payer",
      paymentMethods: "Paiement sécurisé par carte",
      dateUnavailable: "Cette date n'est pas disponible",
      noSlots: "Aucun horaire disponible pour cette date",
      success: "Réservation confirmée !",
      successDesc: "Nous vous avons envoyé un email avec tous les détails. À bientôt à Cartagène.",
      reset: "Nouvelle réservation"
    },
    about: {
      eyebrow: "Qui sommes-nous",
      title: "Cartagène, racontée par ceux qui y vivent",
      body: "TUK TUK CARTAGENA est née d'une passion pour une ville qui compte plus de trois mille ans d'histoire. Nous parcourons ses rues chaque jour et nous voulons que vous les découvriez depuis le meilleur siège possible : confortable, ouvert, avec un local qui connaît chaque coin. Une expérience unique pour comprendre pourquoi Cartagène séduit tous ceux qui la visitent."
    },
    practical: {
      eyebrow: "Infos pratiques",
      title: "Tout ce que vous devez savoir",
      openMaps: "Ouvrir dans Google Maps",
      items: [
        { label: "Point de rencontre", value: "Paseo Alfonso XII 8, entrée Terminal Juan Sebastián El Cano (Terminal des Croisières), 30201, Cartagena, Murcia, Espagne", mapUrl: "https://maps.google.com/?q=Terminal+Juan+Sebastián+El+Cano,+Paseo+Alfonso+XII,+Cartagena,+España" },
        { label: "Horaires", value: "Lundi au dimanche · 08h00 à 19h00" },
        { label: "Quoi apporter", value: "Vêtements confortables, protection solaire et appareil photo" }
      ]
    },
    contact: {
      eyebrow: "On en parle ?",
      title: "Contact",
      subtitle: "Pour grands groupes, événements privés ou toute demande",
      name: "Nom",
      email: "Email",
      message: "Message",
      submit: "Envoyer le message",
      sent: "Message envoyé. Nous répondons sous 24 heures."
    },
    footer: {
      tag: "Cartagène, Murcie · Espagne",
      legal: "Mentions légales",
      privacy: "Politique de confidentialité",
      cookies: "Cookies",
      rights: "Tous droits réservés"
    },
    menu: { lang: "Langue", close: "Fermer" }
  }
};
