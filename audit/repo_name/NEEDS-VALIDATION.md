# Needs validation

This section contains source-grounded leads retained in the coverage ledger. They are not confirmed findings because bounded local/runtime evidence and backend/deployment evidence were unavailable. The final record review was performed sequentially within the available agent limit. Do not probe production or deployed endpoints; use the owner-observed and local plans below.

## web-query-token-session-fixation

- Trace: `apps/web/app-pages/login/index.tsx:31-66` → `apps/web/features/auth/cookies.ts:11-15` → `apps/web/features/http.ts:14-34` → `apps/web/features/auth/api.ts:13-16`.
- Boundary/result: a non-empty `/login?token=` value is copied into a browser-readable bearer-token cookie and attached to later API requests. This could permit login CSRF/session fixation if an attacker can obtain a valid usable token.
- Blockers: backend token issuance, state/PKCE binding, audience/issuer, expiry, one-time use, and deployment URL/referrer/log behavior are not in this repository.
- Validation plan: locally use a dummy backend fixture to issue attacker and victim tokens and test whether an unbound callback token establishes a session; owner-observe MyGov callback state, token claims, replay behavior, and referrer policy in a non-production environment.

## operator-stale-auth-me-query-role-guard

- Trace: `apps/operator/src/pages/login/index.tsx:33-40` → `apps/operator/src/features/auth/hooks.ts:6-16` → `apps/operator/src/components/ProtectedRoute.tsx:11-31` → `apps/operator/src/app/router.tsx:156-185`.
- Boundary/result: callback login writes a token without an explicit auth/me query invalidation; a stale cached role may influence client route rendering after a token replacement.
- Blockers: whether the stale cache is reachable in the deployed lifecycle and whether backend role checks prevent data/mutation access are unknown.
- Validation plan: local dummy React/query fixture with two principals and a token replacement; owner-observe backend role enforcement on formalization, user, permit-service, FAQ, and contact endpoints.

## operator-admin-resource-authorization-server-enforcement-unavailable

- Trace: `apps/operator/src/app/router.tsx:94-188` → `apps/operator/src/components/ProtectedRoute.tsx:10-31` → `apps/operator/src/pages/(dashboard)/applications/manage/index.tsx:121-140` → `apps/operator/src/features/applications/api.ts:18-123` and related confirmation/visa/sign/payment APIs.
- Boundary/result: caller-controlled IDs and payloads reach privileged application, document, workflow, payment, signing, and confirmation operations. Client checks are not authoritative.
- Blockers: backend role, department, assignee, workflow, and resource authorization are absent from this repository.
- Validation plan: local dummy backend matrix for each endpoint with lower role, wrong department, wrong assignee, and unrelated resource IDs; owner-observe API authorization logs/tests without live probing.

## operator-user-privilege-change-server-enforcement-unavailable

- Trace: `apps/operator/src/app/router.tsx:177-180` → `apps/operator/src/features/users/api.ts:10-27` → `apps/operator/src/pages/(dashboard)/users/manage/index.tsx:44-84` and `users/new/index.tsx:21-54`.
- Boundary/result: target user IDs and role/department/active-state payloads are client-controlled; UI-only super-admin and self-change restrictions are visible.
- Blockers: backend authorization and role-transition invariants are unavailable.
- Validation plan: local dummy backend requests as each role against another user and self; owner-observe server policy for role, department, activation, and self-modification transitions.

## citizen-application-document-idor-backend-enforcement

- Trace: `apps/web/features/http.ts:14-34` → `apps/web/features/apply/api.ts:80-215` and `apps/web/features/applications/api.ts:25-50`.
- Boundary/result: authenticated bearer requests use caller-controlled application/document/file IDs for reads, updates, uploads, submit/resubmit, payment, ratings, and downloads.
- Blockers: backend ownership and document-parent checks are unavailable.
- Validation plan: local two-principal dummy backend fixture using cross-principal application and document IDs; owner-observe authorization tests for every application/document endpoint.

## stored-rich-text-to-public-dangerouslySetInnerHTML

- Trace: `apps/operator/src/components/tiptap-note-editor.tsx:48-76` → `apps/operator/src/features/permit-services/api.ts:17-47` → `apps/web/app-pages/permission/detail/index.tsx:18-31` → `apps/web/app-pages/permission/detail/sections/PermissionInfoSection.tsx:19-22`.
- Boundary/result: operator-authored rich-text HTML is persisted and later rendered through `dangerouslySetInnerHTML` on a public page.
- Blockers: backend sanitization, write authorization, and actual browser rendering behavior are not source-visible.
- Validation plan: local dummy backend plus browser fixture with a non-destructive marker payload, checking stored output and rendered DOM; owner-observe sanitizer policy and super-admin authorization at the API.

## faq-text-to-raw-jsonld-script

- Trace: `apps/operator/src/pages/(dashboard)/faqs/faq-form-dialog.tsx:39-90` → `apps/operator/src/features/faqs/api.ts:10-25` → `apps/web/app-pages/home/sections/Faq.tsx:11-33,83-87`.
- Boundary/result: persisted FAQ strings are inserted into a JSON-LD script via `dangerouslySetInnerHTML` using `JSON.stringify`, without source-visible script-terminator escaping.
- Blockers: backend filtering and browser parsing of script-terminator input are unavailable.
- Validation plan: local fixture with a harmless script-context marker and browser parser inspection; owner-observe stored FAQ validation and generated HTML policy.

## upload-client-only-file-validation-and-size-limit

- Trace: `apps/web/components/document-upload-item.tsx:isPdf` → `documents-step.tsx:onUpload` → `apps/web/features/apply/api.ts:uploadApplicationFile` → `apps/web/features/http.ts:PostApi/Http.post`.
- Boundary/result: browser MIME/name and client size checks precede multipart upload; server signature checks, authoritative limits, quotas, ownership, and parser limits are not visible.
- Blockers: backend validation, storage quotas, proxy limits, and downstream parser behavior.
- Validation plan: local dummy upload endpoint with mismatched MIME/magic bytes and bounded oversize fixtures; owner-observe server/proxy limits and parser isolation.

## operator-http-runtime-controls

- Trace: `docker-compose.yml:operator.ports` → `apps/operator/Dockerfile:EXPOSE 80` → `apps/operator/nginx.conf:listen 80,location /`.
- Boundary/result: source-defined runtime accepts HTTP and defines no TLS, HSTS, CSP, frame, MIME, or referrer headers.
- Blockers: external TLS termination and authoritative proxy/header policy are not in the repository.
- Validation plan: owner-observe deployment ingress and response headers in a controlled staging environment; do not probe production from this audit.

## citizen-draft-creation-replay-no-idempotency

- Trace: `apps/web/app-pages/apply/index.tsx:239-313,381-413` → `apps/web/features/apply/api.ts:107-118`.
- Boundary/result: in-memory creation guards do not survive reloads or partial failures, and no server idempotency key is visible for automatic draft creation.
- Blockers: backend deduplication/uniqueness behavior is unavailable.
- Validation plan: local dummy backend that fails after create and repeats the bounded client lifecycle; owner-observe whether the API reuses drafts or enforces idempotency.

## citizen-payment-submit-resubmit-replay

- Trace: `apps/web/app-pages/apply/index.tsx:611-634` → `apps/web/features/apply/api.ts:197-215` and application detail actions.
- Boundary/result: payment, submit, and resubmit requests have no visible idempotency key; UI pending state does not constrain direct or replayed requests.
- Blockers: backend transition and duplicate-payment enforcement are unavailable.
- Validation plan: local dummy backend with repeated bounded requests at each status; owner-observe payment-provider idempotency and server state-machine rules.

## citizen-rating-ownership-and-replay-server-enforcement-unavailable

- Trace: `apps/web/app-pages/apply/index.tsx:636-650` → `apps/web/features/apply/api.ts:217-231`.
- Boundary/result: application ID, rating, and comment are sent to the rating endpoint without client ownership, completion-state, or duplicate guards.
- Blockers: backend ownership, eligibility, and duplicate-rating enforcement are unavailable.
- Validation plan: local two-principal fixture testing unrelated application IDs and repeated ratings; owner-observe API policy for eligibility and duplicate semantics.

## notification-direct-document-download-authorization

- Trace: `apps/web/app-pages/notifications/index.tsx:90-91` → `apps/web/app-pages/notifications/sections/NotificationDialog.tsx:184` → `apps/web/features/applications/api.ts:42-47`.
- Boundary/result: notification-provided application/document IDs flow into a direct download path that bypasses the Axios bearer interceptor; backend document authorization is not source-visible.
- Blockers: authentication propagation, notification ownership, application/document relationship, and download authorization are deployment/backend facts.
- Validation plan: local authenticated blob-request fixture; owner-observe authorization for unrelated notification and document IDs in staging.

## Run-level blockers

- Fresh runtime validation was not possible under the Windows sandbox and no-network policy. Sequential source verification completed; these leads remain unconfirmed and are retained in the ledger and this document.
- The skill validators could not read the ledger on this Windows host because OS no-follow/nonblocking input protection is unavailable. Re-run `validate-findings.cjs` and `validate-coverage-ledger.cjs` on a platform that supports those protections before treating the artifacts as complete.
