# CLAUDE.md

Este archivo da contexto a Claude Code (y a Cursor) cuando trabaje en este proyecto. Léelo antes de hacer cambios.

---

## Qué es esto

Web de **TUK TUK CARTAGENA**, una empresa de tours en tuk tuk en Cartagena (Murcia, España). Cliente nuevo del estudio (Ruipérez Studio). Mayoría de visitantes serán turistas internacionales que bajan de cruceros.

**Estado:** prototipo visual de alta fidelidad. Falta el backend real (reservas, pagos, emails).

---

## Stack y comandos

- **Framework:** React 18 + Vite
- **Estilos:** Tailwind CSS 3 + algo de CSS inline para colores y animaciones específicas
- **Iconos:** `lucide-react`
- **Fuentes:** Playfair Display (display) + Inter (body) vía Google Fonts

```bash
npm run dev      # desarrollo
npm run build    # producción
npm run preview  # preview del build
```

---

## Convenciones de código

### Reglas duras
- **Nada de `localStorage` ni `sessionStorage`** — el proyecto se monta como artifact y esos APIs están bloqueadas. Estado vive en React (`useState`).
- **No introducir librerías nuevas sin avisar al usuario antes.** Especialmente nada pesado (UI libraries, animation libraries grandes, etc.).
- **No tocar `src/i18n/translations.js` sin replicar el cambio en los 4 idiomas.** Si añades una clave en `es`, también va en `en`, `de`, `fr`. Coherencia obligatoria.
- **Cualquier texto visible debe pasar por i18n.** No hardcodear strings en español dentro de los componentes.

### Reglas de estilo visual
- **Paleta canónica:**
  - Fondo principal: `#0F1419` (carbón profundo)
  - Fondo secundario: `#0B0E12` (negro más oscuro para secciones alternas)
  - Acento dorado: `#C9A961` (único acento, no añadir más)
  - Texto claro: `#F8F6F1` (crema, no blanco puro)
  - Bordes sutiles: `rgba(248,246,241,0.1)` a `0.18`
- **Sin gradientes morados, sin esquinas redondeadas grandes** (`rounded-lg` o mayor está prohibido salvo casos justificados). Estética editorial / luxury, no SaaS genérico.
- **Tipografía:** titulares siempre `font-family: 'Playfair Display'` (clase `.serif` en CSS). Cuerpo con Inter. Eyebrows con `tracking-[0.28em] uppercase text-[11px]`.
- **Animaciones:** discretas. `IntersectionObserver` para revelar al hacer scroll. Nada de Framer Motion ni efectos exagerados.

### Estructura de componentes
- Por ahora todo el componente principal está en `src/App.jsx` (un único archivo). Si crece mucho, partir en `src/sections/` con un archivo por sección (`Hero.jsx`, `Tours.jsx`, etc.).
- Los componentes auxiliares pequeños (`Reveal`, hooks) pueden quedarse dentro de `App.jsx` mientras sean compactos.

---

## i18n

- 4 idiomas: **ES (default), EN, DE, FR**.
- Estructura de claves anidada en `src/i18n/translations.js`. Sigue la misma forma para todos los idiomas (mismas keys, mismo orden).
- Detección automática vía `navigator.language` al cargar. Manual con el selector ES/EN/DE/FR.
- Si añades una sección nueva, añade su objeto de traducción en los 4 idiomas antes de hacer commit.

---

## Lo que NO está implementado y NO inventes

- **No hay backend.** El botón "Confirmar reserva" no envía emails reales ni procesa pagos. Simula confirmación con un estado de React.
- **El calendario de fechas es un `<input type="date">` nativo.** No hay lógica de disponibilidad real (días de crucero) todavía.
- **El formulario de contacto** tampoco envía nada.
- **No hay rutas (`react-router`)** — todo es una sola página con scroll a anclas (`#hero`, `#tours`, etc.).

Si el usuario pide funcionalidad real, recuérdale que requiere:
- Backend (Next.js API routes / Node + Express / Vercel Functions)
- Servicio de email transaccional (Resend, SendGrid, Mailgun)
- Pasarela de pago (Stripe, Redsys, PayPal, Bizum vía Redsys)
- Base de datos para reservas (Supabase, Postgres, etc.) o un sistema externo (Bokun, FareHarbor)

---

## Información del cliente

Datos reales recopilados vía briefing. Ver `BRIEFING.md` para todo el detalle.

**Resumen rápido:**
- 3 tours: Cartagena City (90min), Cartagena Bay (90min), Cartagena My Way (60min)
- Precios: 30€ adulto, 15€ niño (2-12), tuk tuk privado 4pax 120€
- Tuk tuk 6 plazas: próximamente, 180€ privado
- Idiomas: ES + EN + DE + FR (detección automática)
- Pago aceptado: efectivo, tarjeta, online (tarjeta + Bizum + PayPal)
- Reservas: por email, con confirmación automática al cliente y al empresario
- Sin redes sociales todavía
- Inspiración visual: web de Trump Tower NY (oscuro, premium, hero vídeo, menú hamburguesa)

---

## Decisiones tomadas y por qué

| Decisión | Por qué |
|---|---|
| Dark mode permanente | Diferenciación frente a webs turísticas (siempre claras y genéricas). Inspiración Trump Tower NY. |
| Dorado `#C9A961` como único acento | Mediterráneo, premium, no chillón. Funciona sobre fondo oscuro. |
| Single page + scroll | Crucerista quiere reservar rápido, no navegar por 5 páginas. |
| Detección automática del idioma | El visitante medio no busca el switcher; queremos que llegue en su idioma. |
| Sin esquinas redondeadas | Look editorial/luxury, no SaaS. |
| Italic dorado en "Cartagena" del título | Único punto de protagonismo tipográfico — efecto memorable sin abusar. |
| Formulario de reserva con `+/-` para personas | Más cómodo que un `<select>` en móvil, especialmente para turistas mayores. |
| Aforo no validado todavía | Pendiente: bloquear que adultos+niños supere 4 en compartido. |

---

## Bugs conocidos / TODO

- [ ] Aforo máximo del tuk tuk (4 plazas) no se valida en el formulario.
- [ ] Falta `aria-label` en algunos botones de incremento.
- [ ] El placeholder del hero es un gradient; cuando llegue el vídeo real, sustituir.
- [ ] Falta tests (Vitest + React Testing Library, cuando merezca la pena).
- [ ] El selector de idioma del header se solapa con el menú hamburguesa en pantallas <380px.

---

## Cómo trabajar con Claude Code aquí

1. Abre el proyecto en Cursor.
2. Antes de pedirle nada complejo, comparte este archivo (`CLAUDE.md`) y `DESIGN.md`.
3. Para añadir/editar una sección, recuérdale que actualice las 4 traducciones.
4. Cuando integres backend real, este archivo necesitará actualizarse para reflejar el nuevo stack.

---

## Contacto / Owner

- **Estudio:** Ruipérez Studio
- **Web:** [ruiperezstudio.es](https://ruiperezstudio.es)
- **Ubicación:** Cartagena, Murcia, España

---

## Skills y subagentes instalados — ÚSALOS

Tienes acceso a skills y subagentes globales. No los ignores. Están instalados para que los uses activamente en cada tarea.

### UI UX Pro Max (v2.5.0)
Skill de diseño avanzado. Úsala SIEMPRE que toques algo visual.
- Buscar reglas de diseño para turismo/luxury: `python3 .claude/skills/ui-ux-pro-max/scripts/search.py "tourism luxury dark" --design-system -p "TukTukCartagena"`
- Buscar paletas: `python3 .claude/skills/ui-ux-pro-max/scripts/search.py "mediterranean gold dark palette"`
- Buscar tipografías: `python3 .claude/skills/ui-ux-pro-max/scripts/search.py "serif display pairing"`
- 67 estilos UI, 161 reglas por industria, 99 guías UX. Si tienes duda sobre un patrón de diseño, consúltala antes de inventar.

### Vercel Agent Skills
8 skills oficiales de Vercel. Las más relevantes:
- `web-design-guidelines` — 100+ reglas de accesibilidad, rendimiento y UX. Consúltala antes de cada commit que toque frontend.
- `react-best-practices` — patrones React, hooks, composición. Úsala cuando refactorices componentes.
- `vercel-deploy-claimable` — cuando toque desplegar.
- `vercel-optimize` — para optimización de bundle y Core Web Vitals.

### Subagentes VoltAgent
Tienes 131+ subagentes en `~/.claude/agents/`. Delega tareas especializadas:

| Tarea | Subagente a usar |
|---|---|
| Maquetación, CSS, layout, responsive | `frontend-developer` |
| Componentes React, hooks, estado | `react-specialist` |
| App Router, API routes, SSR, middleware | `nextjs-developer` |
| Decisiones de diseño, jerarquía visual | `ui-designer` |
| Schema.org, meta tags, hreflang, sitemap | `seo-specialist` |
| Interfaces TypeScript, type safety | `typescript-pro` |
| Lazy loading, bundle, Core Web Vitals | `performance-engineer` |
| Revisión de código antes de commit | `code-reviewer` |

### Cuándo usar qué
- **Antes de tocar CSS/diseño:** consulta UI UX Pro Max + `web-design-guidelines`
- **Antes de crear un componente React:** consulta `react-best-practices`
- **Antes de un commit importante:** delega a `code-reviewer`
- **Cuando trabajes en SEO:** delega a `seo-specialist`
- **Cuando trabajes en API routes Next.js:** delega a `nextjs-developer`

### Qué NO instalar ni usar
- `framer-motion` — las animaciones CSS son suficientes (+40KB innecesarios)
- `shadcn/ui`, `chakra-ui`, `MUI` — el diseño es custom con Tailwind, una librería de componentes lo rompe
- `next-intl`, `i18next` — ya tenemos i18n propio en translations.js
- `next-themes` — no hay light mode, la web es dark-only
- `prisma` — Supabase tiene su propio cliente JS
