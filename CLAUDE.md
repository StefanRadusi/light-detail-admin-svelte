# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run preview      # Preview production build
npm run check        # TypeScript/Svelte type checking
npm run lint         # Run Prettier + ESLint
npm run format       # Auto-format with Prettier
```

## Tech Stack

- **SvelteKit 2** with **Svelte 5** (uses runes: `$props()`, `$state()`, etc.)
- **TypeScript** with strict mode
- **Vite 7** for build tooling
- **adapter-auto** for deployment (auto-detects platform)

## Project Structure

- `src/routes/` - SvelteKit file-based routing (`+page.svelte`, `+layout.svelte`, `+server.ts`)
- `src/lib/` - Shared components and utilities (import via `$lib` alias)
- `src/app.d.ts` - Global TypeScript declarations for App namespace

## Svelte 5 Notes

This project uses Svelte 5 runes syntax:
- Props: `let { propName } = $props()`
- State: `let count = $state(0)`
- Children: `{@render children()}`
