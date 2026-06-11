# BuzzPay — Landing Page

A pixel-faithful recreation of the BuzzPay **Home (Hero)** and **About** sections,
built with **Next.js (App Router) + TypeScript + Tailwind CSS + Framer Motion**.

## Animations

- **Card stack (Home):** the three fanned credit cards are scroll-linked.
  As you scroll down, they spread apart, rotate, and drift with parallax.
  Driven by Framer Motion's `useScroll` → `useTransform` → `useSpring`
  (see `components/CardStack.tsx`).
- **Stats (About):** `158+`, `55.3k`, and `4.9/5.0` count up from `0` to their
  final values when the stats row scrolls into view, using Framer Motion's
  `animate()` + `useInView` (see `components/StatCounter.tsx`).

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Project structure

```
app/
  layout.tsx        # fonts (Archivo, JetBrains Mono) + metadata
  page.tsx          # composition: background, hairline, CardStack, Navbar, Hero, About
  globals.css       # Tailwind layers + resets
components/
  Navbar.tsx        # centered top navigation
  Hero.tsx          # BUZZPAY headline + UNIFY PAYMENTS / EMPOWER TEAMS + CTA
  CardStack.tsx     # scroll-animated fanned cards + floating coins
  About.tsx         # badge, BUILT FOR GLOBAL TEAMS, paragraph, stats row
  StatCounter.tsx   # count-up number with superscript suffix
tailwind.config.ts  # brand colors + twinkle/float keyframes
```

## Notes

- Type scale in the hero uses `clamp()` so the headline stays proportional
  across viewport widths while matching the desktop comp at ~1440px.
- Brand colors live in `tailwind.config.ts` (`buzz-red`, `divider-red`,
  `coin-*`, etc.).
- The credit cards, chip, contactless glyph, and coins are pure CSS/SVG —
  no image assets required.
