import { NextResponse } from "next/server";
import { Resend } from "resend";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function esc(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

export async function POST(request) {
  try {
    const { name, email, message } = await request.json();

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json({ error: "Nombre requerido" }, { status: 400 });
    }
    if (name.trim().length > 150) {
      return NextResponse.json({ error: "Nombre demasiado largo" }, { status: 400 });
    }
    if (!email || !EMAIL_RE.test(email) || email.length > 320) {
      return NextResponse.json({ error: "Email no válido" }, { status: 400 });
    }
    if (!message || typeof message !== "string" || message.trim().length < 5) {
      return NextResponse.json({ error: "Mensaje requerido" }, { status: 400 });
    }
    if (message.trim().length > 3000) {
      return NextResponse.json({ error: "Mensaje demasiado largo (máx. 3000 caracteres)" }, { status: 400 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const businessEmail = process.env.BUSINESS_EMAIL || "reservas@tuktukcartagena.com";
    const safeName = name.trim().replace(/[\r\n\t]+/g, " ");

    await resend.emails.send({
      from: "TUK TUK Cartagena <noreply@tuktukcartagena.com>",
      to: businessEmail,
      replyTo: email.trim(),
      subject: `Nuevo mensaje de contacto — ${safeName}`,
      html: `<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0F1419;font-family:'Helvetica Neue',Arial,sans-serif;color:#F8F6F1;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0F1419;padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

<tr><td style="padding:0 0 32px 0;text-align:center;">
  <span style="font-size:18px;letter-spacing:0.18em;font-weight:500;">TUK·TUK <span style="color:#C9A961;">CARTAGENA</span></span>
</td></tr>

<tr><td style="border-top:1px solid rgba(248,246,241,0.15);padding:32px 0 24px 0;">
  <div style="font-size:11px;letter-spacing:0.28em;text-transform:uppercase;color:#C9A961;margin-bottom:12px;">NUEVO MENSAJE DE CONTACTO</div>
  <div style="font-size:24px;font-weight:500;line-height:1.2;">Alguien quiere ponerse en contacto</div>
</td></tr>

<tr><td style="padding:24px 0;border-top:1px solid rgba(248,246,241,0.1);">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td style="padding:8px 0;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(248,246,241,0.5);width:120px;">Nombre</td>
      <td style="padding:8px 0;font-size:16px;">${esc(safeName)}</td>
    </tr>
    <tr>
      <td style="padding:8px 0;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(248,246,241,0.5);">Email</td>
      <td style="padding:8px 0;font-size:16px;"><a href="mailto:${esc(email)}" style="color:#C9A961;">${esc(email)}</a></td>
    </tr>
  </table>
</td></tr>

<tr><td style="padding:24px 0;border-top:1px solid rgba(248,246,241,0.1);">
  <div style="font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#C9A961;margin-bottom:12px;">MENSAJE</div>
  <div style="font-size:15px;line-height:1.7;color:rgba(248,246,241,0.85);">${esc(message).replace(/\n/g, "<br>")}</div>
</td></tr>

<tr><td style="padding:24px 0;border-top:1px solid rgba(248,246,241,0.1);text-align:center;">
  <div style="font-size:12px;color:rgba(248,246,241,0.4);">Responde directamente a este email para contestar al cliente</div>
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>`,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact error:", err);
    return NextResponse.json({ error: "Error al enviar el mensaje" }, { status: 500 });
  }
}
