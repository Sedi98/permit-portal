# Architecture and coverage summary

## Scope and posture

This standard-profile, source-only audit covers the permit-portal monorepo at commit `6e879399334e882817ff61cf53e65ad75c89e5a5`, with a clean worktree. The repository contains a public Next.js citizen portal (`apps/web`) and a React/Vite internal operator dashboard (`apps/operator`). Both call an external permit API; the backend implementation is not in this repository.

Principals are public/citizen applicants authenticated through MyGov, and operator users with `super_admin`, `executor`, `deputy_minister`, or `department_head` roles. Protected resources include permit applications, applicant data, uploaded documents, payment/status transitions, staff accounts, permit-service configuration, FAQs, and contact settings.

## Entry points and trust boundaries

Browser input enters through public and operator routes, query/deep-link IDs, forms, rich-text editors, file inputs, MyGov callback parameters, and environment-configured API calls. The strongest source-visible controls are browser-side bearer-token handling, React route guards and role gates, allowlisted status query values, editor URL protocol sanitization, and client-side upload checks. These are not authoritative server controls; ownership, role authorization, tenant/department scope, rate limits, CORS, TLS termination, and backend token validation are outside this repository.

The operator stores a bearer token in a JavaScript-readable `auth_token` cookie and injects it as an Authorization header. The web portal stores a MyGov token in JavaScript-readable cookies and similarly sends bearer headers. Both applications accept token query parameters on login callbacks. Operator role gates are implemented in `ProtectedRoute`; public application resource IDs are passed to API functions without client-side ownership checks.

Stored operator rich text is sent as multipart data and later rendered by the public portal with `dangerouslySetInnerHTML`. FAQ text is embedded into JSON-LD through `dangerouslySetInnerHTML`. Uploads and direct/downloaded documents form separate file and data-disclosure boundaries.

## Deployment and execution limits

Operator deploys as static Nginx on port 80; web runs as a Node/Next container on port 3000, with Compose exposing operator on 5050. Dockerfiles run package installation in build stages. The repository defines no CSP/security headers, TLS policy, CI workflow, container hardening, or backend implementation. The required OS-enforced no-network target sandbox and race-safe artifact-promotion controls are unavailable in this environment, so target-controlled builds/tests and live probing were not run. Runtime-dependent claims remain `needs_validation`.

## Comparable baseline

No meaningful source-grounded comparable implementation was identified.

## Companion selection

The review selects HTTP/authentication and browser-client guidance for token, redirect, cookie, and DOM flows; data-isolation guidance for caller-supplied application/document/user IDs; resource-exhaustion guidance for uploads and file handling; supply-chain guidance for lockfiles/build inputs; and cloud/deployment guidance for Docker, Nginx, Compose, and missing headers/runtime controls. Native/binary, AI/LLM, RPC/messaging, and desktop/mobile/IPC companions were not selected because no corresponding source-visible boundary was found.
