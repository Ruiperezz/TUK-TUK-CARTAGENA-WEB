const TOUR_NAMES = {
  city: "Cartagena City (90 min)",
  bay: "Cartagena Bay (90 min)",
  myway: "Cartagena My Way (60 min)",
};

function esc(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

export function getOwnerEmailSubject(booking) {
  return `Nueva reserva — ${TOUR_NAMES[booking.tour] || booking.tour} — ${booking.date}`;
}

export function getOwnerEmailHtml(booking) {
  const peopleText = `${esc(booking.adults)} persona(s)`;

  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0F1419;font-family:'Helvetica Neue',Arial,sans-serif;color:#F8F6F1;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0F1419;padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

<tr><td style="padding:0 0 32px 0;text-align:center;">
  <span style="font-size:18px;letter-spacing:0.18em;font-weight:500;">TUK·TUK <span style="color:#D42E54;">CARTAGENA</span></span>
</td></tr>

<tr><td style="border-top:1px solid rgba(248,246,241,0.15);padding:32px 0 24px 0;">
  <div style="font-size:11px;letter-spacing:0.28em;text-transform:uppercase;color:#C9A961;margin-bottom:12px;">NUEVA RESERVA CONFIRMADA</div>
  <div style="font-size:24px;font-weight:500;line-height:1.2;">Tienes una nueva reserva</div>
</td></tr>

<tr><td style="padding:24px 0;border-top:1px solid rgba(248,246,241,0.1);">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td style="padding:8px 0;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(248,246,241,0.5);width:140px;">Tour</td>
      <td style="padding:8px 0;font-size:16px;">${esc(TOUR_NAMES[booking.tour] || booking.tour)}</td>
    </tr>
    <tr>
      <td style="padding:8px 0;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(248,246,241,0.5);">Fecha</td>
      <td style="padding:8px 0;font-size:16px;">${esc(booking.date)}</td>
    </tr>
    <tr>
      <td style="padding:8px 0;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(248,246,241,0.5);">Horario</td>
      <td style="padding:8px 0;font-size:16px;">${esc(booking.time_slot)}</td>
    </tr>
    <tr>
      <td style="padding:8px 0;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(248,246,241,0.5);">Personas</td>
      <td style="padding:8px 0;font-size:16px;">${peopleText}</td>
    </tr>
    <tr>
      <td style="padding:8px 0;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(248,246,241,0.5);">Total</td>
      <td style="padding:8px 0;font-size:24px;color:#C9A961;font-weight:500;">${esc(booking.total_price)} €</td>
    </tr>
  </table>
</td></tr>

<tr><td style="padding:24px 0;border-top:1px solid rgba(248,246,241,0.1);">
  <div style="font-size:11px;letter-spacing:0.28em;text-transform:uppercase;color:#C9A961;margin-bottom:12px;">DATOS DEL CLIENTE</div>
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td style="padding:6px 0;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(248,246,241,0.5);width:140px;">Nombre</td>
      <td style="padding:6px 0;font-size:16px;">${esc(booking.customer_name)}</td>
    </tr>
    <tr>
      <td style="padding:6px 0;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(248,246,241,0.5);">Email</td>
      <td style="padding:6px 0;font-size:16px;"><a href="mailto:${esc(booking.customer_email)}" style="color:#C9A961;">${esc(booking.customer_email)}</a></td>
    </tr>
    <tr>
      <td style="padding:6px 0;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(248,246,241,0.5);">Idioma</td>
      <td style="padding:6px 0;font-size:16px;">${esc((booking.customer_lang || "es").toUpperCase())}</td>
    </tr>
  </table>
</td></tr>

<tr><td style="padding:24px 0;border-top:1px solid rgba(248,246,241,0.1);text-align:center;">
  <div style="font-size:12px;color:rgba(248,246,241,0.4);">ID de reserva: ${esc(booking.id)}</div>
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}
