const SUBJECTS = {
  es: "Tu reserva en TUK TUK Cartagena está confirmada",
  en: "Your TUK TUK Cartagena booking is confirmed",
  de: "Ihre Buchung bei TUK TUK Cartagena ist bestätigt",
  fr: "Votre réservation TUK TUK Cartagena est confirmée",
};

const TOUR_NAMES = {
  city: "Cartagena City (90 min)",
  bay: "Cartagena Bay (90 min)",
  myway: "Cartagena My Way (60 min)",
};


const LABELS = {
  es: {
    greeting: "¡Hola",
    confirmed: "Tu reserva está confirmada",
    tour: "Tour", date: "Fecha", time: "Horario", people: "Personas",
    adults: "adulto(s)", kids: "niño(s)", private: "Tuk tuk privado",
    total: "Total pagado", meetingPoint: "Punto de encuentro",
    meetingValue: "Te lo enviaremos por email antes de tu tour",
    whatToBring: "Qué llevar",
    whatToBringValue: "Ropa cómoda, protección solar y cámara",
    questions: "¿Preguntas?",
    questionsValue: "Responde a este email o escríbenos a",
    seeYou: "¡Nos vemos en Cartagena!", team: "El equipo de TUK TUK Cartagena",
  },
  en: {
    greeting: "Hi", confirmed: "Your booking is confirmed",
    tour: "Tour", date: "Date", time: "Time", people: "People",
    adults: "adult(s)", kids: "child(ren)", private: "Private tuk tuk",
    total: "Total paid", meetingPoint: "Meeting point",
    meetingValue: "We'll send it by email before your tour",
    whatToBring: "What to bring",
    whatToBringValue: "Comfortable clothing, sunscreen and a camera",
    questions: "Questions?",
    questionsValue: "Reply to this email or write to",
    seeYou: "See you in Cartagena!", team: "The TUK TUK Cartagena team",
  },
  de: {
    greeting: "Hallo", confirmed: "Ihre Buchung ist bestätigt",
    tour: "Tour", date: "Datum", time: "Uhrzeit", people: "Personen",
    adults: "Erwachsene(r)", kids: "Kind(er)", private: "Privates Tuk-Tuk",
    total: "Bezahlter Betrag", meetingPoint: "Treffpunkt",
    meetingValue: "Wir senden ihn Ihnen per E-Mail vor Ihrer Tour",
    whatToBring: "Was mitbringen",
    whatToBringValue: "Bequeme Kleidung, Sonnenschutz und Kamera",
    questions: "Fragen?",
    questionsValue: "Antworten Sie auf diese E-Mail oder schreiben Sie an",
    seeYou: "Bis bald in Cartagena!", team: "Das TUK TUK Cartagena Team",
  },
  fr: {
    greeting: "Bonjour", confirmed: "Votre réservation est confirmée",
    tour: "Tour", date: "Date", time: "Heure", people: "Personnes",
    adults: "adulte(s)", kids: "enfant(s)", private: "Tuk tuk privé",
    total: "Total payé", meetingPoint: "Point de rencontre",
    meetingValue: "Nous vous l'enverrons par email avant votre tour",
    whatToBring: "Quoi apporter",
    whatToBringValue: "Vêtements confortables, protection solaire et appareil photo",
    questions: "Questions ?",
    questionsValue: "Répondez à cet email ou écrivez-nous à",
    seeYou: "À bientôt à Cartagène !", team: "L'équipe TUK TUK Cartagena",
  },
};

function esc(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

export function getCustomerEmailSubject(lang) {
  return SUBJECTS[lang] || SUBJECTS.es;
}

export function getCustomerEmailHtml(booking) {
  const lang = booking.customer_lang || "es";
  const l = LABELS[lang] || LABELS.es;
  const timeLabel = esc(booking.time_slot);

  const peopleText = `${esc(booking.adults)} ${l.adults}`;

  const businessEmail = process.env.BUSINESS_EMAIL || "info@tuktukcartagena.com";

  return `<!DOCTYPE html>
<html lang="${esc(lang)}">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0F1419;font-family:'Helvetica Neue',Arial,sans-serif;color:#F8F6F1;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0F1419;padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

<tr><td style="padding:0 0 32px 0;text-align:center;">
  <span style="font-size:18px;letter-spacing:0.18em;font-weight:500;">TUK·TUK <span style="color:#C9A961;">CARTAGENA</span></span>
</td></tr>

<tr><td style="border-top:1px solid rgba(248,246,241,0.15);padding:32px 0 24px 0;">
  <div style="font-size:11px;letter-spacing:0.28em;text-transform:uppercase;color:#C9A961;margin-bottom:12px;">${esc(l.confirmed)}</div>
  <div style="font-size:28px;font-weight:500;line-height:1.2;">${esc(l.greeting)}, ${esc(booking.customer_name)}!</div>
</td></tr>

<tr><td style="padding:24px 0;border-top:1px solid rgba(248,246,241,0.1);">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td style="padding:8px 0;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(248,246,241,0.5);width:120px;">${esc(l.tour)}</td>
      <td style="padding:8px 0;font-size:16px;">${esc(TOUR_NAMES[booking.tour] || booking.tour)}</td>
    </tr>
    <tr>
      <td style="padding:8px 0;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(248,246,241,0.5);">${esc(l.date)}</td>
      <td style="padding:8px 0;font-size:16px;">${esc(booking.date)}</td>
    </tr>
    <tr>
      <td style="padding:8px 0;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(248,246,241,0.5);">${esc(l.time)}</td>
      <td style="padding:8px 0;font-size:16px;">${esc(timeLabel)}</td>
    </tr>
    <tr>
      <td style="padding:8px 0;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(248,246,241,0.5);">${esc(l.people)}</td>
      <td style="padding:8px 0;font-size:16px;">${peopleText}</td>
    </tr>
    <tr>
      <td style="padding:8px 0;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(248,246,241,0.5);">${esc(l.total)}</td>
      <td style="padding:8px 0;font-size:24px;color:#C9A961;font-weight:500;">${esc(booking.total_price)} €</td>
    </tr>
  </table>
</td></tr>

<tr><td style="padding:24px 0;border-top:1px solid rgba(248,246,241,0.1);">
  <div style="margin-bottom:16px;">
    <div style="font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#C9A961;margin-bottom:4px;">${esc(l.meetingPoint)}</div>
    <div style="font-size:14px;color:rgba(248,246,241,0.7);">${esc(l.meetingValue)}</div>
  </div>
  <div style="margin-bottom:16px;">
    <div style="font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#C9A961;margin-bottom:4px;">${esc(l.whatToBring)}</div>
    <div style="font-size:14px;color:rgba(248,246,241,0.7);">${esc(l.whatToBringValue)}</div>
  </div>
  <div>
    <div style="font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#C9A961;margin-bottom:4px;">${esc(l.questions)}</div>
    <div style="font-size:14px;color:rgba(248,246,241,0.7);">${esc(l.questionsValue)} <a href="mailto:${esc(businessEmail)}" style="color:#C9A961;">${esc(businessEmail)}</a></div>
  </div>
</td></tr>

<tr><td style="padding:32px 0;border-top:1px solid rgba(248,246,241,0.1);text-align:center;">
  <div style="font-size:18px;font-weight:500;margin-bottom:8px;">${esc(l.seeYou)}</div>
  <div style="font-size:12px;color:rgba(248,246,241,0.5);">${esc(l.team)}</div>
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}
