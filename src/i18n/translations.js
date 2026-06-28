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
    prices: {
      eyebrow: "Tarifas claras, sin sorpresas",
      title: "Precios",
      perPersonTitle: "Por persona",
      privateTitle: "Tuk tuk privado",
      adult: "Adultos (13+ años)", adultPrice: "30 €",
      kid: "Niños (2 a 12 años)", kidPrice: "15 €",
      under2: "Menores de 2 años no admitidos · peso mínimo 9 kg",
      private4: "Tuk tuk privado · 4 plazas", private4Price: "120 €",
      private6: "Tuk tuk privado · 6 plazas (próximamente)", private6Price: "180 €",
      payment: "Efectivo y tarjeta en el momento · pago online al reservar",
      comingSoon: "PRÓXIMAMENTE"
    },
    booking: {
      eyebrow: "Reserva en menos de 60 segundos",
      title: "Reserva tu tour",
      subtitle: "Disponibilidad principalmente los días en que hay cruceros en el puerto",
      tour: "Tour",
      tourPlaceholder: "Selecciona un tour",
      date: "Fecha",
      time: "Hora",
      timeMorning: "Mañana",
      timeAfternoon: "Primera hora de la tarde",
      adults: "Adultos",
      kids: "Niños (2-12)",
      private: "Reservar tuk tuk privado",
      privateDesc: "Toda la experiencia para ti y los tuyos",
      name: "Tu nombre",
      email: "Tu email",
      total: "Total a pagar",
      submit: "Confirmar reserva y pagar",
      paymentMethods: "Tarjeta · Bizum · PayPal",
      capacityError: "Máximo 4 personas en tour compartido. Selecciona tuk tuk privado para más.",
      dateUnavailable: "Esta fecha no está disponible",
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
      items: [
        { label: "Punto de encuentro", value: "Por confirmar — te lo indicaremos al reservar" },
        { label: "Horario", value: "Principalmente días de crucero · mañana y primera hora de la tarde" },
        { label: "Idiomas del tour", value: "Español e inglés" },
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
    prices: {
      eyebrow: "Clear pricing, no surprises",
      title: "Prices",
      perPersonTitle: "Per person",
      privateTitle: "Private tuk tuk",
      adult: "Adults (13+)", adultPrice: "€30",
      kid: "Children (2 to 12)", kidPrice: "€15",
      under2: "Children under 2 not admitted · minimum weight 9 kg",
      private4: "Private tuk tuk · 4 seats", private4Price: "€120",
      private6: "Private tuk tuk · 6 seats (coming soon)", private6Price: "€180",
      payment: "Cash and card on the day · online payment when booking",
      comingSoon: "COMING SOON"
    },
    booking: {
      eyebrow: "Book in under 60 seconds",
      title: "Book your tour",
      subtitle: "Availability mainly on cruise ship port days",
      tour: "Tour",
      tourPlaceholder: "Choose a tour",
      date: "Date",
      time: "Time",
      timeMorning: "Morning",
      timeAfternoon: "Early afternoon",
      adults: "Adults",
      kids: "Children (2-12)",
      private: "Book private tuk tuk",
      privateDesc: "The whole experience for you and yours",
      name: "Your name",
      email: "Your email",
      total: "Total to pay",
      submit: "Confirm and pay",
      paymentMethods: "Card · Bizum · PayPal",
      capacityError: "Maximum 4 people on shared tour. Select private tuk tuk for more.",
      dateUnavailable: "This date is not available",
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
      items: [
        { label: "Meeting point", value: "To be confirmed — we'll let you know when you book" },
        { label: "Schedule", value: "Mainly on cruise ship days · morning and early afternoon" },
        { label: "Tour languages", value: "Spanish and English" },
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
    prices: {
      eyebrow: "Klare Preise, keine Überraschungen",
      title: "Preise",
      perPersonTitle: "Pro Person",
      privateTitle: "Privates Tuk-Tuk",
      adult: "Erwachsene (13+)", adultPrice: "30 €",
      kid: "Kinder (2 bis 12)", kidPrice: "15 €",
      under2: "Kinder unter 2 Jahren nicht zugelassen · Mindestgewicht 9 kg",
      private4: "Privates Tuk-Tuk · 4 Plätze", private4Price: "120 €",
      private6: "Privates Tuk-Tuk · 6 Plätze (bald)", private6Price: "180 €",
      payment: "Bar und Karte vor Ort · Online-Zahlung bei Buchung",
      comingSoon: "BALD"
    },
    booking: {
      eyebrow: "In unter 60 Sekunden buchen",
      title: "Buchen Sie Ihre Tour",
      subtitle: "Verfügbarkeit hauptsächlich an Tagen mit Kreuzfahrtschiffen im Hafen",
      tour: "Tour",
      tourPlaceholder: "Tour wählen",
      date: "Datum",
      time: "Uhrzeit",
      timeMorning: "Vormittag",
      timeAfternoon: "Früher Nachmittag",
      adults: "Erwachsene",
      kids: "Kinder (2-12)",
      private: "Privates Tuk-Tuk buchen",
      privateDesc: "Die gesamte Erfahrung für Sie und Ihre Begleitung",
      name: "Ihr Name",
      email: "Ihre E-Mail",
      total: "Gesamtbetrag",
      submit: "Bestätigen und zahlen",
      paymentMethods: "Karte · Bizum · PayPal",
      capacityError: "Maximal 4 Personen bei gemeinsamer Tour. Wählen Sie ein privates Tuk-Tuk für mehr.",
      dateUnavailable: "Dieses Datum ist nicht verfügbar",
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
      items: [
        { label: "Treffpunkt", value: "Wird bestätigt — Sie erfahren ihn bei der Buchung" },
        { label: "Zeitplan", value: "Hauptsächlich an Kreuzfahrttagen · Vormittag und früher Nachmittag" },
        { label: "Tour-Sprachen", value: "Spanisch und Englisch" },
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
    prices: {
      eyebrow: "Tarifs clairs, sans surprises",
      title: "Tarifs",
      perPersonTitle: "Par personne",
      privateTitle: "Tuk tuk privé",
      adult: "Adultes (13+)", adultPrice: "30 €",
      kid: "Enfants (2 à 12 ans)", kidPrice: "15 €",
      under2: "Enfants de moins de 2 ans non admis · poids minimum 9 kg",
      private4: "Tuk tuk privé · 4 places", private4Price: "120 €",
      private6: "Tuk tuk privé · 6 places (bientôt)", private6Price: "180 €",
      payment: "Espèces et carte sur place · paiement en ligne lors de la réservation",
      comingSoon: "BIENTÔT"
    },
    booking: {
      eyebrow: "Réservez en moins de 60 secondes",
      title: "Réservez votre tour",
      subtitle: "Disponibilité principalement les jours de croisière au port",
      tour: "Tour",
      tourPlaceholder: "Choisir un tour",
      date: "Date",
      time: "Heure",
      timeMorning: "Matin",
      timeAfternoon: "Début d'après-midi",
      adults: "Adultes",
      kids: "Enfants (2-12)",
      private: "Réserver tuk tuk privé",
      privateDesc: "Toute l'expérience pour vous et vos proches",
      name: "Votre nom",
      email: "Votre email",
      total: "Total à payer",
      submit: "Confirmer et payer",
      paymentMethods: "Carte · Bizum · PayPal",
      capacityError: "Maximum 4 personnes en tour partagé. Sélectionnez un tuk tuk privé pour plus.",
      dateUnavailable: "Cette date n'est pas disponible",
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
      items: [
        { label: "Point de rencontre", value: "À confirmer — nous vous le communiquerons à la réservation" },
        { label: "Horaires", value: "Principalement les jours de croisière · matin et début d'après-midi" },
        { label: "Langues du tour", value: "Espagnol et anglais" },
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
