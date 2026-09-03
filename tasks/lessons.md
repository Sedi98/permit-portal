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
- When editing an entity with an async multi-select catalog, merge the entity's attached options into the catalog so existing selections remain visible even when the list endpoint omits inactive or legacy options.
- When a user provides a real API payload, model its exact field casing and nested metadata at the response boundary; do not reuse the casing documented for a related endpoint.
- When an existing-application detail response includes uploaded files, hydrate them by `document_type_id` into the required-document UI, preserve review metadata, and use the documented file-specific replacement endpoint for rejected files rather than posting a second document.
- When changing a navigational notification row from a link to a button, explicitly preserve `w-full` so the interactive hit area does not shrink to its content width.
- When a list endpoint is the declared notification detail source, render only its typed fields and do not add a related-resource request to fill visual placeholders.
- When replacing a conventional file control with an icon picker, start from a compact 4rem click target and scale the preview icon proportionally; enlarge only when the design explicitly requires it.
- When a page combines shared textarea labels with shadcn labels, explicitly align both to the established dashboard label token instead of relying on their differing component defaults.
