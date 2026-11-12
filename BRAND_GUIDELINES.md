# THE TOYZ DEPT. — Brand Identity & Design System

## 1. Visual Direction & Aesthetics
THE TOYZ DEPT. combines **sophisticated neo-brutalism**, **modern editorial design**, and **creative industrial aesthetics**.

### Core Philosophy
- **Intentional Whitespace & Confident Grids**: Layouts are structural, structured with solid borders and offset shadow blocks.
- **Neo-Brutalism Without Cheapness**: Avoid neon glow, cheap plastic 3D spheres, generic AI gradients, or decorative clutter. We use sharp, architectural borders, purposeful physical cards, and bold tactile interactions.

---

## 2. Color Palette & Design Tokens

| Token Name | Hex Code | Role & Usage |
| :--- | :--- | :--- |
| **Ink Black** | `#191919` | Primary borders (`2px solid #191919`), high-contrast headings, hard drop shadows, dark mode callouts. |
| **Ink Light** | `#252525` | Section breaks, header ticker strips, technical dark badges. |
| **Warm Cream** | `#F5F1E8` | Primary page canvas background. Soft, tactile, paper-like warmth that softens harsh contrast. |
| **Cream Light** | `#FAF7F2` | Card surface backgrounds, table rows, input fields. |
| **Cream Dark** | `#E8E2D5` | Card borders, subtle divider rules, neutral empty states. |
| **Acid Lime** | `#D9FF43` | Signature brand highlight, primary action buttons, free shipping markers, new drop badges. |
| **Coral Accent** | `#FF694B` | Alert accents, punctuation periods (`.`), sale savings badges, attention-grabbing triggers. |

---

## 3. Typography Hierarchy

### Display Typeface: **Space Grotesk**
- **Characteristics**: Geometric, proportional grotesque with high-character mechanical joints.
- **Usage**: Brand wordmark (`THE TOYZ DEPT.`), main section headlines (H1, H2, H3), product titles, button text.
- **Letter Spacing**: `-0.02em` tracking-tight. Always styled uppercase for brand assertions.

### Body Typeface: **Inter**
- **Characteristics**: Crisp, modern, legible, optimized for screen reading across iOS and Android viewports.
- **Usage**: Product descriptions, specifications, order details, checkout forms, customer reviews.

### Technical Typeface: **JetBrains Mono**
- **Characteristics**: High-legibility monospaced font with distinct coding glyphs.
- **Usage**: Order numbers (`TTD-2026-8912`), SKU references, layer height measurements (`0.12mm`), pricing subtotals, table headers, system telemetry.

---

## 4. UI Components & Component Tokens

### Neo-Brutalist Buttons
- **Primary**: `bg-lime text-ink border-2 border-ink shadow-brutal hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]`
- **Secondary**: `bg-cream-light text-ink border-2 border-ink shadow-brutal hover:bg-cream-dark`
- **Dark / Inverted**: `bg-ink text-cream border-2 border-ink shadow-brutal hover:bg-ink-light`
- **Accent / Coral**: `bg-coral text-cream border-2 border-ink shadow-brutal hover:bg-coral-dark`

### Hard Shadow Scale
- `shadow-brutal-sm`: `2px 2px 0px 0px #191919`
- `shadow-brutal`: `3px 3px 0px 0px #191919`
- `shadow-brutal-lg`: `5px 5px 0px 0px #191919`
- `shadow-brutal-xl`: `7px 7px 0px 0px #191919`

### Wordmark & Logo Guidelines
- **Header Treatment**: `THE TOYZ DEPT.` with bold period in Coral (`.`).
- **Icon Mark**: Square box with `#191919` background, `#D9FF43` acid lime inner border, and coral center sphere with `TTD` monogram.
- **Tagline**: *"THINGS YOU DIDN'T KNOW YOU NEEDED."*
