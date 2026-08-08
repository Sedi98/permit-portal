# Applications Page Implementation Phases

This plan is based on `docs/frontend-vetendas-tam-sistem-bələdçisi.md` and the existing `apps/web/features` API conventions.

## Confirmed requirements

- Load citizen applications from `GET /api/permit-applications`.
- Support URL filters from the page search params:
  - `status` for a single status
  - `status_group` for grouped views such as `in_progress` and `payment_history`
  - `search` when the application-number search field is used
- Pass the server-fetched response from `apps/web/app/applications/page.tsx` into `apps/web/app-pages/applications/index.tsx` as props.
- Render the records through `apps/web/app-pages/applications/sections/ApplicationsList.tsx`.
- Keep API functions, response types, and future client hooks in `apps/web/features/applications/` using the existing `api.ts`, `types.ts`, and `hooks.ts` pattern.
- Exclude records with `status === "draft"` from the submitted applications list, as required by the guide.
- Use the Azerbaijani status labels from the guide for every application row.

## Phase 1 — API contract

1. Add `features/applications/types.ts` with the documented list item and response types.
2. Add `features/applications/api.ts` with a typed `getApplications` function calling `/permit-applications`.
3. Add `features/applications/hooks.ts` only for future client-side consumers; the server page will call the API function directly.

## Phase 2 — Server data loading

1. Read and normalize `searchParams` in `app/applications/page.tsx`.
2. Build the API query from `status`, `status_group`, and `search`.
3. Call `getApplications(query)` on the server.
4. Pass the response, selected filters, and a safe empty state into the app-page component.
5. Preserve the existing query-string filter links.

## Phase 3 — Applications page composition

1. Update `app-pages/applications/index.tsx` to accept the API data prop.
2. Keep `FilterSection` at the top and pass the active status into it.
3. Render `ApplicationsList` below the filters.
4. Add loading/error/empty-state boundaries appropriate for server-rendered data.

## Phase 4 — Applications list

1. Replace the placeholder `ApplicationsList` with a reusable typed list.
2. Render each application number, permit-service name, status label, and submitted date.
3. Link each row to the application detail route using its `id`.
4. Render status-specific footer content only where the guide requires it:
   - `draft`: “Davam et”
   - `awaiting_revision`: deficiency content and file replacement entry point
   - `awaiting_payment`: invoice/payment entry point
   - `completed`: document/QR download entry point
   - process statuses: “Prosesdədir” without an action button

## Phase 5 — Verification

1. Run targeted ESLint for the new feature and page files.
2. Run `pnpm build:web` for type checking and route generation.
3. Verify representative URLs:
   - `/applications`
   - `/applications?status=registered`
   - `/applications?status_group=in_progress`
   - `/applications?search=İ-14/2026`

## Assumptions to confirm before implementation

- The documented response shape is the current backend contract: `{ status: "success", data: ApplicationListItem[] }`, not a paginated `{ data: { data: ... } }` response.
- The first implementation should build the list shell and status-aware action areas from the current guide; detail, file replacement, payment, and QR download interactions can be wired in their own follow-up sections when those components/API actions are requested.
- When both `status` and `status_group` are present, `status` takes precedence for the request query.
