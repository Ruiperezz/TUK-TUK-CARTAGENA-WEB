# DESIGN.md — Sistema de diseño

Documento de referencia del sistema visual de TUK TUK Cartagena. Útil para mantener coherencia al añadir secciones nuevas.

---

## Concepto

**Cartagena editorial nocturna.** La mayoría de webs turísticas son claras, ruidosas y genéricas (verde + azul + amarillo, fotos en grid, llamadas a la acción agresivas). Esta no.

Aquí queremos transmitir:
- **Premium** — el visitante siente que va a vivir una experiencia, no a pagar un servicio
- **Local** — Cartagena tiene 3000 años de historia; la web los respeta
- **Mediterráneo cálido** — sin caer en cliché turístico
- **Confianza** — diseño cuidado = empresa cuidada

Referencia principal del cliente: **Trump Tower NY** (oscuro, vídeo hero, menú lateral, tipografía con peso).

---

## Paleta

```css
/* Fondos */
--bg-primary:    #0F1419;   /* carbón profundo — fondo principal */
--bg-secondary:  #0B0E12;   /* negro más oscuro — secciones alternas */
--bg-tertiary:   #141A22;   /* hover sobre cards */

/* Acento */
--gold:          #C9A961;   /* dorado mediterráneo — único acento */
--gold-hover:    #D9B971;   /* sutilmente más claro */

/* Texto */
--text-primary:  #F8F6F1;   /* crema, no blanco puro */
--text-muted:    rgba(248,246,241,0.6);
--text-subtle:   rgba(248,246,241,0.4);

/* Bordes */
--border-soft:   rgba(248,246,241,0.1);
--border-medium: rgba(248,246,241,0.18);
```

### Reglas de uso
- **El dorado es el único acento.** No introducir verdes, azules, rojos ni naranjas. Si necesitas destacar algo, usa el dorado o juega con opacidades del crema.
- **No usar blanco puro (`#FFFFFF`).** Siempre crema. El blanco puro sobre fondo oscuro hace daño a la vista y se ve "barato".
- **No usar gradientes** salvo el fade del hero (negro abajo, transparencia arriba). Sin gradientes morados, sin gradientes diagonales.

---

## Tipografía

### Familias

```css
/* Display — titulares, números grandes, eyebrows decorativos */
font-family: 'Playfair Display', Georgia, serif;
/* Disponible en: 400, 500, 600, 700, 800, 900 + italic */

/* Body — texto general, formularios, UI */
font-family: 'Inter', -apple-system, system-ui, sans-serif;
/* Disponible en: 300, 400, 500, 600, 700 */
```

### Escala tipográfica

| Uso | Tamaño desktop | Tamaño mobile | Familia | Peso |
|---|---|---|---|---|
| Hero título | `text-9xl` (8rem) | `text-6xl` (3.75rem) | Playfair | 500 |
| H2 sección | `text-7xl` (4.5rem) | `text-5xl` (3rem) | Playfair | 500 |
| H3 card | `text-4xl` (2.25rem) | `text-3xl` (1.875rem) | Playfair | 500 |
| Precio destacado | `text-7xl` | `text-6xl` | Playfair | 500 |
| Body lead | `text-xl` (1.25rem) | `text-base` (1rem) | Inter | 300 light |
| Body normal | `text-base` (1rem) | `text-sm` (0.875rem) | Inter | 400 |
| Eyebrow (etiqueta) | `text-[11px]` + `tracking-[0.28em]` + `uppercase` | igual | Inter | 500 |
| Botones | `text-sm` + `tracking-[0.22em]` + `uppercase` | igual | Inter | 600 |

### Reglas tipográficas
- **Eyebrows en dorado**, body en crema, titulares en crema (excepto el "Cartagena" del hero que va en dorado italic).
- **No mezclar más de 2 pesos por bloque.** Light (300) + Medium (500) es la combinación más común.
- **Letterspacing en uppercase** siempre amplio (`0.18em` mínimo, `0.28em` ideal para eyebrows). Sin él, las mayúsculas se ven amontonadas.
- **Italic con moderación.** Solo para enfatizar el "Cartagena" del hero y los taglines de los tours. Más es ruido.

---

## Espaciado

Sistema base de Tailwind. Convenciones:
- **Padding horizontal de sección:** `px-6 md:px-16`
- **Padding vertical de sección:** `py-24 md:py-32` (siempre generoso, da aire)
- **Max-width:** `max-w-7xl mx-auto` (containers principales), `max-w-5xl` (booking), `max-w-3xl` (about/contact)
- **Gap entre cards:** `gap-px` con `background: rgba(248,246,241,0.1)` para crear "divisores" en lugar de bordes
- **Gap entre campos de formulario:** `gap-10` desktop, `gap-y-10` mobile

---

## Layout

### Estructura general
```
┌──────────────────────────────────────────┐
│ Header fijo (menú · logo · idiomas)     │
├──────────────────────────────────────────┤
│ Hero (100vh, mínimo 640px)               │
├──────────────────────────────────────────┤
│ Tours (cards en grid 3 columnas)         │
├──────────────────────────────────────────┤
│ Precios (2 columnas, fondo más oscuro)   │
├──────────────────────────────────────────┤
│ Booking (formulario centrado)            │
├──────────────────────────────────────────┤
│ About (fondo más oscuro, texto grande)   │
├──────────────────────────────────────────┤
│ Info práctica (grid 2x2)                 │
├──────────────────────────────────────────┤
│ Contact (formulario centrado)            │
├──────────────────────────────────────────┤
│ Footer                                   │
└──────────────────────────────────────────┘
```

### Alternancia de fondo
- `#0F1419` (primary) → Tours, Booking, Info práctica
- `#0B0E12` (secondary) → Precios, About, Contact

Esto crea ritmo visual sin necesidad de bordes o decoración.

---

## Componentes clave

### Eyebrow
```jsx
<div className="text-[11px] tracking-[0.28em] uppercase text-[#C9A961] font-medium">
  Tres formas de conocer la ciudad
</div>
```
Va siempre encima del título de sección. Da contexto sin gritar.

### Botón primario (CTA principal)
```jsx
<button className="px-8 py-4 bg-[#C9A961] text-[#0F1419] tracking-[0.22em] uppercase text-sm font-semibold">
  Reservar
</button>
```

### Botón secundario (outline dorado)
```jsx
<button className="px-8 py-4 border border-[#C9A961] text-[#C9A961] tracking-[0.22em] uppercase text-sm hover:bg-[#C9A961] hover:text-[#0F1419] transition-all">
  Reservar este tour
</button>
```

### Card de tour
- Padding `p-8 md:p-10`
- Número grande arriba izquierda (`0X`) en Playfair italic con opacidad baja
- Duración arriba derecha en dorado
- Título Playfair medium
- Tagline serif italic
- Body Inter
- Highlights como chips con borde sutil
- CTA al fondo con `ChevronRight` que se desplaza en hover

### Input de formulario
```css
.input-base {
  background: transparent;
  border: 0;
  border-bottom: 1px solid rgba(248,246,241,0.18);
  padding: 14px 0 10px 0;
  transition: border-color 280ms;
}
.input-base:focus {
  outline: none;
  border-bottom-color: #C9A961;
}
```
Sin caja, sin sombra. Solo línea base que se ilumina al enfocar. Estilo editorial.

---

## Animaciones

### Filosofía
**Discreción.** Las animaciones acompañan, no distraen. Si quitas todas las animaciones, el diseño tiene que seguir funcionando perfectamente.

### Implementadas
1. **Reveal on scroll** (componente `<Reveal>`)
   - `opacity: 0 → 1` + `translateY(28px → 0)`
   - Duración: 900ms, easing `cubic-bezier(.22,.61,.36,1)`
   - Delay configurable para escalonar elementos hermanos
2. **Menú lateral**
   - `slideInLeft` 480ms desde `translateX(-100%)`
3. **Indicador de scroll del hero**
   - Bounce sutil 1.8s loop
4. **Hover en cards**
   - `background-color` cambia de `#0F1419` a `#141A22` (500ms transition)
   - CTA del card: `gap` aumenta de 3 a 5 (sugiere movimiento hacia adelante)
5. **Hover en botones**
   - Outline → fondo sólido, color invertido (280ms)

### Reglas
- **No usar Framer Motion.** Para esto basta con CSS y `IntersectionObserver`. Añadir Framer Motion es ~40KB extra que no necesitamos.
- **Respetar `prefers-reduced-motion`** *(pendiente de implementar)*.

---

## Iconografía

- **Librería:** `lucide-react`
- **Stroke:** siempre `strokeWidth={1.5}` por defecto (sensación premium, no negrita)
- **Tamaño:** `w-4 h-4` para inline, `w-5 h-5` para botones de UI, `w-10 h-10` para confirmaciones grandes
- **Color:** hereda del padre, no fijar color salvo casos específicos (dorado para CTAs)

Iconos usados: `Menu`, `X`, `ArrowRight`, `ChevronRight`, `Check`, `AlertCircle`, `Calendar`, `Users`, `Clock`, `MapPin`, `Mail`, `Phone`, `Globe`.

---

## Imágenes (cuando lleguen)

**Pendiente con el cliente.** Recomendaciones para cuando se grabe/fotografíe:
- **Vídeo hero:** 15-30 segundos, sin sonido (autoplay muted), cinemático. Plano del tuk tuk recorriendo el casco antiguo + plano de la bahía + plano del Faro de Navidad. Color grading cálido (mediterráneo dorado, atardecer).
- **Fotos de tours:** mínimo 3-4 por tour. Una de la perspectiva del pasajero (mirando hacia el casco), una del tuk tuk en escenario icónico (Plaza España, Muralla del Mar), una de detalle (el conductor sonriendo, el guía explicando algo).
- **Foto "Quiénes Somos":** el equipo con un tuk tuk, en localización reconocible. Profesional, no selfie.
- **Formato:** todas en `.webp` + `.jpg` fallback. Lazy loading obligatorio.

---

## SEO y accesibilidad

### SEO
- **Title:** `TUK TUK Cartagena — Tours en tuk tuk por Cartagena, Murcia`
- **Description:** generar uno por idioma, ~155 caracteres, con keyword principal + propuesta de valor
- **Hreflang:** pendiente, una etiqueta por idioma
- **Schema.org:** pendiente, marcado `TouristAttraction` + `LocalBusiness`

### Accesibilidad (estado actual)
- ✅ Contraste WCAG AA cumplido en todos los textos
- ✅ Inputs con `<label>` asociados
- ✅ Botón de menú con `aria-label`
- 🟡 Falta `aria-label` en algunos botones de incremento
- ❌ Falta `prefers-reduced-motion`
- ❌ Falta skip-to-content link

---

## Qué NO hacer

Lista de cosas que romperían el diseño:
- ❌ Añadir un segundo color de acento (azul, verde, naranja)
- ❌ Bordes redondeados grandes (`rounded-lg`, `rounded-xl`, `rounded-full` en cards)
- ❌ Sombras pronunciadas (`shadow-lg`, `shadow-xl`)
- ❌ Gradientes diagonales o de colores múltiples
- ❌ Iconos rellenos (siempre stroke, nunca `fill`)
- ❌ Animaciones de "rebote" tipo `animate-bounce`
- ❌ Emojis en la UI
- ❌ Etiquetas tipo "¡Nuevo!" o "¡Oferta!"
- ❌ Textos en negrita injustificada en medio de párrafos
- ❌ Más de un CTA por sección (excepto Hero + flecha scroll)

---

## Cambios a este sistema

Si necesitas tocar paleta, tipografía o espaciado: **documenta el cambio aquí mismo** antes de hacerlo. Este archivo es la fuente de verdad. Si el diseño deriva, el cliente pierde confianza.
