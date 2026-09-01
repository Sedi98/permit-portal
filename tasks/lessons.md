# Lessons

- When adding shadcn components in this monorepo, run the CLI from `apps/web` unless the user explicitly targets another app.
- When an Axios instance defaults to `Content-Type: application/json`, explicitly override FormData requests to `multipart/form-data`; otherwise Axios can serialize the FormData to JSON before adapter-level boundary handling.
- When applying a Figma form-control design, audit every related shared shadcn primitive—including textarea resize behavior—and reuse the existing field composition for labels and counters instead of styling only the page-level instance.
- When backend validation exposes an undocumented required form field, add it end-to-end: response and form types, create defaults, edit hydration, client validation, UI control, and both create/update payload serialization.
- When a fallback icon uses a visual container, place loaded icon images inside the same container so both branches keep identical dimensions, background, radius, and alignment.
- When applying a repeated visual treatment, inspect equivalent list and detail views so the pattern is consistent everywhere, including requested inner padding.
- For enum-backed table values, render user-facing labels through the same typed mapping used by related filters instead of exposing raw API keys.
- When a statistics API documents more counters than the current dashboard design exposes, wire only the explicitly requested cards and keep the remaining fields typed for later UI work.
- When a rating form collects a comment, verify the submit handler forwards it and matches the backend request field names instead of dropping it during destructuring.
