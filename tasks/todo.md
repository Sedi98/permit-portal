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
