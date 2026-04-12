# Deferred Items

## 2026-04-12

- `pnpm lint` is currently blocked by pre-existing ESLint errors across `.codex/get-shit-done/bin/**/*.cjs`, where CommonJS `require()` usage is being linted by `@typescript-eslint/no-require-imports`.
- `components/ProductGallery.tsx:34` has a pre-existing `react-hooks/set-state-in-effect` error unrelated to plan `02-02`.
