# Task: Print operator dashboard statistics

- [x] Connect the dashboard download action to the browser print dialog.
- [x] Exclude dashboard navigation and interactive controls from print output.
- [x] Keep charts and statistic cards readable across printed/PDF pages.
- [x] Run operator lint and build verification and review the final diff.

## Review

- The primary dashboard download action now opens the browser print dialog once
  statistics are available. Print output omits the sidebar, header, page controls,
  date filters, navigation buttons, and download controls while retaining headings,
  legends, selected year range, charts, and statistic cards. A4 landscape print
  styling preserves chart colors and avoids splitting cards where possible.
- Focused ESLint, the operator TypeScript/Vite production build, and `git diff
  --check` pass. Full operator lint remains blocked by the existing 61 Tiptap and
  shared-hook React Compiler errors plus the existing TanStack Table warning.

# Task: Show apply-step validation on fields instead of disabling actions

- [x] Audit every apply step that disables a forward/submit action because required data is missing.
- [x] Keep actions clickable for validation while retaining disabled states for loading and unavailable backend state.
- [x] Mark missing shadcn fields with `data-invalid`/`aria-invalid` and show concise field errors after an attempted action.
- [x] Mark missing required document cards and the PS-003 capacity field with the same destructive validation treatment.
- [x] Validate legal-entity selection/address, operation fields, contact fields, documents/capacity, and rating selection consistently.
- [x] Run focused ESLint, web TypeScript, production build attempt, and diff verification.

## Review

Required-value validation is now revealed on action instead of being hidden behind
disabled forward buttons. Contact email/phone, legal-entity selection/address,
trade goods fields, required-document cards, PS-003 installed capacity, and rating
selection use the shared shadcn `Field`, `FieldError`, `data-invalid`, and
`aria-invalid` states. Invalid document cards use the same destructive border/ring
treatment at the requested section level. Validation clears naturally as each value
is supplied; buttons remain disabled only for in-flight requests or genuinely
unavailable navigation/application state.

Focused ESLint, web TypeScript, and the web production build pass, and
`git diff --check` reports only the repository's line-ending conversion warnings.
Full web lint remains blocked by the pre-existing raw applications anchor in
`Navbar.tsx` plus the existing unused `idSeries` warning.

# Task: Implement PS-001 / PS-002 / PS-003 application fields

## Scope and confirmed behavior

- [x] Keep service-specific branching based on `permit_service.code` (`PS-001`,
  `PS-002`, `PS-003`) rather than database IDs.
- [x] PS-001 web flow: show operation type, category, goods name, quantity, and
  unit; send the operation enum and the category's Azerbaijani label.
- [x] PS-002 web flow: show operation type, goods name, quantity, and unit; do
  not render or submit a category.
- [x] PS-003 web flow: remove the operation step and require top-level
  `installed_capacity` directly below the document uploads.
- [x] Replace the obsolete `goods_name_volume` contract with `goods_name`,
  `goods_quantity`, and `goods_unit` across both applications.
- [x] In the operator detail, expose PS-001/PS-002 trade values plus the
  operator-only `permit_duration` date and `contract_number`; show/edit PS-003
  `installed_capacity` inside the required-documents section.
- [x] Gate both `confirm-payment-received` entry points for PS-001/PS-002 until
  `permit_duration` and `contract_number` are present, while still surfacing the
  backend's 422 message.
- [x] Do not add any frontend Customs request, button, state, or error handling;
  the Customs integration runs in the backend when the permit is signed.

## Web panel plan

- [x] Update `apps/web/features/apply/api.ts` response/payload types for the new
  trade fields, `operation_type_label`, and top-level `installed_capacity`, and
  add a typed application update for installed capacity.
- [x] Refactor `apps/web/app-pages/apply/steps/operations-step.tsx` into a
  PS-001/PS-002-aware form with the correct always-visible fields and client
  validation.
- [x] Update `apps/web/app-pages/apply/index.tsx` hydration, draft-resume
  completeness checks, transitions, payloads, back navigation, and submit error
  handling for all three service codes.
- [x] Extend `apps/web/app-pages/apply/steps/documents-step.tsx` with the PS-003
  required installed-capacity control and persist it independently from uploads.
- [x] Update `apps/web/app-pages/apply/steps/checkout-step.tsx` to review the new
  fields, use `operation_type_label` for display when supplied by the backend,
  and show installed capacity for PS-003.
- [x] Supply service-specific step labels/counts to the existing customizable
  `ProgressStepper` and make child step counters dynamic so PS-003 has no
  phantom operation step.

## Operator panel plan

- [x] Update `apps/operator/src/features/applications/types.ts` for the current
  response/update contract, including top-level `installed_capacity`.
- [x] Rework
  `apps/operator/src/features/applications/components/TradeDetailSection.tsx`
  to be service-aware, display the backend operation label, use suitable text
  controls and the existing date picker, and support the documented edit status
  rules.
- [x] Update `apps/operator/src/features/applications/hooks.ts` so successful
  edits correctly refresh/merge both trade-detail fields and top-level installed
  capacity.
- [x] Update
  `apps/operator/src/pages/(dashboard)/applications/manage/index.tsx` to render
  PS-001, PS-002, and PS-003 data in their required sections, allow editing in
  `payment_review` and the documented payment-free `assigned` case, and guard
  both signature-transition controls.
- [x] If needed, add a narrowly scoped optional slot/prop to
  `apps/operator/src/components/RequiredDocumentsSection.tsx` so PS-003 capacity
  remains structurally inside that section without duplicating the component.

## Verification plan

- [x] Exercise new and resumed/draft web flows for PS-001, PS-002, and PS-003,
  checking exact request bodies and conditional fields.
- [x] Exercise operator read/edit behavior in allowed and disallowed statuses,
  including empty mandatory fields, backend 422 messages, and cache refresh.
- [x] Compare the relevant views and behavior against both `docs/latest-2`
  guides, including step counts and field placement.
- [x] Run focused lint while iterating, then `pnpm lint` and `pnpm build`; record
  any confirmed pre-existing failures separately from regressions.
- [x] Run `git diff --check` and review the final diff for unrelated changes.

## Review

PS-001 and PS-002 now share the documented code-based trade flow without relying
on database IDs: the citizen form sends the exact operation enum, separate goods
name/quantity/unit fields, and a label-valued category only for PS-001. PS-003 skips
the operation step, uses a five-step progress sequence, and persists its mandatory
top-level installed capacity independently from document uploads. Draft and revision
hydration, review screens, back navigation, and validation messages use the new
contracts.

The operator detail now renders both trade services, uses the backend operation
label, edits the five documented operator fields with a date picker for permit
duration, and shows the editable PS-003 capacity inside the required-documents
section. Both transitions through `confirm-payment-received` are gated until the
PS-001/PS-002 Customs fields are complete, and backend error messages remain visible.
Sparse update responses merge safely into the detail cache, and an open PDF preview
refreshes after trade edits. No frontend Customs call was added.

Focused ESLint passes for every changed operator file and has no web error (only the
pre-existing unused `idSeries` warning). Web TypeScript and both production builds
pass. Full operator lint remains blocked by 61 pre-existing Tiptap/shared-hook errors
and one TanStack warning; full web lint remains blocked by the existing raw
applications anchor. `git diff --check` passes with only line-ending conversion
warnings.

# Task: Load Docker build variables from each workspace env

- [x] Audit Compose, both Dockerfiles, ignore rules, and application env usage.
- [x] Wire each image build to its own workspace `.env` without root-level substitution.
- [x] Verify the rendered Compose model, lint, production builds, and changed-file diffs.
- [x] Document the result and any verification constraints.

## Review

Compose now assigns `apps/web/.env` and `apps/operator/.env` to their respective
services instead of interpolating unrelated shell/root values. The Docker context
selectively includes those two workspace files so Next and Vite load them natively
during their build stages; the multi-stage runtime images copy only production
artifacts, not the source env files. `docker compose config --quiet`, both Docker
image builds, the operator production build, and `git diff --check` pass. Full lint
continues to report the 61 existing Tiptap/React Compiler errors and one TanStack
warning. The host web build remains blocked by restricted Google Fonts access, while
the Docker web build completed successfully and explicitly detected `.env`.

# Task: Add skeletons and lazy loading to all remaining operator pages

- [x] Inventory every remaining static route page and group matching layouts.
- [x] Add a dedicated named skeleton component for every remaining page.
- [x] Convert every remaining route module to `React.lazy` with its matching skeleton fallback.
- [x] Verify focused lint, production build chunks, and changed-file diffs.

## Review

All 20 remaining route-page modules now load through `React.lazy`, with a named,
page-specific skeleton passed to their local Suspense boundary. The skeletons share
small layout primitives for table, card-list, form, analytics, dashboard, and login
shapes while preserving distinct exports and route mappings for every page. Focused
ESLint, TypeScript/Vite build, and `git diff --check` pass; the build output confirms
separate chunks for login, home, board, notifications, queues, confirmations,
reports, users, permit services, ratings, FAQs, contact settings, and manage pages.

# Task: Add ApplicationDetailPage skeleton and lazy routes

- [x] Create a reusable detail-page skeleton under `components/skeletons`.
- [x] Replace the detail page API spinner with the skeleton.
- [x] Lazy-load ApplicationDetailPage on every route with the skeleton fallback.
- [x] Run focused lint, build, and diff verification.

## Review

The detail loading state now mirrors the back/title row, six-step progress indicator,
A4 application preview, executor and note tables, and required-document cards with
the shared shadcn Skeleton primitive. Both the initial application/profile queries
and all 12 detail-route lazy imports use the same reusable fallback. Focused ESLint,
the TypeScript/Vite production build, and `git diff --check` pass. The build emits
the detail page as a separate `manage` chunk; full lint retains the previously
documented unrelated Tiptap/React Compiler failures.

# Task: Add ApplicationListPage skeleton and lazy routes

- [x] Create a shadcn Skeleton primitive and a layout-matched ApplicationListPage skeleton.
- [x] Use the skeleton for application-list API loading states.
- [x] Lazy-load every route that renders ApplicationListPage with the skeleton as its Suspense fallback.
- [x] Run operator lint, build, and diff verification.

## Review

Application list loading now preserves the page title, heading area, date filter,
search/select controls, eight-column table, alternating rows, and pagination layout
with shadcn Skeleton elements. The same fallback is shown while every route backed by
ApplicationListPage downloads its lazy chunk, and it replaces the former API spinner.
Focused ESLint, TypeScript/Vite production build, and `git diff --check` pass. The
build output confirms separate chunks for all eight wrapper pages and the shared
ApplicationListPage module. Full operator lint remains blocked by 61 pre-existing
Tiptap/React Compiler errors outside the changed files.

# Task: Organize the application-list skeleton

- [x] Move the page skeleton into `components/skeletons`.
- [x] Update all imports and capture the directory convention.
- [x] Run focused lint, build, and diff verification.

## Review

The page-level skeleton now lives in the dedicated `components/skeletons`
directory, while the reusable shadcn primitive remains under `components/ui`.
Both consumers use the new import path. Focused ESLint and the operator production
build pass, and lazy route chunks remain intact.

# Task: Block incompatible permit applicant types

- [x] Detect the authenticated user's legal and physical applicant capabilities.
- [x] Show a Sonner error instead of navigating when a single-type permit is incompatible.
- [x] Mount the Sonner toaster and verify TypeScript, lint, build, and changed-file diffs.

## Review

Single-type permits now validate the authenticated user's representative flags before
navigating. Missing legal or physical capability leaves the user on the detail page
and shows an Azerbaijani Sonner error; compatible users continue through the existing
typed route, while `both` retains the prior direct/dialog behavior. Sonner is mounted
once in the web root layout. TypeScript, focused ESLint, and changed-file diff checks
pass. Full lint reports only the pre-existing unused `idSeries` warning and raw
applications anchor error; production build remains blocked by restricted Google
Fonts DM Sans access.

# Task: Respect permit applicant-type restrictions

- [x] Pass the permit service's allowed applicant type into the application summary.
- [x] Route single-type permits directly while preserving the existing auth-based `both` flow.
- [x] Run focused lint, full lint, build, and diff verification.

## Review

The permission detail response now models the three supported applicant-type values
and passes the restriction into the summary action. Legal-only and physical-only
services route authenticated users directly to the matching application flow, while
`both` preserves the existing VÖEN-based direct routing and mixed-authority dialog.
TypeScript and changed-file diff checks pass. ESLint is blocked by the existing
missing `eslint-plugin-import` installation, and the production build is blocked by
restricted access to the Google Fonts DM Sans endpoint.

# Task: Show legal applicant in confirmation

- [x] Derive the confirmation applicant label from the effective applicant type.
- [x] Keep the existing physical-person confirmation behavior unchanged.
- [x] Run focused TypeScript and diff verification; attempt full lint and build.

## Review

The confirmation's existing generic `applicantName` prop now receives the legal
entity name for legal applications and the existing surname/first-name value for
physical applications. Focused TypeScript and changed-file diff checks pass. Full
lint cannot start because `eslint-plugin-import` is missing from the current install,
and the production build is blocked by restricted Google Fonts DM Sans access.

# Task: Show legal-entity data in application checkout

- [x] Pass applicant type and legal-entity values to the checkout step.
- [x] Render legal-company and director fields instead of physical identity fields for legal applications.
- [x] Run focused TypeScript and diff verification; attempt full lint and build.

## Review

The checkout step now receives the effective applicant type and legal-entity state.
Legal applications render VÖEN, company name, legal address, and the director's first,
last, and father names in place of the physical identity section; physical checkout
behavior remains unchanged. Focused TypeScript and changed-file diff checks pass.
Full lint cannot start because `eslint-plugin-import` is missing from the current
install, and the production build is blocked by restricted Google Fonts DM Sans
access.

# Task: Add safe diagnostics to MyGov authentication

- [x] Trace the MyGov redirect, callback, token persistence, and auth-state hydration flow.
- [x] Add structured browser-console diagnostics without logging tokens or personal data.
- [x] Preserve the current user-facing login behavior and expose actionable request errors.
- [x] Run focused lint, TypeScript, and diff verification; attempt full web lint and build.

## Review

The browser console now traces each MyGov auth phase under the `[MyGov Auth]`
prefix: redirect URL request/result, callback token/error shape, cookie persistence,
auth-change event handling, and `/api/me` hydration. Axios failures include their
message, code, HTTP status, and backend response while tokens and user details remain
excluded. The touched files pass focused ESLint, TypeScript, and `git diff --check`.
Full lint is blocked only by the pre-existing raw applications anchor in `Navbar.tsx`;
the production build is blocked by unavailable Google Fonts network access.

# Task: Download application PDF with authenticated Axios request

- [x] Add an authenticated blob download request for generated application documents.
- [x] Download the returned blob from the applications list without changing page location.
- [x] Correct the inaccurate `window.location.href` guidance in the PDF-chain documentation.
- [x] Run focused lint, TypeScript, and diff verification; attempt full web lint and build.

## Review

The applications-list download action now requests the generated PDF through the
shared authenticated Axios client with `responseType: "blob"`, creates a temporary
object URL and anchor, downloads `icaze.pdf`, and cleans both up without navigating
away. The PDF-chain guide documents the same authenticated blob flow. Focused ESLint,
TypeScript, and `git diff --check` pass. Full lint still reports the two pre-existing
login-effect and Navbar-link errors; the production build reaches Next.js compilation
but cannot fetch DM Sans from Google Fonts in the restricted network environment.

# Task: Show routing-history creation date

- [x] Pass the selected registered history entry's `created_at` value to the executors container.
- [x] Display the formatted date alongside the changer name and note.
- [x] Run focused lint and diff verification.

## Review

The history entry's creation timestamp is formatted as `dd.MM.yyyy` in the detail
page, passed as `createdAt`, and rendered between the changer name and note in the
existing information grid. Focused ESLint and diff verification pass.

# Task: Select routing metadata by registered old status

- [x] Preserve the user's `ApplicationExecutorsContainer` styling unchanged.
- [x] Select the note and changer name from the history entry whose `old_status` is `registered`.
- [x] Run focused operator lint and diff verification.

## Review

The detail page now selects the latest history entry whose `old_status` is
`registered`, then passes that entry's note and changer name to the existing
executors container without modifying its styling. Focused operator ESLint and
targeted diff verification pass.

# Task: Show routing-note author with executors

- [x] Select the routing note and its author from the same status-history entry.
- [x] Pass the author name to `ApplicationExecutorsContainer` and render author/note in a grid.
- [x] Run operator lint, build, and diff verification.

## Review

The application detail page now retains the latest assigned status-history entry and
derives both its note and changer name from that same record. The executors container
renders the changer as “Yönləndirən” and the note as labeled rows in a two-column grid.
Operator lint and build pass; lint reports only the existing TanStack Table React
Compiler warning.

# Task: Fetch application details after initial creation

- [x] Call `GET /permit-applications/{id}` after the initial application POST.
- [x] Log both the creation POST and detail GET responses, then hydrate the apply flow from the GET response.
- [x] Run focused lint, web TypeScript/build, and diff verification.

## Review

After the initial application POST, both the POST response and the subsequent GET
response are logged separately with their endpoints. The apply flow requests the
newly created application by its returned ID and uses the full GET response to hydrate
document types and the remaining workflow state. Focused ESLint, TypeScript, the web production build, and targeted
`git diff --check` pass. Full web lint still reports the two pre-existing errors in
the login effect and the Navbar's raw applications link.

# Task: Show application routing note with executors

- [x] Read the routing note from the application detail GET response.
- [x] Render the latest routing note at the bottom of `ApplicationExecutorsContainer`.
- [x] Run focused lint, operator TypeScript/build, and diff verification.

## Review

The application detail page selects the latest non-empty note from a status-history
entry whose destination is `assigned`, so unrelated workflow notes are excluded. The
executors container renders that note beneath the assignee rows only when it exists.
Focused ESLint, the operator production build, and targeted `git diff --check` pass.

# Task: Fix collapsed system-message animation height

- [x] Remove persistent padding from the collapsible animation row.
- [x] Keep the message fully hidden at the collapsed height.
- [x] Run focused lint, TypeScript, and diff verification.

## Review

Padding now lives inside the hidden message content rather than on the animated grid item, allowing the closed state to collapse fully without a visible half-height gap. Focused ESLint, TypeScript, and `git diff --check` pass.

# Task: Use full-quality WebP Hero artwork

- [x] Switch the Hero image source to the WebP asset.
- [x] Preserve full image quality through `next/image`.
- [x] Run focused lint, TypeScript, and diff verification.

## Review

The Hero now uses `/images/hero/permit-hero.webp` with `next/image` and `quality={100}`. Focused ESLint, TypeScript, and `git diff --check` pass.

# Task: Optimize Hero background with Next Image

- [x] Replace the WebP CSS background with the Hero PNG asset.
- [x] Render the artwork through optimized `next/image` fill behavior.
- [x] Run focused lint, TypeScript, and diff verification.

## Review

The Hero now uses `/images/hero/permit-hero.png` through `next/image` with `fill`, `priority`, responsive `sizes`, and a content layer above the artwork. Focused ESLint, TypeScript, and `git diff --check` pass.

# Task: Add hero background artwork

- [x] Apply the existing permit hero image as the home hero background.
- [x] Preserve responsive hero content and verify the result.
- [x] Run focused lint, TypeScript, and diff verification.

## Review

The existing `/images/hero/permit-hero.webp` artwork is applied to the Hero section as a centered, cover-sized, non-repeating background. Focused ESLint, TypeScript, and `git diff --check` pass.

# Task: Animate application system-message expansion

- [x] Animate the system message when toggled from the eye button.
- [x] Remove the EyeOff icon from inside the expanded message.
- [x] Run focused lint, TypeScript, and diff verification.

## Review

System messages now expand and collapse with a 200ms height transition. The inner `EyeOff` decoration was removed; only the eye toggle carries the icon state. Focused ESLint, TypeScript, and `git diff --check` pass.

# Task: Remove unnecessary application-detail navigation for settled statuses

- [x] Disable application-detail actions for the seven supplied statuses.
- [x] Ensure only draft and explicit action/section/view queries trigger existing-application hydration.
- [x] Run focused lint, TypeScript, and diff verification.

## Review

Registered, assigned, deficiency confirmation, report confirmation, payment confirmation, payment review, and awaiting signature rows no longer navigate to `/applications/:id`; only their eye toggle remains. The route now treats only `status=draft` and explicit action/section/view queries as existing-application flows. Focused ESLint, TypeScript, and `git diff --check` pass.

# Task: Toggle application system messages with an eye button

- [x] Render a non-navigating eye toggle in every application row.
- [x] Keep status-specific application navigation as a separate action.
- [x] Run focused lint, TypeScript, and diff verification.

## Review

Each application row now has a local eye toggle for its system message. Navigation remains a separate `Bax`, `Davam et`, `Ödə`, or `Yüklə` action according to status. Focused ESLint, TypeScript, and `git diff --check` pass.

# Task: Exclude draft applications from results

- [x] Ignore the legacy draft status URL filter.
- [x] Remove draft records from the rendered application results.
- [x] Run focused lint, TypeScript, and diff verification.

## Review

Draft results are removed after the application list is loaded. The legacy `?status=draft` URL is treated as no status filter, so it cannot expose draft records. Focused ESLint, TypeScript, and `git diff --check` pass.

# Task: Hide the draft application filter

- [x] Exclude the draft status from the applications filter buttons.
- [x] Run focused lint, TypeScript, and diff verification.

## Review

The `/applications?status=draft` filter button is hidden; all other application status filters remain available. Focused ESLint, TypeScript, and `git diff --check` pass.

# Task: Handle nullable application numbers in search

- [x] Model nullable application numbers from the applications API.
- [x] Keep search filtering safe for records without an application number.
- [x] Run focused lint, TypeScript, and diff verification.

## Review

The applications response type now matches nullable `application_no` values, and the local search safely treats missing numbers as an empty string. Focused ESLint, TypeScript, and `git diff --check` pass.

# Task: Fix citizen applications search

- [x] Make the applications search control submit its query.
- [x] Filter returned applications by application number when a search query is present.
- [x] Run focused lint, TypeScript, and diff verification.

## Review

The search icon is now an accessible submit button. Search queries are sent to the API and application numbers are also filtered locally as a reliable fallback, using Azerbaijani-aware case normalization. Focused ESLint, TypeScript, and `git diff --check` pass.

# Task: Render permit-service bullet content as lists

- [x] Split bullet-prefixed permit-service detail text into individual list items.
- [x] Preserve unmarked content as a single item.
- [x] Run focused lint, TypeScript, and diff verification.

## Review

Lines prefixed with `•` now become separate semantic list items in all permit detail sections. Unmarked text remains a single entry, and nullable API values render safely without content. Focused ESLint, TypeScript, and `git diff --check` pass.

# Task: Remove notification dialog application identifier

- [x] Remove the application identifier row from the notification dialog.
- [x] Run focused lint, TypeScript, and diff verification.

## Review

The raw application identifier row was removed. The dialog now shows meaningful
application details returned by the related-resource request instead. Focused ESLint,
TypeScript, and `git diff --check` pass.

# Task: Localize application status in notification dialog

- [x] Map application status API keys to the supplied Azerbaijani labels.
- [x] Run focused lint, TypeScript, and diff verification.

## Review

All ten supplied backend status keys now render their Azerbaijani display labels in the dialog; unexpected future keys retain their raw value. Focused ESLint, TypeScript, and `git diff --check` pass.

# Task: Add notification application loading spinner

- [x] Show a spinner while notification application details are loading.
- [x] Run focused lint, TypeScript, and diff verification.

## Review

A centered Lucide spinner now appears while the dialog waits for application details, with screen-reader loading text. Focused ESLint, TypeScript, and `git diff --check` pass.

# Task: Restore application data in notification dialog

- [x] Fetch the related application with GET `/permit-applications/:id` when its notification dialog opens.
- [x] Render returned application details with loading and error states.
- [x] Run focused lint, TypeScript, and diff verification.

## Review

The dialog now uses a TanStack Query keyed by the related application ID to retrieve application details only while it is open. It shows the application number, permit type, applicant, legal entity, and status when returned, with explicit loading and request-error states. Focused ESLint, TypeScript, and `git diff --check` pass.

# Task: Add Figma contact section to notification dialog

- [x] Add the supplied Ministry contact card below notification details.
- [x] Verify focused lint, TypeScript, and diff checks.

## Review

The notification dialog now includes the Figma contact card below its detail content. Focused ESLint, TypeScript, and `git diff --check` pass.

# Task: Implement Figma notification detail dialog

- [x] Match the supplied Figma dialog information hierarchy and spacing.
- [x] Render only the selected notification's list-response fields; no application-detail request.
- [x] Restore notification-row full-width interaction.
- [x] Run focused lint and type verification.
- [ ] Run build verification (blocked by unavailable Google Fonts).

## Review

The dialog follows the supplied Figma information hierarchy using only the `useNotifications` list response. The row is a full-width button again. Focused ESLint, TypeScript, and `git diff --check` pass; the production build is blocked only because this environment cannot fetch DM Sans from Google Fonts.

# Task: Replace notification mail assets with Lucide icons

- [x] Replace mail-open and mail-close SVG image usage with Lucide icons.
- [x] Delete the unreferenced public SVG assets and run focused verification.

## Review

Focused ESLint passes, and source search confirms no mail-open or mail-close SVG reference remains.

# Task: Show notification details in a dialog

- [x] Reuse the list response as the notification detail data source.
- [x] Open the existing notification dialog on row click instead of navigating away.
- [x] Render notification body, timestamp, and related application identifier.
- [x] Run focused lint and TypeScript verification.

## Review

Focused ESLint and TypeScript checks pass. No extra API request is made because the notification list response already supplies the notification detail fields used by the dialog.

# Task: Replace rejected application files in the document step

- [x] Model the application-detail file metadata returned by the API.
- [x] Match each existing file to its required document by `document_type_id`.
- [x] Show the stored file, review status, review note, and file link in the document flow.
- [x] Restrict replacement controls to rejected files and prevent progressing while any remain rejected.
- [x] Replace a rejected file through the documented multipart method-override endpoint.
- [x] Run focused lint and TypeScript verification.
- [ ] Run web build verification (blocked by unavailable Google Fonts).

## Review

Focused ESLint and TypeScript checks pass. `git diff --check` is blocked only by a pre-existing trailing whitespace change in `app-pages/notifications/index.tsx`. The production build remains blocked by the environment being unable to fetch DM Sans from Google Fonts.

# Task: Move citizen application route and preserve existing-application loading

- [x] Replace the legacy `draft=1` flag with `status=draft`.
- [x] Move `/apply/:id` to `/applications/:id`.
- [x] Update every citizen navigation to the new route and correct application IDs for existing application actions.
- [x] Preserve GET application-detail hydration for draft, deficiency, payment, download, and view actions.
- [x] Mark notification application links as existing-application views.
- [x] Run focused lint verification.
- [ ] Run web build verification (blocked by unavailable Google Fonts).

## Review

Focused ESLint passes for the relocated route and every updated navigation component. A final scan confirms no `/apply/:id` links or `draft=1` flags remain. The Next production build reaches compilation but cannot fetch DM Sans from Google Fonts in this environment, so it cannot complete independently of the code changes.

# Task: Fix operator production build

- [x] Run the operator production build and identify the TypeScript failure.
- [x] Remove unused Header icon imports left behind by disabled menu entries.
- [x] Re-run the operator build and lint.

## Review

`pnpm build:operator` now completes successfully. `pnpm lint:operator` reports no errors and retains only the existing React Compiler/TanStack Table warning in `src/components/ui/data-table.tsx`.

# Task: Redesign citizen applications list with status actions

- [x] Inspect the Figma applications-list design and current application API shape.
- [x] Replace application cards with the responsive Figma-inspired table layout.
- [x] Cover every defined application status with a label, color, message, and appropriate operation.
- [x] Add status-specific Ödə, Yüklə, Bax, and Davam et actions with existing routes.
- [x] Run focused lint/type checks and the web production build.

## Review

Applications now render in a responsive table matching the referenced Figma structure. Status handling is configuration-driven for all `applicationStatusOptions`, including payment and completed-document actions, draft continuation, revision review, and process/view states. Focused ESLint/TypeScript checks and `pnpm build:web` pass.

# Task: Send complete service rating payload

- [x] Update the rating API payload to use `application_id`.
- [x] Forward the trimmed comment from the rating form.
- [x] Keep `rating` required and omit the optional `comment` key when blank.
- [x] Run focused ESLint and TypeScript checks.

## Review

Rating submission now posts required `{ application_id, rating }` and adds optional `comment` only when non-empty to `/service-ratings`. Focused lint and TypeScript checks pass.

# Task: Handle 422 errors when creating applications

- [x] Detect HTTP 422 responses from the new-application POST request.
- [x] Show only the server error message and a centered Qaralamalar button for 422 responses.
- [x] Keep the existing stepper/error behavior for other request failures.
- [x] Run focused ESLint and TypeScript checks.

## Review

New-application creation failures with HTTP 422 now render a dedicated centered error state without any application steps. The user can return to `/drafts`; draft hydration and non-422 error handling are unchanged. Focused lint and TypeScript checks pass.

# Task: Restore draft continuation and hydrate existing applications

- [x] Restore the draft card's "Davam et" action and route with the draft application ID.
- [x] Add typed GET `/permit-applications/:id` support for application details.
- [x] Hydrate draft application identity, contact, and trade fields without creating a new application.
- [x] Preserve POST creation only for new application flows.
- [x] Run focused lint/type checks and the web production build.

## Review

Draft continuation uses `/apply/{id}?draft=1`; draft mode calls the detail endpoint and keeps the existing application ID for subsequent updates/submission. The new-application route remains POST-backed and unchanged in behavior. Focused ESLint/TypeScript checks and `pnpm build:web` pass.

# Task: Integrate citizen draft progress

- [x] Inspect the draft-progress guide, drafts route, page components, and current progress UI.
- [x] Inspect citizen application list API/types and authenticated server-fetch conventions.
- [x] Confirm the correct draft continuation route and avoid creating duplicate drafts.
- [x] Add the documented draft progress fields and fetch drafts with the exact `status=draft` filter.
- [x] Replace draft mock data with API results while preserving the existing page design.
- [x] Run focused checks, full web lint, and the web production build.
- [x] Review the diff and document verification results.

## Review

The drafts route now fetches the authenticated citizen's applications with the exact `status=draft` filter and renders the API-provided permit-service name, completed/total steps, and percentage without deriving or hardcoding progress. Mock drafts, fake timestamps, and unsupported edit/delete/continue controls were removed. Explicit empty and API-error states preserve the existing page layout.

Focused ESLint and TypeScript checks pass for every changed web file, and the web production build passes. Full web lint remains blocked only by the pre-existing `app-pages/login/index.tsx:51` `react-hooks/set-state-in-effect` error.

# Task: Integrate public and operator FAQs

- [x] Inspect the FAQ guide, current web FAQ section, and both apps' API/query conventions.
- [x] Inspect operator sidebar authorization, routing, CRUD pages, and shadcn dialog/form patterns.
- [x] Add the public web FAQ API integration without changing the established accordion design.
- [x] Add typed operator FAQ CRUD APIs and React Query hooks.
- [x] Build a super-admin-only operator FAQ page with create/edit dialogs and safe delete behavior.
- [x] Add the FAQ sidebar item and protected route for super administrators only.
- [x] Run focused checks, full lint, and production builds for both apps.
- [x] Review the diff and document verification results.

## Review

Replaced the web homepage's static FAQ data with the public `GET /faqs` response while preserving the existing accordion design, backend order, first-item-open behavior, empty/error states, and live FAQPage JSON-LD. Added a typed operator FAQ feature for `GET/POST/PUT/DELETE /admin/faqs`, plus a super-admin-only sidebar item and protected `/faqs` route. The operator page lists active and inactive questions in server order and uses one reusable shadcn form dialog for both create and edit. Hard delete requires a separate confirmation dialog that explicitly warns the operation cannot be reversed.

Focused ESLint and TypeScript checks pass for both apps. Full operator lint passes with only the existing TanStack Table React Compiler warning. Full web lint remains blocked only by the pre-existing `app-pages/login/index.tsx:51` `react-hooks/set-state-in-effect` error. Both web and operator production builds pass; the operator build retains the existing large-chunk advisory.

# Task: Integrate operator notifications API

- [x] Inspect the operator header, layouts, router, navigation, and application-detail route conventions.
- [x] Inspect operator feature API/type/hook/query patterns and reread the shared notifications guide.
- [x] Add a typed operator notifications feature for list, unread count, and mark-all-read.
- [x] Build the operator notifications page using existing layout and UI conventions.
- [x] Add the live unread badge and notifications navigation to the header bell.
- [x] Run focused checks, full operator lint, and the operator production build.
- [x] Review the diff and document verification results.

## Review

Added a typed operator notifications feature for the documented list, unread-count, and bulk mark-all-read endpoints using the operator Axios auth/interceptor conventions. The new `/notifications` page follows the existing dashboard page and `TableLayout` structure, renders loading/empty/error states, distinguishes unread rows, and navigates each notification to a canonical `/applications/manage/{id}` route backed by the existing application-detail page. The header bell now opens the notifications page and shows the live unread-count badge, capped visually at `99+`. No sidebar entry, single-notification read endpoint, or undocumented pagination behavior was added.

Focused ESLint and TypeScript checks pass. Full operator lint passes with only the existing TanStack Table React Compiler warning in `components/ui/data-table.tsx`. The operator production build passes with the existing large-chunk advisory. `git diff --check` passes with only line-ending notices.

# Task: Integrate citizen notifications API

- [x] Inspect the notifications page and identify its current data/state behavior.
- [x] Inspect existing `apps/web/features` API, type, and hook conventions.
- [x] Read `docs/latest/frontend-bildirisler-bələdçisi.md` and map its citizen endpoints to the UI.
- [x] Implement the smallest typed notification feature/API integration required by the guide.
- [x] Run focused checks, full web lint, and the web production build.
- [x] Review the diff and document verification results.

## Review

Added a typed `features/notifications` API/query layer for the documented list, unread-count, and bulk mark-all-read endpoints. The citizen notifications page now renders live data with loading, empty, and error states; refreshes both list and count after the bulk mutation; and routes notification clicks to the same `/applications/{id}` detail path already used by the citizen application list. The profile-menu badge now comes from the unread-count endpoint. Removed the mock list and its unsupported rich-detail dialog behavior; no per-notification read endpoint or undocumented pagination parameter was invented.

Focused ESLint, TypeScript (`tsc --noEmit`), and `git diff --check` pass. Full web lint remains blocked only by the pre-existing `app-pages/login/index.tsx:51` `react-hooks/set-state-in-effect` error. The production build remains blocked only because the environment cannot fetch DM Sans from Google Fonts. The `pnpm` launcher stalled without output in this shell, so equivalent local app binaries were used for the completed lint, typecheck, and build attempts.

# Task: Remove 300-character textarea limits

- [x] Audit shadcn and native textarea usages across operator and web apps.
- [x] Remove the operator `NoteTextarea` 300-character limit and counter.
- [x] Remove the web operations textarea 300-character limit and counter.
- [x] Run focused searches, lint, and production builds.
- [x] Review the diff and document the result.

## Review

Removed the 300-character restriction and counter from the shared operator `NoteTextarea`, which covers permit-service and application note fields. Removed the matching limit, counter, and counter-only padding from the web application operations textarea. The web rating textarea was audited and had no limit. Focused app-code search reports no 300-character textarea references; unrelated FIN inputs retain their required seven-character limit. Operator lint passes with the existing TanStack Table compiler warning; web lint remains blocked by the pre-existing login effect error. Operator typecheck/build and web production build pass.

# Task: Complete service-rating API integration

- [x] Inspect the service-satisfaction guide and current web/operator rating integrations.
- [x] Add the documented web `POST /service-ratings` API helper with the exact payload fields.
- [x] Submit the completed application ID and selected rating from the web rating view.
- [x] Surface API validation and duplicate-rating errors without leaving the rating view.
- [x] Verify the operator statistics integration remains aligned with the guide.
- [x] Run focused lint, web/operator lint, and web/operator production builds.

## Review

Added the documented citizen-side `POST /service-ratings` call with the exact `permit_application_id` and `rating` payload, using the submitted application ID retained by the apply flow. Rating submission now shows in-place backend errors (including duplicate/validation responses), disables while pending, and returns home only after a successful response. The existing operator statistics integration remains on `/admin/service-ratings/statistics` with the documented period/date filters and response fields. Focused lint passes for both apps; web and operator production builds pass. Full web lint retains only the pre-existing login-page effect error, and operator lint retains only the existing TanStack Table compiler warning.

# Task: Open rating after application success

- [x] Inspect the success component, apply state machine, and available rating APIs.
- [x] Replace the success home action with `Xidməti qiymətləndir`.
- [x] Add a post-success rating view to the apply flow.
- [x] Preserve a home exit after skipping or completing the UI-only rating.
- [x] Run focused lint, full web lint, and the web production build.

## Review

Replaced the success card's `Ana səhifəyə qayıt` action with `Xidməti qiymətləndir` and renamed its callback contract from `onHome` to `onRate`. The apply state now includes a semantic post-success `rating` view, hides the application progress stepper there, and renders `RatingStep` only after the user chooses the new action. Because the repository defines no rating endpoint, skipping or completing the UI-only rating returns to the home page instead of pretending feedback was persisted. Focused ESLint and the complete web production build pass. Full web lint was run and remains blocked only by the pre-existing login effect error at `app-pages/login/index.tsx:51`.

# Task: Implement Figma rating step

- [x] Load the mandatory Figma design-to-code and React guidance.
- [x] Fetch design context and screenshot for node `40000597:95844`.
- [x] Inspect every existing apply page and step plus the shared controls they use.
- [x] Download and commit the exact Figma star assets.
- [x] Replace the existing rating placeholder with the responsive interactive design.
- [x] Run focused lint, full web lint, and the web production build.
- [x] Review the implementation against the Figma screenshot.

## Review

Replaced the existing `RatingStep` placeholder with the responsive 550px Figma card, using the exact downloaded filled and outline star exports. The component provides accessible 1–5 selection, an optional controlled comment, design-matched disabled submit state, and typed `onSkip`/`onSubmit` callbacks while remaining intentionally separate from the existing apply state machine. Its dimensions, spacing, colors, typography, textarea, and actions were checked against node `40000597:95844`. Focused ESLint and the complete web production build pass. Full web lint was run and remains blocked only by the pre-existing login effect error at `app-pages/login/index.tsx:51`.

# Task: Configure backend images from environment

- [x] Inspect the web API environment, Next image config, and permit-service icon consumers.
- [x] Configure `next/image` to allow the backend origin derived from `NEXT_PUBLIC_API_BASE_URL`.
- [x] Normalize backend asset paths and absolute URLs to the environment-defined backend origin.
- [x] Remove the hard-coded API fallback and update permit-service icon consumers.
- [x] Run focused lint, full web lint, and the web production build.

## Review

Configured Next image optimization from the origin parsed out of `NEXT_PUBLIC_API_BASE_URL`, allowing every backend storage path without hard-coding a hostname. Added `backendAssetUrl` to preserve an API-provided asset path while replacing its protocol and host with the environment origin, so an `http://.../storage/...` response becomes the configured `https://.../storage/...` URL. Permit-service list and detail icons use the helper, and the API helper no longer has a hard-coded fallback. The generated Next config confirms `https://permit-back.secop.az/**`; focused ESLint and the complete web production build pass. Full web lint was run and remains blocked only by the pre-existing login effect error at `app-pages/login/index.tsx:51`.

# Task: Redirect unauthenticated apply users to login

- [x] Inspect the apply initialization flow and web auth conventions.
- [x] Redirect unauthenticated users to `/login` before creating an application draft.
- [x] Verify authenticated initialization and non-auth error handling remain unchanged.
- [x] Run focused lint, web lint, and web build checks.

## Review

The apply initialization now waits for auth resolution and redirects users without an authenticated `user` to `/login` before any draft-creation request is made. Authenticated users retain the existing application initialization and API error handling. The initialization callback is deferred and cancellable so it passes the React effect rule and avoids stale updates when the route changes. Focused ESLint passes and the complete web production build succeeds. Full web lint was run and remains blocked only by the pre-existing `react-hooks/set-state-in-effect` error in `app-pages/login/index.tsx:51`.

# Task: Integrate operator dashboard statistics API

- [x] Inspect the dashboard statistics guide and existing operator API/query patterns.
- [x] Extend the statistics response model to the complete documented payload.
- [x] Render the first four documented statistics cards directly from the API response with loading/error fallbacks.
- [x] Run focused ESLint, full operator lint, and operator production build checks.
- [x] Review the final diff and document verification results.

## Review

Expanded the response type to the complete nine-counter API contract and replaced the dashboard's two partial live values plus two hard-coded placeholders with the first four documented cards driven entirely by `GET /admin/statistics`: Yeni daxil olan, İcrada olan, Vizada olan, and İmzada olan. The remaining counters stay typed for later UI work but are not rendered. The section sends no date or role parameters, preserves zero values, shows placeholders while loading, and surfaces a localized fetch error. Focused ESLint and full operator lint pass; full lint retains only the existing TanStack Table React Compiler warning. The operator TypeScript and Vite production build also pass, retaining the existing large-chunk advisory.

# Task: Add permit-service applicant type

- [x] Audit the permit-service type, create/edit state, validation, and multipart serialization.
- [x] Add the required shadcn select with physical, legal, and both options.
- [x] Include `allowed_applicant_types` in create and update `FormData` payloads.
- [x] Run focused lint, full operator lint, and production build checks.

## Review

Added the typed `AllowedApplicantType` union to permit-service response/form models, defaulted new services to `both`, and hydrated the returned value for edit flows with a defensive `both` fallback. The manage form now exposes a required shadcn select with Fiziki (`physical`), Hüquqi (`legal`), and Hər ikisi (`both`) options and integrates backend/client validation messages. Multipart serialization now always appends `allowed_applicant_types` for both create and update requests. Removed leftover FormData debug expressions from the touched API helper. Focused ESLint, full operator lint, TypeScript compilation, and production build pass; full lint retains only the existing TanStack Table compiler warning and build retains the existing bundle-size advisory.

# Task: Apply Figma textarea design across operator

- [x] Fetch design context and screenshot for Figma node `40000185:70006`.
- [x] Audit the shared shadcn textarea and existing composed textarea usage.
- [x] Disable textarea resizing and align the shared primitive to the Figma visual contract.
- [x] Use the label/counter textarea composition in permit-service multiline fields.
- [x] Run focused lint and operator build checks.

## Review

Updated the shared shadcn `Textarea` to the Figma contract: fixed 152px minimum height, disabled resizing, 8px radius, neutral fill, 16px/24px typography, Figma padding, and matching placeholder/focus/invalid states. Refined `NoteTextarea` to produce the full 180px composition with the muted 14px label, 8px gap, bottom-right character counter, correct label association, and reserved counter space. Permit-service multiline fields now use this composition with a 300-character limit while preserving validation attributes and controlled values. Focused ESLint and the operator production build pass. Full operator lint was also run; it remains blocked by an unrelated user-side bare `console.log` expression in `features/permit-services/api.ts:59`, plus the existing TanStack Table compiler warning.

# Task: Apply Figma input design across operator

- [x] Fetch design context and screenshot for Figma node `40000060:1673`.
- [x] Audit shared shadcn `Input`, `Select`, input groups, and all operator usages.
- [x] Update shared input/select primitives to the Figma dimensions, colors, radius, and typography.
- [x] Add a reusable Figma-matched search input without changing base input behavior.
- [x] Replace duplicated operator search wrappers with the shared search input.
- [x] Run operator lint/build checks and visually review the implementation.

## Review

Implemented the Figma `Search Input` contract as a reusable operator component and aligned the shared shadcn `Input` and default `SelectTrigger` to its 48px height, 8px radius, 16px horizontal/12px vertical padding, DM Sans 16/24 typography, and neutral colors. Migrated all six duplicated operator search fields to the shared component, retained the compact select variant, and constrained `InputGroupInput` so the larger base input does not alter compact composite controls. The focused ESLint check, full operator lint, TypeScript compilation, and production build pass. Full lint retains only the existing TanStack Table React Compiler warning; the build retains the existing bundle-size advisory.

# Task: Fix operator permit-service management

- [x] Audit permit-service pages, routes, API helpers, hooks, and types against the operator guide.
- [x] Correct create/update `FormData` behavior and preserve the documented HTTP methods.
- [x] Add guide-required icon validation and robust form validation.
- [x] Fix invalid edit IDs and documented list-row navigation behavior.
- [x] Verify query invalidation and all admin-only route wiring.
- [x] Run operator lint/build checks and review the diff.

## Review

Audited the full super-admin permit-service flow against the supplied guide. The documented GET/POST/DELETE endpoints and `_method: PUT` update contract remain intact. Updates can now clear optional scalar fields while omitting an unchanged icon, each FormData request overrides the Axios JSON default so the browser can generate the multipart boundary, and deactivation invalidates both list and detail caches. The pages now validate required/numeric fields and JPG/PNG/SVG icons up to 2 MB, surface backend validation messages, reject invalid route IDs, show current icon/code, provide clickable list content and an empty state, and use Azerbaijani nested breadcrumbs. Focused ESLint/TypeScript checks and full operator lint/build pass; lint retains the pre-existing TanStack Table compiler warning and build retains the existing large-chunk advisory.

# Task: Add web layout revalidation

- [x] Inspect the web root layout and existing changes.
- [x] Add a 120-second route-segment revalidation interval.
- [x] Run focused verification and document the result.

## Review

Added `export const revalidate = 120` to the web root layout. Focused ESLint and TypeScript checks pass.

# Task: Move operator route pages out of features

- [x] Inventory every route-level page under `apps/operator/src/features` and map it to `pages/(dashboard)`.
- [x] Move the page modules into route-shaped dashboard page directories.
- [x] Update router imports and any imports affected by the new locations.
- [x] Confirm no page modules remain under `features` and no stale imports remain.
- [x] Run operator lint and build checks.
- [x] Review the final diff and document the result.

## Review

Moved all seven feature-hosted route screens into route-shaped directories under `pages/(dashboard)`: shared application management, unsigned formalization, confirmation queues, permit-service list/manage, service ratings, and user creation. Updated the router to import only from `@/pages/(dashboard)` for these screens and changed the moved application page's relative section imports to stable feature aliases. No page-named modules or stale feature-page imports remain under `features`; empty feature component directories were removed. Operator lint passes with the existing TanStack Table/React Compiler warning, and the production build passes with the existing large-chunk advisory.

# Task: Remove operator EmptyPage placeholders

- [x] Inspect the operator app and enumerate every `EmptyPage` consumer.
- [x] Verify affected placeholder pages are not registered in the active router or sidebar.
- [x] Remove all placeholder page files and the now-unused `EmptyPage` component.
- [x] Confirm no `EmptyPage` references remain.
- [x] Run operator lint and build checks.
- [x] Review the diff and document the result.

## Review

Removed 30 orphan dashboard placeholder pages, their empty directories, and the shared `EmptyPage` component. The active router and sidebar required no changes because they did not reference these pages. A fresh operator-wide search reports zero `EmptyPage` matches. Operator lint passes with one pre-existing React Compiler/TanStack Table warning, and the operator production build passes with the existing large-chunk advisory.

# Task: Pass the dynamic apply route id to ApplyPermissionPage

- [x] Inspect the dynamic route, target component, and project conventions.
- [ ] Update the route to await Next.js `params` and pass `id` to `ApplyPermissionPage`.
- [ ] Run lint and build checks.
- [ ] Review the diff and document the result.

## Review

Pending implementation and verification.

# Task: Implement the Figma progress stepper

- [x] Fetch the Figma design context and screenshot for node `40000546:60074`.
- [x] Inspect the `apps/web` component, token, and layout conventions.
- [x] Create a reusable `ProgressStepper` with configurable labels and 1-based `activeStep`.
- [x] Use a responsive `max-w-7xl` inner layout and integrate the component into the apply page.
- [x] Run lint and build checks.
- [x] Review the diff and document the result.

## Review

Targeted ESLint and TypeScript checks pass for the changed files. Full lint is blocked by the pre-existing login effect rule violation, and the production build is blocked by unavailable Google Fonts network access.

# Task: Prepare Figma input primitives for React Hook Form

- [x] Fetch the Figma design context and screenshot for node `40000546:61963`.
- [x] Review the official shadcn React Hook Form documentation.
- [x] Customize the shared web `FieldLabel` and `Input` primitives to match the Figma design.
- [x] Add `react-hook-form`, `@hookform/resolvers`, and `zod` to `apps/web`.
- [x] Avoid creating a form implementation.
- [x] Run targeted ESLint and TypeScript checks.

## Review

The web primitives match the Figma label/input measurements and colors. The official shadcn React Hook Form dependencies are installed, no form code was added, and targeted checks pass. The operator app was not changed.

# Task: Implement personal information step from Figma

- [x] Fetch the Figma design context, metadata, screenshot, and exported icon assets for node `40000546:60092`.
- [x] Review existing apply-page and shared UI component conventions.
- [x] Create `apps/web/app-pages/apply/steps/personal-information.tsx`.
- [x] Import and render the personal-information step from the apply page.
- [x] Run targeted ESLint and TypeScript checks.

## Review

The personal-information card matches the Figma layout, uses the shared Field/FieldLabel/Input/Button components, stores the four exported SVG assets locally, and responds to smaller screens with single-column fields. Targeted ESLint and TypeScript checks pass.

# Task: Implement contact information step from Figma

- [x] Fetch the Figma design context and screenshot for node `40000546:61953`.
- [x] Review the existing shared contact-step primitives and apply-page conventions.
- [x] Create `apps/web/app-pages/apply/steps/contact-information.tsx` as a client component.
- [x] Render one phone input by default and append new phone inputs below it when “Nömrə əlavə et” is clicked.
- [x] Add per-row phone removal controls and the Figma step-2 footer state.
- [x] Download and use the exported contact-step SVG assets.
- [x] Run targeted ESLint and TypeScript checks.

## Review

The contact-information card matches the Figma structure and styling, uses the shared shadcn primitives, supports adding phone fields at the bottom of the current list, and passes targeted checks.

# Task: Install shadcn radio group and implement operations step

- [x] Install the official shadcn `radio-group` primitive in `apps/web`.
- [x] Fetch the Figma design contexts and screenshots for nodes `40000546:60480` and `40000546:60470`.
- [x] Create a reusable radio choice-card component under `apps/web/components`.
- [x] Implement `apps/web/app-pages/apply/steps/operations-step.tsx` from the Figma design.
- [x] Download and use the exported operations-step SVG assets.
- [x] Run targeted ESLint and TypeScript checks.

## Review

The official shadcn radio-group primitive was installed in `apps/web`. The reusable radio choice card uses the exported Figma radio states and the operations step matches the selected category, operation type, description, and navigation states from Figma. Focused checks pass; full lint remains blocked by the pre-existing login effect violation, and the build remains blocked by unavailable Google Fonts network access.

# Task: Implement documents upload step from Figma

- [x] Fetch Figma design contexts, metadata, screenshots, and motion context for nodes `40000546:62050`, `40000546:62068`, and `40000546:62067`.
- [x] Download the exact document upload, progress, completed-file, and navigation SVG assets.
- [x] Create reusable upload-row behavior for local PDF selection, progress, completion, retry, and removal.
- [x] Implement `apps/web/app-pages/apply/steps/documents-step.tsx` with required and additional document sections.
- [x] Run targeted ESLint and TypeScript checks.

## Review

The documents step matches the Figma layout with five required document cards, three additional-document slots, and the step 4 footer. Each upload row accepts local PDFs up to 10MB, displays the Figma progress state during a timed upload simulation, and changes to the completed-file state with refresh and delete actions. Focused checks pass; full lint remains blocked by the pre-existing login effect violation, and the build remains blocked by unavailable Google Fonts network access.

# Task: Implement checkout review step from Figma

- [x] Fetch the checkout design context, metadata, screenshot, and nested section details for node `40000546:62103`.
- [x] Download and use the exact checkout document, notice, and navigation SVG assets.
- [x] Create a reusable checkout review component that accepts selected document data.
- [x] Implement `apps/web/app-pages/apply/steps/checkout-step.tsx` with review sections for personal, contact, operation, and document data.
- [x] Run targeted ESLint and TypeScript checks, then record verification results.

## Review

The checkout step matches the Figma review card with responsive `max-w-7xl` page content, four review sections, six selected-document rows, the confirmation notice, and the `5 / 6` navigation footer. Completed uploads can be passed through the `documents` prop, while the default data keeps the Figma state visible during standalone development. Focused ESLint and TypeScript checks pass. The full lint remains blocked by the pre-existing login effect violation, and the full build remains blocked because Next.js cannot fetch DM Sans from Google Fonts in the current environment.

# Task: Implement confirmation step from Figma

- [x] Fetch the confirmation design context, metadata, and screenshot for node `40000546:62236`.
- [x] Download and use the exact confirmation icons and navigation assets.
- [x] Implement `apps/web/app-pages/apply/steps/confirmation-step.tsx` with the submission summary, draft action, warning, and disabled submit footer.
- [x] Run targeted ESLint and TypeScript checks, then record verification results.

## Review

The confirmation step matches the Figma layout with responsive `max-w-7xl` page content, the centered submission prompt, permit summary, save-as-draft action, missing-information warning, and disabled `6 / 6` footer. Focused ESLint and TypeScript checks pass. Full repository lint/build retain the previously reported login effect and unavailable Google Fonts blockers, confirmed again after this change.

# Task: Implement success step from Figma

- [x] Fetch the success design context, metadata, and screenshot for node `40000546:62266`.
- [x] Download and use the exact success-state icon asset.
- [x] Implement `apps/web/app-pages/apply/steps/success-step.tsx` with the application summary, status, and navigation actions.
- [x] Run targeted ESLint and TypeScript checks, then record verification results.

## Review

The success step matches the Figma layout with the centered success state, application type/number/date summary, registered status indicator, and two responsive navigation buttons. Application number and date, plus both button handlers, are configurable through props. Focused ESLint and TypeScript checks pass. Full repository lint/build retain the previously reported login effect and unavailable Google Fonts blockers, confirmed again after this change.

# Task: Implement draft-save step from Figma

- [x] Fetch the draft-save design context, metadata, and screenshot for node `40000546:62294`.
- [x] Download and use the exact draft-save book icon asset.
- [x] Implement `apps/web/app-pages/apply/steps/to-draft-step.tsx` with the draft summary, status, and continuation actions.
- [x] Run targeted ESLint and TypeScript checks, then record verification results.

## Review

The draft-save step matches the Figma layout with the centered book icon, draft-save messaging, completion summary, orange incomplete status, and `Davam et` / `Qaralamalarıma bax` actions. Completion text and both actions are configurable through props. Focused ESLint and TypeScript checks pass. Full repository lint/build retain the previously reported login effect and unavailable Google Fonts blockers, confirmed again after this change.

# Task: Integrate the physical-person apply flow with the API

- [x] Inspect the Azerbaijani citizen application guide and identify the physical-person endpoints and payloads.
- [x] Add typed web API helpers for draft creation, contact details, operation details, file uploads, and submission.
- [x] Hydrate and lock API-provided personal information, then wire step navigation and contact validation.
- [x] Wire the permit-service `1` operation branch and the document upload step to the application API.
- [x] Wire review, draft-save, submission, and success state to the live application data.
- [x] Run focused lint/type checks and review the final diff.

## Review

The physical-person apply flow now creates its draft on page load using the route's permit-service id, displays the API-provided FIN/name fields as disabled inputs, updates contact details, conditionally sends `trade_detail` for service `1`, uploads selected PDF files as multipart requests, and submits the application. The review and success screens consume live flow state, while the existing draft-save view remains available without an additional endpoint because the guide does not define one.

Focused ESLint and TypeScript checks pass for all changed flow files. The full web lint remains blocked by the pre-existing `apps/web/app-pages/login/index.tsx:51` `react-hooks/set-state-in-effect` error. The web production build remains blocked by the environment's inability to fetch Google Fonts (`DM Sans`) during `next build`.

# Task: Derive the mygov redirect URL from the current web origin

- [x] Inspect the citizen auth request, login caller, HTTP helper, and deployment configuration.
- [x] Replace the environment-controlled localhost URL with the browser's current origin plus `/login`.
- [x] Remove the obsolete auth test-mode build/runtime configuration.
- [x] Run focused lint, full web lint, and the web production build.
- [x] Review the diff and document verification results.

## Review

The mygov redirect request now always calls the configured API endpoint with a `redirect_base` query parameter derived from `window.location.origin` and the `/login` path. This produces `http://localhost:3000/login` locally and the equivalent HTTPS login URL on deployed domains without a separate environment switch. Removed `NEXT_PUBLIC_AUTH_TEST_MODE` from the web Dockerfile and Compose configuration.

Focused ESLint and the complete web TypeScript check pass. Full web lint remains blocked only by the pre-existing `react-hooks/set-state-in-effect` error in `app-pages/login/index.tsx:51`, and the production build remains blocked only because the environment cannot fetch DM Sans from Google Fonts. URL derivation was checked for localhost and `https://energy.az`; `git diff --check` passes. Docker Compose validation could not run because Docker is not installed in this environment.
## Task: Implement dynamic document configuration in the admin panel

- [x] Read the new guide and scope the work to HİSSƏ 1 only.
- [x] Audit the operator permit-service pages, API/types/hooks, and reusable selectors.
- [x] Add typed document-type list/create API integration and query hooks.
- [x] Replace `document_count` with required ordered `document_type_ids` in permit-service state and multipart payloads.
- [x] Add searchable multi-selection, inline document-type creation, and explicit ordering controls to create/edit forms.
- [x] Run focused checks, full operator lint, and the operator production build.
- [x] Review the final diff and document verification results.

### Review

Added a focused document-types feature for the documented admin list/create endpoints, with React Query caching and immediate cache insertion after creation. Permit-service create/update state now requires an ordered `document_type_ids` array, edit mode hydrates it from `documentTypes`, and multipart requests preserve the selected order using repeated `document_type_ids[]` fields. Removed `document_count` from the operator model, validation, payload, and form while retaining the separate legacy descriptive `required_documents` field because the new guide only removes the count.

The create/edit form now uses the existing searchable multi-select, supports creating a missing Azerbaijani document name through the API and immediately selecting its returned ID, prevents duplicate selections, displays API/loading errors, and exposes explicit up/down controls for citizen-facing order. No citizen-side implementation from HİSSƏ 2 was changed.

Focused ESLint and TypeScript checks pass. Full operator lint passes with only the existing TanStack Table/React Compiler warning in `components/ui/data-table.tsx`, and the operator production build passes with the existing large-chunk advisory. `git diff --check` passes with line-ending notices only.
## Task: Implement dynamic citizen document uploads

- [x] Read HİSSƏ 2 and inspect the apply route, flow state, upload component, API helpers, draft hydration, review, submit, and public permit detail.
- [x] Add `documentTypes` to citizen permit-service and application contracts.
- [x] Pass new-flow permit-service configuration from the dynamic route and hydrate draft configuration from the application detail.
- [x] Replace hardcoded/free-form upload rows with ordered named rows from `documentTypes`.
- [x] Send `document_type_id`, enforce PS-013's 25 MB limit and the 10 MB default, and keep failed uploads incomplete.
- [x] Derive the public detail document count/list and surface named missing-document submit errors.
- [x] Run focused checks, full web lint, and the web production build.
- [x] Review the final diff and document verification results.

### Review

The citizen apply route now server-fetches the public permit-service detail for new applications and passes its ordered document configuration into the client flow without an extra client waterfall. Draft continuation hydrates `documentTypes` from the application detail and fetches the related permit service only when its code/configuration is missing. Existing live permit services that have not yet received the new array are handled as unconfigured instead of crashing prerendering.

The documents step now renders exactly one named upload row per configured document type in backend order; all hardcoded and free-form additional rows were removed. Uploads send numeric `document_type_id`, use 25 MB for PS-013 and 10 MB otherwise, show local PDF/size validation, and become complete only after the API resolves. Failed replacement uploads restore the previous successful file. Because the guide defines no delete endpoint, configured required uploads do not expose a misleading local-only delete action. Review preserves document names and configured types, and all required rows must upload successfully before continuing.

The public permit detail derives its document list and count from `documentTypes`, while submit errors prioritize the backend's exact `errors.files` text so missing documents are shown by name. Focused ESLint and TypeScript checks pass. Full web lint remains blocked only by the pre-existing `react-hooks/set-state-in-effect` error in `app-pages/login/index.tsx:51`. The full web production build passes and prerenders all permit detail routes. `git diff --check` passes with line-ending notices only.

## Task: Convert the permit-service list to a table

- [x] Inspect the permit-service list and established operator table patterns.
- [x] Replace the permit-service cards with the shared `DataTable` while preserving all data and actions.
- [x] Run focused checks, full operator lint, and the operator production build.
- [x] Review the final diff and document verification results.

### Review

Replaced the permit-service card stack with the operator's shared `DataTable`. The table keeps the service icon/name navigation and adds dedicated code, category, applicant-type, and status columns, followed by the existing edit and active-only deactivate actions. Loading, API error, and localized empty states remain outside the table because the list endpoint is not paginated and the shared empty message is English.

Focused ESLint passes. Full operator lint passes with only the existing TanStack Table/React Compiler warning in `components/ui/data-table.tsx`, and the operator production build passes with the existing large-chunk advisory. `git diff --check` passes with line-ending notices only.

## Task: Hydrate document types when editing a permit service

- [x] Trace edit-form hydration and the document-type selector's option mapping.
- [x] Seed the selector with document types already attached to the permit service.
- [x] Verify focused lint, full operator lint, and the operator production build.
- [x] Review the final diff and document the result.

### Review

The edit form now passes the permit service's attached `documentTypes` into the selector. The selector merges those records with the asynchronously loaded admin document-type catalog before resolving selected IDs into labeled combobox values. Existing selections therefore remain visible and ordered even when a legacy or inactive attached type is absent from the general list endpoint.

Full operator lint passes with only the existing TanStack Table/React Compiler warning in `components/ui/data-table.tsx`. The operator production build passes with the existing large-chunk advisory, and `git diff --check` passes with line-ending notices only. The initial focused ESLint invocation stalled without output and was stopped; the subsequent full-project lint covered both changed files successfully.

## Task: Match admin permit-detail document response

- [x] Compare the real admin detail payload with the operator response type and edit hydration.
- [x] Model `document_types` and its pivot ordering from the admin response.
- [x] Hydrate the edit selector and ordering list from the attached document types.
- [x] Run focused checks, full operator lint, and the operator production build.
- [x] Review the final diff and document verification results.

### Review

Updated the operator permit-service detail contract to match the real admin response's snake_case `document_types` array and typed its pivot metadata. Edit initialization copies and sorts the attached document records by `pivot.display_order`, then hydrates `document_type_ids` from that order. The same attached records seed the combobox option catalog, so selected labels and the existing citizen-facing reorder list render immediately and can be changed exactly as during creation.

Full operator lint passes with only the existing TanStack Table/React Compiler warning in `components/ui/data-table.tsx`, and the operator production build passes with the existing large-chunk advisory. `git diff --check` passes with line-ending notices only. The focused ESLint invocation again stalled without output and was stopped; full-project lint covered all changed files successfully.

## Task: Fix citizen document-type hydration

- [x] Compare the live draft-application payload with the citizen response contracts.
- [x] Normalize the documented `documentTypes` and live nested `permit_service.document_types` formats.
- [x] Preserve the backend-provided display order for document uploads.
- [x] Run focused lint and TypeScript checks; production build is blocked by Google Fonts network access.
- [x] Review the final diff and document the result.

### Review

The citizen apply flow now accepts the documented nested
`permit_service.documentTypes` contract, with the live
`permit_service.document_types` response retained as a backward-compatible
fallback. It maps the records to the upload UI's `{ id, name }` contract and
sorts by the backend-provided `pivot.display_order` when present.

Focused ESLint, TypeScript, and `git diff --check` pass. The web production
build reaches Next.js compilation but is blocked because this environment cannot
fetch the DM Sans Google Font.

## Task: Submit citizen applications as multipart data

- [x] Trace the final submit request through the shared HTTP client.
- [x] Replace the implicit JSON request with an explicit empty multipart body.
- [x] Run focused lint and TypeScript checks.
- [x] Review the final diff and document the result.

### Review

`POST /permit-applications/{id}/submit` now sends an empty `FormData` body with
the multipart content type instead of inheriting the HTTP client's JSON default.
Focused ESLint, TypeScript, and `git diff --check` pass.
# Task: Refine operator permit service controls

- [x] Replace permit-service table action labels with accessible icon buttons.
- [x] Reorder the management form and make the icon picker a visual click target.
- [x] Move new document-type creation into a dialog beside the selector.
- [x] Run focused lint, type/build verification, and review the diff.

## Review


Permit service actions now use labelled edit/deactivate icons. The form places the requested name fields first, keeps applicant type and category together, and opens the native file picker from a current-icon/placeholder tile while retaining the validated hidden file input. New document types are created in a dialog and selected automatically. Focused ESLint, TypeScript, Vite build, and `git diff --check` pass; the build retains Vite's existing large-chunk advisory. The `pnpm` launcher stalled in this shell, so local installed binaries were used for the equivalent checks.
# Task: Move file review controls into required documents

- [x] Inspect the existing file-review API, permissions, and required-document UI.
- [x] Move per-file accept/reject actions into `RequiredDocumentsSection`.
- [x] Add a required rejection-reason dialog and one-time review disabling.
- [x] Remove the standalone file-review section from the application page.
- [x] Run operator lint/build verification and review the diff.

## Review

The standalone “Faylların yoxlanılması” section was removed. Authorized reviewers now
accept or reject each uploaded file directly from “Tələb olunan sənədlər”; rejection
uses a required-reason dialog, and both review actions lock after the first successful
decision. Focused and full operator lint pass (apart from the existing TanStack Table
compiler warning), the operator production build passes, and `git diff --check` passes.

# Task: Implement operator signature/visa history

- [x] Inspect the history guide, confirmation feature, table conventions, routing, and navigation.
- [x] Add typed `GET /service-reports/history` API and query integration.
- [x] Build the operator history table with every guide-required column and loading/error states.
- [x] Link application numbers to the existing detail page in enforced read-only mode.
- [x] Add the history route/navigation entry for every admin role.
- [x] Run focused checks, full operator lint/build, and review the final diff.

## Review

Added an all-admin “İmza/Viza tarixçəsi” route backed by the documented history
endpoint and rendered its six required fields in the shared operator data table.
Application numbers open the existing detail request with an enforced read-only UI
that suppresses routing, file review, confirmation approval, and payment actions.
Focused ESLint, full operator lint, the operator production build, and
`git diff --check` pass; full lint retains only the existing TanStack Table compiler
warning.

# Task: Nest confirmation history in the sidebar

- [x] Replace the standalone history navigation item with a confirmations group.
- [x] Add the existing history route as the “Tarixçə” subpage.
- [x] Run focused lint and diff verification.

## Review

The sidebar now shows “Təsdiqlər” as an expandable group and exposes the history
screen beneath it as “Tarixçə”; the existing `/confirmations/history` route is
unchanged. Focused ESLint and `git diff --check` pass.

# Task: Move confirmation history under service reports

- [x] Remove the newly introduced confirmations sidebar group.
- [x] Add “Tarixçə” beneath the existing “Xidməti məruzə” group.
- [x] Run focused lint and diff verification.

## Review

No new sidebar group remains. “Tarixçə” now appears directly under the existing
“Xidməti məruzə” group and continues to open `/confirmations/history`. Focused
ESLint and `git diff --check` pass.
# Task: Clean up removed home-page status change

- [x] Inspect the commented status-change flow and identify newly unused symbols.
- [x] Remove dead status-change imports, variables, props, and commented code.
- [x] Run focused lint and operator build verification.

## Review

Removed the obsolete status-change mutation, auth lookup, toast import, status prop,
and commented branch from the home-page action cell. The remaining action navigates
directly to the application detail page. Focused ESLint, the operator production
build, and `git diff --check` pass.
# Task: Create Tailwind-based Figma news homepage

- [x] Confirm edit access and inspect the empty target file.
- [x] Attempt library and design-system discovery; record unavailable endpoints.
- [ ] Create Tailwind-aligned variable collections, aliases, modes, and styles (blocked: Figma connector HTTP 404).
- [ ] Create foundations documentation and the Azerbaijani news homepage (blocked: Figma connector HTTP 404).
- [ ] Validate the resulting Figma structure and screenshots (blocked: Figma connector HTTP 404).

## Review

Edit access initially succeeded and confirmed an empty `Page 1`. Subsequent Figma
library, identity, and `use_figma` calls all returned connector-level HTTP 404
responses. No Figma mutations were made, so the file remains clean and unchanged.
# Task: Build operator reports page

- [x] Read the reports guide and inspect operator architecture, table, filter, API, routing, and navigation conventions.
- [x] Add typed report list API/query support and a guide-compliant Excel export URL builder.
- [x] Build the reports table with all twelve documented columns and responsive horizontal scrolling.
- [x] Add permit-service, date, status, and 20/50/100 page-size filters with server pagination.
- [x] Add the all-admin “Hesabatlar” sidebar item and route.
- [x] Run focused checks, full operator lint/build, and review the final diff.

## Review

Added an all-admin `/reports` page backed by the documented paginated report endpoint.
The page uses the existing permit-service catalog, single-select service/status filters,
bounded date filters, 20/50/100 page sizes, the shared data table and pagination UI,
and all twelve documented report fields. Excel export opens the direct download URL
with only `permit_service_id`, `date_from`, and `date_to`. Focused ESLint, full
operator lint, the operator production build, and `git diff --check` pass; full lint
retains only the existing TanStack Table compiler warning.
# Task: Reorder reports navigation

- [x] Move “Hesabatlar” directly below “Lövhə” in the sidebar.
- [x] Run focused lint and diff verification.

## Review

“Hesabatlar” now appears immediately after “Lövhə” in the sidebar order. Focused
ESLint and `git diff --check` pass.

# Task: Integrate board dashboard statistics

- [x] Read the dashboard guide and inspect the existing statistics and chart structure.
- [x] Add typed dashboard statistics API/query support with date and year filters.
- [x] Replace donut, breakdown, yearly chart, and summary mock data with API data.
- [x] Add filter, year navigation, loading, error, and empty-result behavior.
- [x] Run focused checks, full operator lint/build, and review the final diff.

## Review

The board now consumes `GET /admin/statistics/dashboard` with independently applied
date filters and an eight-year navigation window. Permit-service counts and backend
percentages populate the donut and breakdown grid, yearly issued/application values
populate the bar chart, and the four summary cards use the selected year range. Empty,
loading, and request-error states are handled, while export controls remain disabled
because the guide states that no backend export exists yet. Focused ESLint, TypeScript,
full operator lint, Vite production build, and `git diff --check` pass; full lint retains
only the existing TanStack Table compiler warning and Vite retains its chunk-size advisory.
# Task: Ödəniş → imza → PDF zəncirini operator və web tətbiqlərinə inteqrasiya et

- [x] Bələdçidəki 7 mərhələni mövcud operator/web API, hook, route və UI axınları ilə müqayisə et.
- [x] Operator tətbiqində çatışmayan ödəniş təsdiqi, imzalanmamış müraciətlər və imza əməliyyatlarını tamamla.
- [x] Web tətbiqində ödəniş gözləyən və tamamlanmış müraciətlər, “Ödədim” və PDF endirmə axınlarını tamamla.
- [x] Status mətnləri, rol/görünürlük, bildiriş keçidləri və binary endirmə davranışını yoxla.
- [x] React keyfiyyət yoxlaması, lint, build və diff yoxlamalarını icra et.
- [x] Nəticələri Review bölməsində sənədləşdir.

## Review

Operator tətbiqində mövcud ödəniş təsdiqi və yekun imza endpoint-lərinin bələdçiyə
uyğunluğu yoxlanıldı; ödənişi qəbul etmə əməliyyatı yalnız müraciətin təyin olunmuş
icraçısına (və super adminə) məhdudlaşdırıldı. Web tətbiqində hesab-faktura detalı,
`POST /pay`, ödənişin yoxlanılması statusu, tamamlanmış müraciət siyahısından birbaşa
PDF endirməsi və `document_id` daşıyan bildirişdən endirmə əlavə edildi. Dəyişdirilən
fayllar fokuslanmış ESLint və TypeScript yoxlamalarından, hər iki tətbiq production
build-dən keçdi. Operator tam lintində yalnız mövcud TanStack Table xəbərdarlığı qalır;
web tam lintində dəyişiklikdən kənar `login` effect-i və Navbar `<a>` istifadəsi ilə
bağlı iki əvvəlki xəta qalır. Ümumi `git diff --check` istifadəçinin mövcud
`Permissions.tsx` dəyişikliklərindəki trailing whitespace səbəbilə dayanır.
# Task: Hesab-faktura detalını ayrıca apply step-ə ayır

- [x] Mövcud apply step komponentlərinin strukturuna uyğun payment step yarat.
- [x] Awaiting-payment detalını yeni step ilə əvəz et və API davranışını qoru.
- [x] Fokuslanmış lint, TypeScript, build və diff yoxlamalarını icra et.

## Review

Hesab-faktura görünüşü `apply/steps/payment-step.tsx` daxilində ayrıca workflow
komponentinə çıxarıldı. Step müraciət nömrəsi, icazə növü, hesab-faktura nömrəsi və
məbləği göstərir; sınaq rejimi qeydi, geri naviqasiyası, submit loading/error
və “Ödədim” əməliyyatını özündə saxlayır. Awaiting-payment detal səhifəsi yalnız bu
step-i compose edir, mövcud React Query/API davranışı dəyişməyib. Fokuslanmış ESLint,
TypeScript, Next.js production build və dəyişikliklər üzrə `git diff --check` keçdi.

# Task: Mövcud müraciətdə tamamlanmış step-ləri keç

- [x] Mövcud müraciətin doldurulmuş məlumatlarına görə ilk natamam step-i hesabla.
- [x] Müraciəti ilk natamam step-dən aç və tamamlanmış step-lərə geri keçidi blokla.
- [x] Progress stepper-i indikator kimi dəyişmədən saxla.
- [x] React keyfiyyət yoxlaması, lint, TypeScript və production build işlət.
- [x] Nəticəni Review bölməsində sənədləşdir.

## Review

Mövcud müraciət yüklənəndə şəxsi məlumat, əlaqə məlumatı, yalnız uyğun xidmət üçün
əməliyyat məlumatı və tələb olunan sənədlər ardıcıl yoxlanılır. Səhifə ilk natamam
mərhələdən açılır; həmin mərhələdə “Geri” düyməsi deaktiv olduğuna görə avtomatik
doldurulmuş mərhələlərə qayıtmaq olmur. Progress stepper yalnız indikator olaraq
dəyişdirilməyib. Fokuslanmış ESLint, TypeScript və production build keçdi. Tam web
lintində dəyişikliklərdən kənar login effect-i və Navbar `<a>` istifadəsi ilə bağlı
əvvəldən mövcud iki xəta qalır.

# Task: Dəyişdirilmiş fayllarla müraciəti yenidən göndər

- [x] Vətəndaş API qatına `resubmit` endpoint-i əlavə et.
- [x] Uğurlu fayl əvəzlənməsini izləyib yekun submit əməliyyatını `resubmit`-ə yönləndir.
- [x] Yekun düymənin mətnini yenidən göndərmə axınına uyğunlaşdır.
- [x] Fokuslanmış lint, TypeScript və production build ilə yoxla.
- [x] Nəticəni Review bölməsində sənədləşdir.

## Review

`POST /permit-applications/{id}/resubmit` API funksiyası əlavə edildi. Mövcud
müraciətdə rədd edilmiş fayl yalnız uğurla əvəzləndikdən sonra resubmit vəziyyəti
aktivləşir. Yekun mərhələdə düymə “Yenidən göndər” göstərir və adi `submit` əvəzinə
body-siz `resubmit` sorğusu göndərir; yeni müraciət axını dəyişməyib. Fokuslanmış
ESLint, TypeScript, production build və diff yoxlamaları keçdi.
# Task: Download reports export with authenticated Axios

- [x] Replace direct report-export navigation with an authenticated blob request.
- [x] Trigger the Excel download client-side while preserving the current filters and UI.
- [x] Run focused lint, operator build, and diff verification.

## Review

The reports export now uses the shared authenticated Axios client with
`responseType: "blob"`, retains the permit-service and date filters, and downloads
the response as `hesabatlar.xlsx` through a temporary object URL without navigating
away. The export button prevents duplicate requests and shows its loading state.
Focused ESLint, full operator lint, the operator production build, and
`git diff --check` pass; full lint reports only the existing TanStack Table React
Compiler compatibility warning.
# Task: Make application confirmation service details dynamic

- [x] Add a cached TanStack Query hook for a single permit service.
- [x] Prefetch the selected permit service when the apply page loads.
- [x] Render the service name and review duration dynamically in confirmation.
- [x] Run focused lint, TypeScript, build, and diff verification.

## Review

The apply page now starts a cached single-service TanStack Query as soon as its
permit service ID is available and passes the returned `name` and
`review_duration_days` into the confirmation step. The confirmation UI contains no
service-specific hardcoded fallback and introduces no step-level loading state.
Focused ESLint, TypeScript, and `git diff --check` pass. Full lint remains blocked by
the pre-existing raw applications anchor in `Navbar.tsx`; the production build is
blocked only by restricted access to the Google Fonts DM Sans endpoint.
# Task: Prevent duplicate confirmation participants

- [x] Exclude users selected for other confirmation roles from each participant dropdown.
- [x] Preserve the current role's selected user in its own dropdown.
- [x] Run focused lint, operator build, and diff verification.

## Review

Each confirmation-role dropdown now excludes candidates already selected in another
role while retaining its own current selection. Focused ESLint, full operator lint,
the operator production build, and `git diff --check` pass; full lint reports only
the existing TanStack Table React Compiler compatibility warning.

# Task: Make success-step permit name dynamic

- [x] Pass the already-loaded permit-service name into `SuccessStep`.
- [x] Replace the hardcoded permit type with the dynamic service name.
- [x] Run focused lint, web TypeScript/build, and diff verification.
- [x] Document the result in this task's Review section.

## Review

`SuccessStep` now receives the already-loaded permit-service `name` from the apply
page and renders it instead of the service-specific `PERMIT_TYPE` constant. Focused
ESLint, TypeScript, and `git diff --check` pass. Full web lint remains blocked by the
pre-existing raw applications anchor in `Navbar.tsx` (and reports the existing
unused `idSeries` warning); the production build remains blocked only by restricted
access to the Google Fonts DM Sans endpoint.

# Task: Make draft-step permit name dynamic

- [x] Pass the already-loaded permit-service name into `ToDraftStep`.
- [x] Replace the hardcoded permit type with the dynamic service name.
- [x] Run focused lint, web TypeScript/build, and diff verification.
- [x] Document the result in this task's Review section.

## Review

`ToDraftStep` now receives the same already-loaded permit-service `name` used by the
confirmation and success views, and its service-specific `PERMIT_TYPE` constant was
removed. Focused ESLint, TypeScript, and `git diff --check` pass. Full web lint remains
blocked by the pre-existing raw applications anchor in `Navbar.tsx` (and reports the
existing unused `idSeries` warning); the production build remains blocked only by
restricted access to the Google Fonts DM Sans endpoint.

# Task: Compose creation-error links with buttons

- [x] Wrap both recovery links with the shared `Button` using `asChild`.
- [x] Render the drafts action as primary and applications as outline.
- [x] Preserve the user's latest error-card layout and spacing.
- [x] Run focused lint, web TypeScript/build, and diff verification.
- [x] Document the result in this task's Review section.

## Review

Both creation-error navigation actions retain Next.js `Link` semantics and are now
composed through the shared `Button` with `asChild`. “Qaralamalara bax” uses the
primary style, while “Müraciətlər” uses the outline variant; the user's responsive
grid and card spacing are preserved. Focused ESLint, TypeScript, and
`git diff --check` pass. Full web lint remains blocked by the pre-existing raw
applications anchor in `Navbar.tsx` (and reports the existing unused `idSeries`
warning); the production build remains blocked only by restricted Google Fonts
access for DM Sans.

# Task: Show apply creation error inside a step card

- [x] Match the creation-error layout to the existing apply-step containers.
- [x] Keep the error message and drafts action together inside the card.
- [x] Run focused lint, web TypeScript/build, and diff verification.
- [x] Document the result in this task's Review section.

## Review

The application-creation error now uses the same centered, bordered white card shell
as the other apply steps. Its accessible error message and full-width
“Qaralamalara bax” recovery action are grouped inside that card. Focused ESLint,
TypeScript, and `git diff --check` pass. Full web lint remains blocked by the
pre-existing raw applications anchor in `Navbar.tsx` (and reports the existing
unused `idSeries` warning); the production build remains blocked only by restricted
access to the Google Fonts DM Sans endpoint.
# Task: myGov texniki-konseptual PDF

- [x] Kod və rəsmi mənbələr əsasında təhlili tamamla.
- [x] 15 tələb üzrə Azərbaycan dilində məzmun, cədvəl və diaqramlar hazırla.
- [x] PDF ixracını və oxunaqlılığı yoxla.
- [x] Nəticələri sənədləşdir.

Ətraflı plan: `tasks/mygov-document-plan.md`.

## Review — myGov PDF

38 səhifəlik Azərbaycan dilli PDF, HTML mənbə və kod təhlili `docs/` daxilindədir.
Səhifə daşması yoxlanıldı, 7 səhifəyə vizual baxış keçirildi, PDF səhifə/font/keçid
strukturu təsdiqləndi. Mövcud imkanlar, rəsmi faktlar və nümunə API-lər ayrıldı.
Tətbiq kodu dəyişdirilmədi.
# Task: Install Tiptap simple-editor in operator app

- [x] Add Tiptap simple-editor only to `apps/operator` with pnpm.
- [x] Keep `apps/web` unchanged.
- [x] Verify the operator production build and record lint status.

## Review

The Tiptap CLI installed the simple-editor template and its dependencies into
`apps/operator` (162 source files). The operator build passes. Operator lint
currently reports 61 errors from generated Tiptap sources and one existing
warning; no web files were changed.
# Task: Replace permit-service notes with Tiptap editor

- [x] Replace the `NoteTextarea` fields in the permit-service manage form with a controlled Tiptap editor.
- [x] Invalidate the document-type list query after creating a document type.
- [x] Run focused lint, operator build, and diff verification.

## Review

The permit-service form keeps the service name as the existing `NoteTextarea`
and uses `TiptapNoteEditor` for legal basis, required documents, and
suspension/refusal basis. The editor preserves rich formatting by sending
`editor.getHTML()` to the form state and backend, with formatting, heading,
list, quote, code-block, rule, undo/redo, and clear-format controls.
`useCreateDocumentType` now invalidates the shared document-type list key after
updating the cache, so the selector refreshes from the backend. Focused lint,
the operator TypeScript/Vite build, and `git diff --check` pass.
# Task: Review project structure

- [x] Inspect repository boundaries, packages, and entry points.
- [x] Trace routing, layouts, feature modules, and API/data flow.
- [x] Review architectural consistency, maintainability, and React performance risks.
- [x] Run read-only verification and document prioritized findings.

## Review

The repository is a two-application pnpm monorepo: a Vite-based operator panel and
a Next.js citizen portal. Both apps have clear domain feature slices and centralized
HTTP/React Query layers, but shared contracts and infrastructure are duplicated.
The highest-priority findings are JS-readable bearer-token cookies, stale web auth
cookies after 401 responses, an inconsistent Docker API base URL, render-time token
cleanup in `ProtectedRoute`, and the 459-line/high-complexity citizen apply-flow
orchestrator. The operator router also lacks a 404/error fallback and eagerly imports
all pages. There are no automated tests or visible CI workflow. Static graph and
configuration inspection completed; `pnpm lint` and `pnpm build` could not start
because the local `pnpm` executable hung even for `pnpm --version`, so the processes
were stopped without attributing that runner issue to the codebase.
# Task: Choose applicant type before starting an application

- [x] Model the `/api/me` VÖEN response shape in the auth types.
- [x] Redirect unauthenticated applicants directly to login.
- [x] Intercept the permission summary apply action and detect mixed representative types.
- [x] Implement the Figma applicant-type dialog with existing shadcn primitives.
- [x] Route physical applications normally and legal applications with `?type=legal`.
- [x] Run focused lint, web build/type verification, and visual/diff verification.

## Review

The permission summary redirects unauthenticated users directly to `/login`, then
reads the authenticated user's typed VÖEN records before
starting an application. Uniform representative flags route directly (physical by
default/flag `0`, legal for flag `1`); mixed flags open the Figma-matched shadcn
dialog with legal selected initially. Continuing routes to `/applications/:id` for
physical applicants and `/applications/:id?type=legal` for legal applicants. Web
TypeScript and `git diff --check` pass. Focused ESLint is blocked by the existing
missing `eslint-plugin-import` installation, while the production build is blocked
only by restricted access to the Google Fonts DM Sans endpoint. Visual values were
checked against the 500x445 Figma node; browser capture was unavailable because the
local browser automation dependency is not installed.
# Task: Add legal-entity application first step

- [x] Pass `?type=legal` through the App Router boundary and create a legal draft.
- [x] Add typed legal-entity fields and VÖEN/legal-address update API calls.
- [x] Build the Figma-matched legal-entity step using eligible `/api/me` VÖEN records.
- [x] Populate protected company/director fields after VÖEN selection and save the legal address.
- [x] Integrate new/existing legal drafts into the current step flow.
- [x] Run focused TypeScript, lint/build attempts, and diff verification.

## Review

`?type=legal` now creates the initial draft with `applicant_type: "legal"` and
opens a dedicated legal-entity first step. The step filters the authenticated
profile to `is_legal_representative === 1`, renders those companies through the
existing shadcn radio-card pattern, and sends the selected VÖEN to the application
PUT endpoint. The partial response is safely merged into application state and
fills the protected company/VÖEN/director fields, including `director_father_name`.
The legal address remains editable and is saved before advancing to the existing
contact step. Existing legal drafts resume at this step when required data is
incomplete. The unneeded alternative-VÖEN action and organizational-form field are
not rendered. Focused TypeScript and `git diff --check` pass. ESLint cannot start
because the current install lacks `eslint-plugin-import`; the production build is
blocked only by restricted Google Fonts DM Sans access.
# Task: Replace documents during the initial application

- [x] Preserve the uploaded backend file record in the initial document-step state.
- [x] Enable the replace action whenever an uploaded document has a backend file ID.
- [x] Route initial replacements through the existing file-specific endpoint.
- [x] Run focused TypeScript and diff verification; attempt full lint and build.

## Review

The initial upload now keeps the backend file ID and returned metadata in the
document-step state. As soon as that ID exists, the upload card exposes its replace
action and sends the new file through the existing file-specific replacement API.
Focused TypeScript and changed-source diff checks pass. Full lint cannot start because
the current install lacks `eslint-plugin-import`; the production build is blocked by
restricted Google Fonts DM Sans access. The repository-wide diff check only reports
pre-existing trailing whitespace in the edited legal-application guide.
# Task: Show all application history notes in a table

- [x] Replace the executors summary with a shadcn table for status-history notes.
- [x] Show each note author's role, full name, date, and note from the same history entry.
- [x] Run operator lint, build, and diff verification.

## Review

`ApplicationExecutorsContainer` now uses the existing shadcn table primitives and
renders every non-empty status-history note with its author's full name, creation
date, and note. The history author is matched to `assignees` so its specific
`assignment_role_label` is preferred; other authors use the localized role from
`status_histories[].changed_by.role`. Missing metadata uses a visible dash fallback,
and an empty-state row is shown when the application has no notes. Focused ESLint,
the operator TypeScript/Vite production build, and targeted diff checks pass. Full
operator lint remains blocked by pre-existing Tiptap React Compiler errors.
# Task: Scope permit-service documents by applicant type

- [x] Model per-document applicant types in permit-service responses and form state.
- [x] Add a shadcn applicant-type selector beside every selected document.
- [x] Hydrate edit values from pivot metadata and serialize create/update payloads.
- [x] Run focused lint, TypeScript/build, and targeted diff verification.

## Review

Every selected permit-service document now has a shadcn dropdown for both applicant
types, legal-only, or physical-only. The form keeps the per-document map synchronized
while selecting, removing, and reordering documents; edit mode hydrates it from
`documentTypes[].pivot.applicant_type` (with snake-case response compatibility).
Create and update FormData include matching `document_type_applicant_types[id]`
entries. Focused ESLint, TypeScript, the operator production build, and targeted
diff checks pass.
# Task: Add PS-001 trade-detail editing and document preview

- [x] Model the PS-001 trade-detail response and application API operations.
- [x] Add the conditional read/edit UI and authenticated PDF preview flow.
- [x] Refresh an open preview after a successful edit without refetching the detail endpoint.
- [x] Run operator lint, build, and targeted diff verification.

## Review

PS-001 application details now expose the operation type and only the fields relevant
to that operation. During `payment_review`, operators can edit the four supported
text values; only changed values are sent, and the PUT response updates the React
Query cache directly. The authenticated PDF preview opens in a dialog, cleans up its
Blob URL, supports retry, and reloads automatically after a successful edit. Focused
ESLint, TypeScript, the operator production build, and `git diff --check` pass. Full
lint remains blocked by the existing 62 Tiptap/shared-hook errors and one existing
TanStack Table warning. The pnpm command wrapper also reports its pre-existing
`unable to open database file` environment error, so verification used the app's
installed ESLint, TypeScript, and Vite binaries directly.
# Task: Support payment-free permit services in the operator flow

- [x] Model the `requires_payment` permit-service flag.
- [x] Skip payment-sequence creation and show the direct signature action.
- [x] Remove the payment step from payment-free application progress.
- [x] Run focused lint, TypeScript, production build, and diff verification.

## Review

Permit-service metadata now models `requires_payment`. A completed report on an
assigned payment-free application no longer opens the payment confirmation-sequence
form; eligible executors instead receive an “İmzaya göndər” action backed by the
existing `confirm-payment-received` mutation. The payment step is omitted from that
application's progress indicator while paid-service behavior remains unchanged; a
missing flag safely retains the paid flow. Focused ESLint, TypeScript, the operator
production build, and `git diff --check` pass. Vite reports only the existing large
bundle-size advisory.
# Task: Build ordered confirmation participant editor

- [x] Replace fixed role selects with searchable candidate and role controls.
- [x] Add an ordered participant table with same-role reordering and removal.
- [x] Preserve table order exactly in the submitted participants payload.
- [x] Match the supplied visual layout and verify lint, TypeScript, build, and diff.

## Review

The confirmation form now uses a searchable candidate picker that exposes each
person's department and translated position, a separate role selector, and an add
action. Added participants render in a responsive execution table with accessible
same-role move controls and removal. Role groups remain in Visa → Signature →
Approval order, while moves preserve the meaningful order inside each role; the POST
payload maps the table array without reordering. Each required role must still have
at least one participant. Focused ESLint, TypeScript, the operator production build,
and `git diff --check` pass. The supplied reference PNG remains an untracked user
asset and was not modified.
# Task: Show confirmation approval API errors

- [x] Read approval errors from the Axios response and preserve a fallback message.
- [x] Apply the behavior to both confirmation approval entry points and verify it.

## Review

Confirmation participant approval errors now extract the backend `message` from an
Axios response and fall back to the existing generic Azerbaijani error when the
response is unavailable or malformed. The shared helper is used by both the queue
card and the application-detail confirmation history. Focused ESLint, TypeScript,
and `git diff --check` pass.
# Əlaqə ayarları — operator və web

- [x] Bələdçinin API müqaviləsini və mövcud API/routing/sidebar/UI pattern-lərini yoxla
- [x] Web üçün ictimai əlaqə ayarları API modulunu əlavə et və footer-i dinamik məlumatlarla göstər
- [x] Operator üçün əlaqə ayarları types/API/hooks qatını əlavə et
- [x] Super-admin qorunan “Əlaqə Ayarları” səhifəsini, dinamik sosial şəbəkə sahələrini və validasiyanı hazırla
- [x] Route, sidebar və breadcrumb inteqrasiyasını tamamla
- [x] React best-practices yoxlaması, lint və build icra et

## Review

- Public footer `GET /contact-settings` cavabındakı mövcud əlaqə sahələrini və sərbəst
  sosial platformaları göstərir; tanınan platformalar uyğun ikon xəritəsindən, qalanları
  ümumi ikon fallback-indən istifadə edir.
- Operator səhifəsi `GET/PUT /admin/contact-settings` ilə işləyən tək-kart formasıdır.
  Boş/null ilkin dəyərlər dəstəklənir, sosial sətirlər dinamikdir, dublikat platforma və
  etibarsız URL-lər saxlanmadan öncə bloklanır, backend mesajı toast-da göstərilir.
- Səhifə sidebar və route səviyyəsində yalnız `super_admin` üçün açıqdır.
- Dəyişdirilən faylların focused ESLint və hər iki tətbiqin TypeScript yoxlaması keçir.
  Operator production build keçir. Tam operator lint yalnız əvvəlcədən mövcud Tiptap
  qayda xətalarında, web lint mövcud Navbar anchor xətasında, web build isə Google Fonts
  şəbəkə çıxışında dayanır.

# Əlaqə ayarları section və platforma seçimi

- [x] Operator formasını ayrıca əlaqə və sosial şəbəkə section komponentlərinə ayır
- [x] Platforma inputunu verilmiş platformalarla Select komponentinə dəyiş
- [x] Web footer üçün platformalara uyğun brend ikonları əlavə et
- [x] Focused lint, TypeScript, build və diff yoxlamalarını icra et

## Review

- Əlaqə məlumatları və sosial linklər ayrıca section komponentlərinə çıxarıldı; səhifə
  yalnız form state-i, validasiya və yadda saxlama əməliyyatını orkestrasiya edir.
- Platforma sahəsi Facebook, İnstagram, YouTube, WhatsApp, TikTok, Telegram və
  X (formerly Twitter) seçimli Select-dir. Mövcud legacy açarlar redaktə zamanı itmir.
- Footer paketdən asılı olmayan lokal SVG brend ikonları ilə həmin açarları göstərir,
  naməlum açarlar üçün Globe fallback-i saxlanılır.
- Hər iki tətbiqdə focused ESLint və TypeScript, operator production build və
  `git diff --check` keçir. Web build yalnız mövcud Google Fonts şəbəkə çıxışında dayanır.

# Sosial link cədvəli və əlavə etmə dialogu

- [x] LinkedIn-i operator platforma seçimlərinə və web ikon xəritəsinə əlavə et
- [x] Sosial linkləri cədvəl formasında göstər
- [x] Yeni link üçün platforma və keçid sahəli dialog əlavə et
- [x] Dialog yadda saxlananda əlaqə kartını yenilə və TanStack Query-ni invalidate et
- [x] Focused lint, TypeScript və diff yoxlamalarını icra et

## Review

- Sosial linklər platforma, kliklənən URL və silmə əməliyyatı olan cədvəldə göstərilir.
- Əlavə etmə dialogunda artıq istifadə olunan platformalar deaktivdir; URL və dublikat
  platforma validasiyasından sonra tək əlaqə kartı PUT sorğusu ilə saxlanır.
- Uğurlu mutation cavabı cədvəli dərhal yeniləyir və `contactSettingsQueryKey`
  invalidate edilərək məlumat backend-dən təkrar çəkilir.
- LinkedIn həm Select seçimində, həm də web footer-in lokal SVG ikon xəritəsindədir.
- Focused ESLint, hər iki tətbiqin TypeScript yoxlaması, operator production build və
  `git diff --check` keçir; web build yalnız mövcud Google Fonts şəbəkə çıxışında dayanır.
