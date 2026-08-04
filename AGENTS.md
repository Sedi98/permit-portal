## Figma MCP Integration Rules
These rules define how to translate Figma inputs into code for this project and must be followed for every Figma-driven change.

### Required flow (do not skip)
1. Run get_design_context first to fetch the structured representation for the exact node(s).
2. If the response is too large or truncated, run get_metadata to get the high‑level node map and then re‑fetch only the required node(s) with get_design_context.
3. Run get_screenshot for a visual reference of the node variant being implemented.
4. Only after you have both get_design_context and get_screenshot, download any assets needed and start implementation.
5. Translate the output (usually React + Tailwind) into this project's conventions, styles and framework.  Reuse the project's color tokens, components, and typography wherever possible.
6. Validate against Figma for 1:1 look and behavior before marking complete.

### Implementation rules
- Treat the Figma MCP output (React + Tailwind) as a representation of design and behavior, not as final code style.
- Replace Tailwind utility classes with the project's preferred utilities/design‑system tokens when applicable.
- Reuse existing components (e.g., buttons, inputs, typography, icon wrappers) instead of duplicating functionality.
- Use the project's color system, typography scale, and spacing tokens consistently.
- Respect existing routing, state management, and data‑fetch patterns already adopted in the repo.
- Strive for 1:1 visual parity with the Figma design. When conflicts arise, prefer design‑system tokens and adjust spacing or sizes minimally to match visuals.
- Validate the final UI against the Figma screenshot for both look and behavior.


# Repository Guidelines

## Project Overview
- **What:** Admin panel (internal ministry tool) for managing permit applications. Azerbaijani (Latin) UI.
- **Stack:** React 19 + TypeScript 6 + Vite 8. Tailwind CSS v4 (CSS-based config via `@tailwindcss/vite`).
- **Package manager:** pnpm 11. No formatter configured. No test framework.
- **React Compiler** is enabled via `babel-plugin-react-compiler` + `@rolldown/plugin-babel`.
- **Backend:** `https://permit-back.secop.az/api` (OpenAPI spec at `admin-api-senedlesme.yaml`).
  Env var `VITE_API_BASE_URL=https://permit-back.secop.az` in `.env`.

## Commands
- `pnpm dev` — start Vite dev server with HMR
- `pnpm build` — runs `tsc -b` (project references build) then `vite build`
- `pnpm lint` — ESLint across the whole repo
- `pnpm preview` — serve production build locally

## Project Structure
```
src/
  app/              — router, layouts (DashLayout, PageLayout, TableLayout), sidebar navigation
  components/       — shared components (Sidebar, Header, StatusBadge, DataTable, charts, etc.)
  components/ui/    — shadcn/ui primitives (radix-vega style, lucide icons)
  features/         — feature modules (auth: scaffold only, api.ts/hooks.ts/types.ts)
  pages/(dashboard)/ — page components grouped by route segment
  lib/              — utils (cn helper with clsx + tailwind-merge)
  index.css         — Tailwind imports, shadcn theme variables, font (DM Sans)
  main.tsx          — entrypoint, mounts <BrowserRouter> with <App>
  App.tsx           — renders <AppRouter />
```

## Key Conventions
- **Routing:** react-router v8 (Remix-flavored). Routes defined in `src/app/router.tsx`.
  Dashboard routes are inside `<DashLayout>` (sidebar + header). Auth routes are scaffolded but commented out.
- **TypeScript constraints:** `verbatimModuleSyntax` (use `import type` for type-only imports),
  `erasableSyntaxOnly` (no enums, no namespaces, no parameter properties).
- **Path alias:** `@/*` maps to `src/*`.
- **shadcn/ui** style is `radix-vega`. Components added via `pnpm shadcn add`.
  Config in `components.json`.
- **Component naming:** PascalCase components, useCamelCase hooks. Filenames lowercase kebab-case.
- **UI text:** All labels in Azerbaijani (Latin). Sidebar items, breadcrumbs, table headers, etc.
- **Linting:** ESLint with `typescript-eslint/recommended`, `react-hooks`, `react-refresh/vite`. Fix warnings before committing.

## Key Dependencies
- `@tanstack/react-table` — data tables with `DataTable` wrapper
- `recharts` — charts
- `radix-ui` — headless UI primitives
- `react-day-picker` v10 — date/range picker
- `date-fns` — date formatting
- `lucide-react` — icons
- `cmdk` — command menu
- `tw-animate-css` — Tailwind CSS animations

## Verification
- Always run `pnpm lint` and `pnpm build` before committing.
- `pnpm build` does a full type check (`tsc -b`) — this catches TS errors that lint alone misses.
