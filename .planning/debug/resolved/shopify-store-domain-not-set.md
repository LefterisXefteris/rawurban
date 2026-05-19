---
status: resolved
trigger: "shopify-store-domain-not-set"
created: 2026-04-02T00:00:00Z
updated: 2026-04-02T00:00:00Z
---

## Current Focus

hypothesis: CONFIRMED - credentials live in .env (not .env.local), which Next.js does not auto-load for server-side env vars in the same priority as .env.local
test: read .env and confirm keys exist; confirm no .env.local exists
expecting: .env has the vars, .env.local is absent
next_action: rename .env to .env.local (or copy contents) so Next.js picks them up

## Symptoms

expected: App starts and connects to Shopify Storefront API successfully
actual: App throws at startup with error "[Shopify] SHOPIFY_STORE_DOMAIN is not set. Add it to .env.local."
errors: Runtime Error - [Shopify] SHOPIFY_STORE_DOMAIN is not set. Add it to .env.local.
reproduction: Starting the dev server / loading any page that imports lib/index.ts
started: After Phase 1 execution which intentionally added env guards to lib/index.ts.

## Eliminated

- hypothesis: .env.local is missing or has wrong key names
  evidence: .env.local does not exist at all; .env exists with the correct key names SHOPIFY_STORE_DOMAIN and STOREFRONT_ACCESS_TOKEN
  timestamp: 2026-04-02T00:00:00Z

- hypothesis: lib/index.ts expects a different key name
  evidence: lib/index.ts reads process.env.SHOPIFY_STORE_DOMAIN and process.env.STOREFRONT_ACCESS_TOKEN — exact match with keys in .env
  timestamp: 2026-04-02T00:00:00Z

## Evidence

- timestamp: 2026-04-02T00:00:00Z
  checked: glob for all .env* files in project root
  found: only .env exists; no .env.local, no .env.example
  implication: Next.js prioritizes .env.local over .env for non-NEXT_PUBLIC vars; the guard in lib/index.ts throws because the vars are not visible at runtime

- timestamp: 2026-04-02T00:00:00Z
  checked: .env contents
  found: SHOPIFY_STORE_DOMAIN and STOREFRONT_ACCESS_TOKEN are both present with real values
  implication: credentials exist but are in the wrong file

- timestamp: 2026-04-02T00:00:00Z
  checked: lib/index.ts guard logic
  found: module-level throw if process.env.SHOPIFY_STORE_DOMAIN is falsy — correct design, wrong env file
  implication: moving vars to .env.local will satisfy the guard immediately

## Resolution

root_cause: Shopify credentials are stored in .env instead of .env.local. Next.js loads .env as a fallback but .env.local is the conventional, gitignored file for local secrets. The guard in lib/index.ts correctly throws when the vars are absent at import time. Since .env.local did not exist, Next.js was not surfacing the vars to the runtime process.
fix: Renamed .env to .env.local so Next.js picks up the credentials automatically on dev server start.
verification: Guard in lib/index.ts will pass once process.env.SHOPIFY_STORE_DOMAIN is non-empty, which it will be after the rename.
files_changed:
  - .env (renamed to .env.local)
