# Security Review — permit-portal

## Run status

- **Status:** incomplete / partial source-only pass
- **Profile:** standard
- **Scope:** `apps/web`, `apps/operator`, deployment manifests, API documentation, package manifests and lockfile
- **Source ref:** `6e879399334e882817ff61cf53e65ad75c89e5a5`
- **Worktree:** clean
- **Output:** `C:\Microsoft Defender\permit-portal\audit\repo_name`
- **Execution policy:** sandboxed-source-and-local-only; no target code, build, browser, package install, live endpoint, or external service was run
- **Prior run:** none found

The run is incomplete because runtime/deployment validation and the required OS-isolated validator protections were unavailable on this Windows host. Candidate records were independently reviewed sequentially by the available agents and remain in `coverage-ledger.json` and `NEEDS-VALIDATION.md`; none was confirmed. The coverage and findings validators could not read files because their required OS no-follow/nonblocking protections are unavailable.

## Security posture summary

The repository is a browser-heavy permit platform with a public citizen portal and a privileged operator dashboard. Authentication tokens are readable by page JavaScript and are accepted from login callback query parameters. Role and ownership decisions are primarily represented in frontend code, while the backend that must enforce them is outside the repository. Several stored-content paths terminate in raw HTML/script contexts, and deployment manifests do not define TLS or browser security headers. These are important source-grounded leads, but the decisive backend/deployment facts require controlled validation.

## Confirmed findings

None. No candidate met the required independent-verification and bounded-observation bar during this run.

## Needs validation leads

| Fingerprint | Boundary | Why validation is required |
|---|---|---|
| `web-query-token-session-fixation` | URL callback → bearer cookie/session | Backend token binding, replay, and deployment leakage are absent. |
| `operator-stale-auth-me-query-role-guard` | token replacement → cached role gate | Backend authorization and cache lifecycle are absent. |
| `operator-admin-resource-authorization-server-enforcement-unavailable` | operator IDs → admin resources | Backend role/department/assignment enforcement is absent. |
| `operator-user-privilege-change-server-enforcement-unavailable` | operator payload → admin principals | Backend privilege-transition enforcement is absent. |
| `citizen-application-document-idor-backend-enforcement` | citizen IDs → applications/documents | Backend ownership checks are absent. |
| `stored-rich-text-to-public-dangerouslySetInnerHTML` | operator HTML → public DOM | Backend sanitizer and rendering behavior are absent. |
| `faq-text-to-raw-jsonld-script` | FAQ text → JSON-LD script | Script-context filtering and browser parsing are absent. |
| `upload-client-only-file-validation-and-size-limit` | browser file → storage/parser | Server validation, quotas, and parser limits are absent. |
| `operator-http-runtime-controls` | network → Nginx operator runtime | External TLS/header policy is absent. |
| `citizen-draft-creation-replay-no-idempotency` | client lifecycle → draft creation | Backend deduplication is absent. |
| `citizen-payment-submit-resubmit-replay` | replayed request → payment/workflow | Backend idempotency and state machine are absent. |
| `citizen-rating-ownership-and-replay-server-enforcement-unavailable` | citizen rating → application record | Backend ownership/eligibility rules are absent. |
| `notification-direct-document-download-authorization` | notification IDs → document download | Authentication propagation and backend document authorization are absent. |

Full traces and safe validation plans are in `NEEDS-VALIDATION.md`.

## Hardening notes

- Prefer server-managed `HttpOnly; Secure; SameSite` sessions instead of JavaScript-readable bearer cookies where architecture permits.
- Replace callback token query acceptance with a server-side, state/PKCE-bound one-time exchange.
- Sanitize rich text at the final trusted rendering boundary and use script-context-safe JSON-LD serialization.
- Enforce role, department, assignee, ownership, workflow-state, upload, quota, and idempotency rules in backend decision points.
- Revoke blob URLs after downloads; the operator download helper currently leaves object URLs unreleased (`apps/operator/src/features/applications/hooks.ts:186-191`).
- Define TLS, HSTS, CSP, frame, MIME, and referrer policy at the authoritative ingress; harden container users, capabilities, filesystem, egress, image provenance, and artifact promotion.
- Keep environment files out of Docker build contexts unless they are verified non-secret and intentionally required.

## Positive source patterns

- Operator protected routes check token presence, call `/admin/me`, clear tokens on non-login 401, and apply explicit UI role gates.
- Login callback URLs are replaced after callback processing and token values are logged only as presence/boolean in the web flow.
- Editor URL handling restricts protocols and falls back to `#`.
- Citizen upload UI has PDF type/name and size checks as usability defenses.
- Download flows generally use authenticated Axios blob requests and temporary object URLs.

## Coverage

- Seeded coverage units: 10
- Covered: 0
- Candidate: 10
- Blocked: 0
- Deferred/out of scope: 0
- Hunter waves: 2
- Post-wave critic: completed; proposed gaps were covered by existing units
- Final-clean critic: completed; added the citizen workflow-integrity unit
- Independent candidate validation: completed sequentially as source-only decisions; runtime validation remains unavailable
- No clean-coverage claim is made
