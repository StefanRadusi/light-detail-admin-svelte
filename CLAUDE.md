# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun run dev          # Start development server
bun run build        # Production build
bun run preview      # Preview production build
bun run check        # TypeScript/Svelte type checking
bun run lint         # Run Prettier + ESLint
bun run format       # Auto-format with Prettier
```

## Tech Stack

- **SvelteKit 2** with **Svelte 5** (uses runes: `$props()`, `$state()`, etc.)
- **TypeScript** with strict mode
- **Vite 7** for build tooling
- **Bun** as package manager (bun.lock)
- **adapter-auto** for deployment (auto-detects platform)
- **Lucide Svelte** for icons
- **clsx** for conditional class names

## Project Structure

- `src/routes/` - SvelteKit file-based routing (`+page.svelte`, `+layout.svelte`)
  - `commercial/`, `residential/`, `content/`, `stuff/`, `login/` — app sections
- `src/lib/api/` - API client and typed service modules (`client.ts`, `projects.ts`, `staff.ts`, `content.ts`, `videos.ts`, `images.ts`, `auth.ts`)
- `src/lib/components/` - Shared UI components organized by domain:
  - `buttons/`, `content/`, `form/`, `layout/`, `loading-animations/`, `navigation/`, `overlays/`, `project/`, `staff/`, `typography/`
- `src/lib/state/` - Svelte 5 reactive state modules (`.svelte.ts` files)
- `src/lib/index.ts` - Barrel exports
- `src/app.css` - Global styles using CSS custom properties (no Tailwind)
- `src/app.d.ts` - Global TypeScript declarations for App namespace

## Styling

- Plain CSS with CSS custom properties defined in `src/app.css`
- Primary color: `--color-primary: #f1b434`
- Font family: Futura / Hind / Arial

## Svelte 5 Notes

This project uses Svelte 5 runes syntax:
- Props: `let { propName } = $props()`
- State: `let count = $state(0)`
- Children: `{@render children()}`
