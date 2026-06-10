# Pi Post Builder

Generate scroll-stopping, emoji-packed referral posts for Pi Network in seconds. Pick a username, choose language and style, copy a ready-to-share template, and repeat across Facebook, WhatsApp, X, Instagram, TikTok, LinkedIn, Telegram, Discord, Reddit, Email, and more.

## What this tool does

- Accepts your Pi username / referral code and personalizes each template.
- Supports 5 languages: English, Hindi, Vietnamese, Indonesian, Spanish.
- Offers 3 post styles: Exicted, Professional, Short.
- Renders 3 ready-to-use templates per generation.
- Provides one-click copy with an ad-interstitial step.
- Uses real Pi Ads when opened inside Pi Browser, and a simulated ad for non-Pi users.
- Includes pro tips for maximizing referral conversions.

## Key directories

- `src/main.tsx` — React entry point.
- `src/App.tsx` — Main app state: username, language, style, generation, copy count, Pi Browser detection.
- `src/components/TemplateCard.tsx` — Expandable card for each generated template with copy button and platform badge.
- `src/components/AdModal.tsx` — Ad gate shown before copying; real Pi ad in Pi Browser, timed simulation elsewhere.
- `src/hooks/usePiSDK.ts` — Pi SDK initialization, browser detection, authentication, and ad display helpers.
- `src/templates/types.ts` — `Language`, `Style`, and `TemplateConfig` types.
- `src/templates/index.ts` — Template registry and generator.
- `src/templates/english.ts`, `src/templates/hindi.ts`, `src/templates/vietnamese.ts`, `src/templates/indonesian.ts`, `src/templates/spanish.ts` — Per-language template libraries.
- `src/index.css` — Tailwind CSS v4 setup and custom animations.
- `vite.config.ts` — Vite config with React, Tailwind, path alias, and single-file build plugin.
- `tsconfig.json` — TypeScript project settings.
- `index.html` — Mount point with Pi SDK script injection.
- `public/images/pi-hero-bg.jpg` — Hero background image.

## Tech stack

- [React 19](https://react.dev/)
- [Vite 7](https://vitejs.dev/)
- [TypeScript 5](https://www.typescriptlang.org/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Pi JavaScript SDK](https://sdk.minepi.com/pi-sdk.js)

## Setup

Clone the repo and install dependencies:

```bash
git clone https://github.com/<org>/pi-referral-post-generator.git
cd pi-referral-post-generator
npm install
```

## Development

Start the dev server:

```bash
npm run dev
```

## Build

Production build (outputs to the `dist` directory):

```bash
npm run build
```

## Preview

Preview the production build locally:

```bash
npm run preview
```

## Notes

- This tool is not affiliated with or endorsed by Pi Network. It is a free community utility.
- Real ads require the Pi Browser. Open the page in Pi Browser to enable live Pi Ad monetization.
- Single-file output uses [vite-plugin-singlefile](https://github.com/richardtallent/vite-plugin-singlefile), configured in `vite.config.ts`.
- Headless Pi SDK flows are defined in `src/hooks/usePiSDK.ts`. Authenticating users, payment flows, and permission-side channel flows are not yet wired into the UI.
