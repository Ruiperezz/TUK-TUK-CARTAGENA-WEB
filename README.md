# TUK TUK Cartagena — Website

Web oficial de **TUK TUK CARTAGENA**, empresa de tours en tuk tuk por Cartagena (Murcia, España). Diseñada y desarrollada por **Ruipérez Studio**.

> Estado actual: **Prototipo visual de alta fidelidad**. Listo para iterar el diseño con el cliente antes de integrar backend, pasarela de pago y sistema real de reservas.

---

## Demo

Web pensada para turistas internacionales (mayoría llegan en cruceros). Multilingüe (ES/EN/DE/FR) con detección automática del idioma del navegador.

**Dominio final:** [tuktukcartagena.com](https://tuktukcartagena.com) *(pendiente de publicación)*

---

## Stack

- **React 18** + **Vite** — bundler rápido, DX moderno
- **Tailwind CSS** — utility-first styling
- **lucide-react** — iconografía consistente
- **Google Fonts** — Playfair Display (display) + Inter (body)

Sin dependencias innecesarias. Single-file component en `src/App.jsx` con i18n separado en `src/i18n/translations.js`.

---

## Empezar

```bash
# Instalar dependencias
npm install

# Modo desarrollo (http://localhost:5173)
npm run dev

# Build de producción
npm run build

# Preview del build
npm run preview
```

Requisitos: **Node 18+**.

---

## Estructura

```
.
├── CLAUDE.md                    # Contexto del proyecto para Claude Code
├── DESIGN.md                    # Sistema de diseño y decisiones visuales
├── BRIEFING.md                  # Briefing del cliente (info recopilada)
├── README.md                    # Este archivo
├── index.html                   # HTML root
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.jsx                 # Entry point React
    ├── App.jsx                  # Componente principal
    ├── index.css                # Tailwind + estilos globales
    └── i18n/
        └── translations.js      # Traducciones ES/EN/DE/FR
```

---

## Estado de funcionalidades

| Funcionalidad                    | Estado          | Notas                                                  |
|----------------------------------|-----------------|--------------------------------------------------------|
| Diseño responsive                | ✅ Completo      | Mobile-first, breakpoints en md/lg                     |
| 4 idiomas (ES/EN/DE/FR)          | ✅ Completo      | Detección automática del navegador                     |
| Menú hamburguesa lateral         | ✅ Completo      | Animación de entrada desde la izquierda                |
| Hero con vídeo                   | 🟡 Placeholder   | Falta vídeo real del cliente                           |
| 3 tours + descripciones          | ✅ Completo      | Datos finales del cliente integrados                   |
| Tabla de precios                 | ✅ Completo      | Tuk tuk 6 plazas marcado como "próximamente"           |
| Formulario de reserva            | 🟡 Frontend OK   | Sin backend ni pago real conectado                     |
| Cálculo de precio en vivo        | ✅ Completo      | 30€ adulto + 15€ niño · privado 120€                   |
| Envío de emails automáticos      | ❌ Pendiente     | Requiere backend (ver "Próximos pasos")                |
| Pasarela de pago real            | ❌ Pendiente     | Requiere Stripe / Redsys / PayPal                      |
| Calendario de disponibilidad     | ❌ Pendiente     | Integrar Bokun, FareHarbor o booking propio            |
| Panel de administración          | ❌ Pendiente     | Para gestionar horarios y reservas                     |
| Cumplimiento RGPD                | 🟡 Estructura    | Falta cookie banner real y contenido legal             |
| SEO multi-idioma                 | 🟡 Básico        | Falta hreflang, sitemaps y schema.org                  |

---

## Próximos pasos (roadmap)

### Fase 1 — Diseño finalizado *(actual)*
- [x] Estructura y secciones
- [x] Multilingüe con detección automática
- [x] Formulario de reserva visual
- [ ] Validación con el cliente y ajustes de copy

### Fase 2 — Contenido real
- [ ] Recopilar fotos profesionales del tuk tuk, rutas y entorno (mínimo 10-15)
- [ ] Grabar o licenciar vídeo hero (15-30 segundos)
- [ ] Logo definitivo
- [ ] Textos legales reales (aviso legal, privacidad, cookies)

### Fase 3 — Backend y funcionalidad real
- [ ] Decidir stack: Next.js + Stripe + Resend / WordPress + Bokun
- [ ] Sistema de reservas con calendario gestionable
- [ ] Pago online (tarjeta + Bizum + PayPal)
- [ ] Emails automáticos al cliente y al empresario
- [ ] Panel admin para horarios

### Fase 4 — Lanzamiento
- [ ] Hosting (Vercel / Hostinger)
- [ ] DNS apuntando a `tuktukcartagena.com`
- [ ] SSL configurado
- [ ] Google Analytics y Search Console
- [ ] Schema.org TouristAttraction + LocalBusiness

### Fase 5 — Mantenimiento mensual
- [ ] Actualización de horario según calendario del Puerto
- [ ] Backups automáticos
- [ ] Monitorización de seguridad

---

## Decisiones clave

- **Single-page application** en vez de multi-página: el cliente turista quiere ver todo de un vistazo y reservar. Sin distracciones.
- **Detección automática del idioma**: el visitante medio es un crucerista que no quiere buscar el botón de idioma.
- **Dark + dorado mediterráneo**: diferenciarse de las webs turísticas genéricas (claro/verde/azul cliché). Transmite premium sin perder calidez.
- **Sin redes sociales en la UI**: el cliente todavía no las tiene activas. Se añadirán cuando estén.

Más detalles en [`DESIGN.md`](./DESIGN.md).

---

## Cliente y briefing

Ver [`BRIEFING.md`](./BRIEFING.md) para toda la información recopilada del cliente (rutas, precios, horarios, preferencias visuales).

---

## Autor

**Ruipérez Studio** — [ruiperezstudio.es](https://ruiperezstudio.es)
Cartagena, Murcia · España

---

## Licencia

Proyecto privado. Todos los derechos reservados.
