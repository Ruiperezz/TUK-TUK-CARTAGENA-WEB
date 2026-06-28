# INSTALL-SKILLS.md — Skills y subagentes para Claude Code + Cursor

Documento de instalación para el proyecto TUK TUK CARTAGENA.
Ejecuta todos los comandos en la terminal de Cursor (o en la terminal de tu Mac).

> **IMPORTANTE:** Ejecuta estos comandos ANTES de abrir el proyecto en Claude Code.
> Claude Code lee las skills instaladas globalmente al iniciar sesión.

---

## 1. UI UX Pro Max (v2.5.0)

La skill más potente para diseño. 67 estilos UI, 161 reglas por industria, 57 combinaciones de fuentes, 161 paletas de color, 99 guías de UX, 25 tipos de gráficos, 15 tech stacks.

```bash
# Instalar CLI global
npm install -g uipro-cli

# Inicializar para Cursor
uipro init --ai cursor --global

# Inicializar para Claude Code
uipro init --ai claude --global
```

**Comando útil dentro de Claude Code para buscar diseño específico:**
```bash
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "tourism luxury dark" --design-system -p "TukTukCartagena"
```

**Categoría específica para este proyecto:** Tourism / Hospitality / Luxury

---

## 2. Vercel Agent Skills (8 skills oficiales de Vercel)

Incluye: web-design-guidelines (100+ reglas de a11y/perf/UX), react-best-practices, react-view-transitions, composition-patterns, vercel-deploy-claimable, vercel-optimize.

```bash
npx skills add vercel-labs/agent-skills --global
```

---

## 3. VoltAgent Subagentes (solo los relevantes)

De los 155 subagentes disponibles, solo necesitamos 8 para este proyecto. Los instalamos todos y Claude Code usará los que necesite según el contexto.

```bash
# Instalar todos los subagentes (155)
curl -sO https://raw.githubusercontent.com/VoltAgent/awesome-claude-code-subagents/main/install-agents.sh && chmod +x install-agents.sh && ./install-agents.sh
```

**Subagentes que Claude Code debe usar para este proyecto:**

| Subagente | Cuándo usarlo |
|---|---|
| `frontend-developer` | Cualquier trabajo de HTML/CSS/JS/React |
| `react-specialist` | Componentes React, hooks, estado, renders |
| `nextjs-developer` | Migración a Next.js, App Router, API routes, SSR |
| `ui-designer` | Decisiones de diseño, layout, espaciado, jerarquía visual |
| `seo-specialist` | Schema.org, meta tags, hreflang, sitemap |
| `typescript-pro` | Tipado, interfaces, type safety |
| `performance-engineer` | Lazy loading, bundle size, Core Web Vitals |
| `code-reviewer` | Antes de cada commit, revisión de calidad |

---

## 4. Skills de Claude Code globales (awesome-claude-skills)

Si no las tienes instaladas todavía:

```bash
# Pack principal de ComposioHQ
git clone https://github.com/ComposioHQ/awesome-claude-skills.git /tmp/awesome-skills
cp -r /tmp/awesome-skills/skills/* ~/.claude/skills/ 2>/dev/null
rm -rf /tmp/awesome-skills

# Pack de affaan-m
git clone https://github.com/affaan-m/everything-claude-code.git /tmp/everything-skills
cp -r /tmp/everything-skills/skills/* ~/.claude/skills/ 2>/dev/null
rm -rf /tmp/everything-skills
```

---

## 5. Verificar instalación

Después de instalar todo, verifica:

```bash
# Verificar UI UX Pro Max
uipro --version
# Debería devolver 2.5.0 o superior

# Verificar subagentes VoltAgent
ls ~/.claude/agents/ | wc -l
# Debería devolver 131+ archivos

# Verificar skills globales
ls ~/.claude/skills/ | head -20
# Debería mostrar carpetas de skills

# Verificar Vercel skills
ls ~/.claude/skills/ | grep vercel
# Debería mostrar las 8 skills de Vercel
```

---

## 6. Herramientas externas necesarias (cuentas gratuitas)

Antes de empezar la Fase 2 del proyecto, crea estas cuentas:

| Servicio | Para qué | URL | Plan |
|---|---|---|---|
| **Supabase** | Base de datos (reservas + disponibilidad) | [supabase.com](https://supabase.com) | Free (500MB, suficiente) |
| **Stripe** | Pasarela de pago (tarjeta + PayPal) | [stripe.com](https://stripe.com) | Free (modo test) |
| **Resend** | Emails transaccionales (confirmaciones) | [resend.com](https://resend.com) | Free (100 emails/día) |
| **Vercel** | Hosting y deploy | [vercel.com](https://vercel.com) | Free (hobby) |

No las necesitas para la Fase 1 (migración a Next.js), pero tenlas listas para la Fase 2.

---

## 7. Qué NO instalar

Cosas que podrías pensar que necesitas pero que van a empeorar el resultado:

| NO instalar | Por qué |
|---|---|
| `next-intl`, `i18next`, `react-intl` | Ya tenemos sistema i18n propio en `translations.js`. Añadir una librería complica sin beneficio. |
| `framer-motion` | +40KB al bundle. Las animaciones CSS actuales (IntersectionObserver + transitions) son suficientes y más ligeras. |
| `shadcn/ui`, `chakra-ui`, `MUI` | El diseño está hecho custom con Tailwind. Una librería de componentes sobreescribiría todo y rompería la estética. |
| `tailwindcss-animate` | Las animaciones ya están en `index.css`. No necesitamos más utilidades de animación. |
| `next-themes` | No hay light mode. La web es dark-only por decisión de diseño del cliente. |
| `prisma` | Supabase ya tiene su cliente JS (`@supabase/supabase-js`). No necesitamos un ORM aparte. |

---

## 8. Estructura final del proyecto después de todas las fases

```
TUK-TUK-CARTAGENA-WEB/
├── .env.local                        ← Variables de entorno (NO subir a Git)
├── .env.example                      ← Plantilla de variables
├── .gitignore
├── CLAUDE.md                         ← Contexto para Claude Code
├── DESIGN.md                         ← Sistema de diseño
├── BRIEFING.md                       ← Info del cliente
├── README.md
├── next.config.js
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── public/
│   ├── favicon.svg
│   ├── sitemap.xml                   ← Generado con los 4 idiomas
│   └── robots.txt
├── app/
│   ├── layout.jsx                    ← Root layout (fonts, metadata)
│   ├── page.jsx                      ← Home (importa todas las secciones)
│   ├── admin/
│   │   └── page.jsx                  ← Panel admin (protegido)
│   └── api/
│       ├── bookings/
│       │   └── route.js              ← POST crear reserva → Stripe
│       ├── availability/
│       │   └── route.js              ← GET disponibilidad por mes
│       └── webhooks/
│           └── stripe/
│               └── route.js          ← Webhook de Stripe → confirmar + emails
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── SideMenu.jsx
│   │   ├── Hero.jsx
│   │   ├── Tours.jsx
│   │   ├── Prices.jsx
│   │   ├── BookingForm.jsx
│   │   ├── About.jsx
│   │   ├── PracticalInfo.jsx
│   │   ├── Contact.jsx
│   │   ├── Footer.jsx
│   │   └── Reveal.jsx               ← Componente de animación scroll
│   ├── i18n/
│   │   └── translations.js
│   ├── lib/
│   │   ├── supabase.js               ← Cliente Supabase
│   │   ├── stripe.js                  ← Config Stripe
│   │   └── emails/
│   │       ├── booking-customer.jsx   ← Template email cliente
│   │       └── booking-owner.jsx      ← Template email empresario
│   └── styles/
│       └── globals.css                ← Tailwind + utilidades
└── supabase/
    └── migrations/
        └── 001_initial.sql            ← Schema de las tablas
```
