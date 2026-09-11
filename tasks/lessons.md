# Lessons

- When documenting Docker setup, state the exact project-relative env filenames and distinguish container ports from host URLs instead of relying on implicit Compose knowledge.
- Place page-level skeleton components under the dedicated `components/skeletons` directory so loading placeholders remain organized and reusable.
- Do not expose a destructive table action unless the backend contract provides a corresponding operation; hiding it after a local-only state change avoids promising persistence the API cannot perform.
- Before mapping social-network names to icon components, verify the installed icon package's actual exports; Lucide intentionally does not provide common brand icons, so use available semantic icons or project-owned brand assets instead of assuming brand exports exist.
- When an overflow bug is caused by absolutely positioned editor UI, apply the containing-block position to the exact page-level ancestor requested by the user; a nearer field wrapper may not contain the element that creates the overflow.
- When an approval endpoint returns a user-actionable sequencing error, surface the backend `message` in every UI entry point that calls that endpoint and retain a generic fallback for malformed or unavailable responses.
- Before directly routing a single-type permit, verify that the authenticated profile has the matching applicant capability; block incompatible legal/physical combinations with user-visible feedback.
- When an application action depends on authenticated profile metadata, handle the unauthenticated state at the initiating control and redirect directly to login before evaluating profile-derived routing.
- When a confirmation screen repeats permit-service metadata, source its name and review duration from the selected service response instead of embedding values from one example service; start the query at the parent page so later steps render without a loading transition.
- When a user identifies a workflow-history record by a specific transition field, select that exact field/value and derive all displayed metadata from the same record; do not substitute a broader destination-status heuristic.
- When the user specifies a sidebar position, place the new item at that exact point in the existing navigation order rather than appending it near other administrative pages.
- When adding a history page for an existing document workflow, place it under the explicitly requested existing sidebar group instead of creating a new top-level navigation group.
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
- When a user explicitly restores a related-resource request, retain the list payload for notification content and fetch the related entity only for its application-specific details.
- For an in-dialog request that can visibly take time, use an accessible spinner rather than text alone when the user asks for loading feedback.
- When a search input presents a search icon, make that icon an accessible submit control and preserve a local result filter when backend search behavior is uncertain.
- When a backend list response can contain nullable display fields despite its declared type, correct the boundary type and guard client-side string operations before filtering.
- When a status should be informational only, remove both its row navigation action and the route condition that would hydrate it as an editable existing application.
- For toggled inline content, keep the container mounted and animate its height so opening and closing are both visible; keep the control icon separate from the content decoration.
- When replacing a conventional file control with an icon picker, start from a compact 4rem click target and scale the preview icon proportionally; enlarge only when the design explicitly requires it.
- When a page combines shared textarea labels with shadcn labels, explicitly align both to the established dashboard label token instead of relying on their differing component defaults.
- When a workflow view is conceptually a distinct application step, implement it as a dedicated component under the established `apply/steps` structure instead of embedding its full UI in a generic detail page.
- When a UI request names a specific container (for example, the document `article` card), apply state styling to that exact structural element rather than its nested upload control.
- When refining rejected-document cards, keep only the metadata explicitly requested by the user; do not retain redundant status or file-action rows.
- Treat the progress stepper as a passive indicator unless the user explicitly requests changing it; enforce skipped-step rules in workflow state and navigation controls.
- For revision workflows, a successful rejected-file replacement must switch the final action from initial submit to the dedicated resubmit endpoint; do not reuse the creation submit action.
- Workflow decisions that must survive refresh must derive from backend-persisted state (such as `awaiting_revision`), not transient React state set during the current session.
- When the user asks to compare consecutive API responses in the console, log every named request separately before changing how either response is consumed.
- When permit-service metadata is shared across apply-flow summary screens, audit every terminal branch (including success and saved-draft views) and pass the already-loaded service data through props instead of leaving service-specific constants behind.
- When an apply-flow error replaces the current step, render its message and recovery action inside the same card shell as the other steps instead of leaving them as uncontained page-level content.
- When navigation must look like a design-system button, compose the existing `Button` with `asChild` around `Link`; preserve link semantics and use Button variants instead of duplicating button classes on anchors.
- When creating a document type from the permit-service selector, invalidate and refresh the document-type query only; do not automatically add the newly created type to the permit's selected IDs unless explicitly requested.
- When a dialog form is rendered inside a page form, stop submit propagation on the inner form so dialog actions cannot submit the parent entity form.
- When application history authors arrive under `status_histories[].changed_by`, read their role from that exact object; for executor-specific titles, match the author ID against `assignees[].user_id` and prefer `assignment_role_label`.
- When an application detail must show both assignees and workflow notes, keep them as two distinct tables: map `assignees` into the upper executor table and `status_histories` into the lower notes table.
# Application applicant-type support

- When adding a new applicant type, audit every downstream review and confirmation
  view, including values derived in the parent before props are passed. Generic child
  props such as `applicantName` can still receive physical-only derived data.
