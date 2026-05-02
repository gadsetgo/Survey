# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at localhost:3000
npm run build    # Production build
npm run lint     # ESLint via next lint
npx tsc --noEmit # Type-check without emitting
```

No test suite is configured.

## Environment

Requires `.env.local` with:
```
ANTHROPIC_API_KEY=sk-ant-...
```

## Architecture

Single-page app built on Next.js 14 App Router. All UI is one route (`app/page.tsx`) that renders a 6-screen survey flow controlled by a `currentScreen` integer state (0–5). Screens animate via `components/layout/ScreenTransition.tsx`.

**Screen flow:** Landing → RoleSelection → CareerShape → SkillsRating → Processing → Results

**State** is managed by a single Zustand store (`lib/store.ts`). `SurveyState` accumulates answers across screens; `results: ApiResponse | null` is set after the API call completes. All screens read from and write to this one store — no prop drilling except `onNext`/`onBack`/`onDone` callbacks.

**API call** happens in `components/screens/Processing.tsx` via `fetch('/api/analyze')`. The Next.js route handler at `app/api/analyze/route.ts` calls Claude (`claude-sonnet-4-6`, max 2048 tokens) with the full survey state and expects a raw JSON response (no markdown). The prompt lives in `lib/prompts.ts:buildPrompt`.

**Offline fallback** (`lib/fallback.ts:buildFallbackResults`) produces a complete `ApiResponse` from the store state alone — static 2027 demand levels, deterministic gap rules, role-destination lookup table keyed on `selectedCategories[0]`. Used when the API call fails.

**Types** are centralized in `lib/types.ts`: `Skills` (16-key object, all 0–5), `SkillKey`, `ApiResponse`, `SurveyState`, `RoleDestination`, `RoadmapStep`.

## Styling

Components use **inline styles exclusively** — Tailwind is configured but the actual screens all use `style={{...}}` objects with a `mkT(dark)` pattern that returns a token object (`bg`, `fg`, `muted`, `rule`, `surface`) for light/dark switching. The Tailwind config defines the design tokens (colors, fonts, type scale) but they are not used in practice; the inline style tokens mirror them manually.

**Fonts:** Syne (headings, numbers) and DM Sans (body) loaded from Google Fonts in `app/layout.tsx`.

**Dark mode** is toggled from the Landing screen via `onToggleDark` and the `dark` boolean prop is passed down to every screen component.
