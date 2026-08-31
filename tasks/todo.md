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
