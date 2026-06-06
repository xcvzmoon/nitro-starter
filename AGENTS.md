This project is based on [Nitro v3](https://nitro.build), [h3](https://h3.dev/), and [Rolldown](https://rolldown.rs/).

Refer to `node_modules/nitro/dist/docs/README.md` when working on server (your knowledge about Nitro v3 is likely outdated!).

## Project Structure

`server/` contains server-side code with supported subdirs (create as needed): `api/` (/api prefixed handlers), `routes/` (non-prefixed route handlers), `middleware/`, `plugins/`, `utils/`, `assets/`, and `tasks/`. `public/` holds static assets (copied, not bundled). Config files: `nitro.config.ts` (serverDir, routeRules, preset, etc.), `tsconfig.json`.

## Conventions

- Path alias `~/*` (tsconfig)

## Database Script Policy

- Do not execute database-related scripts or commands in this repository.
- This includes `db:generate`, `db:push`, `db:pull`, `db:studio`, and `db:check`.
- Treat database commands as reference-only; the user is the only one who should run them.

## Formatting And Style

- Use `oxfmt` formatting.
- Use single quotes and semicolons.
- Keep trailing commas where the formatter wants them.
- Match the surrounding file’s formatting instead of hand-styling custom layouts.
- Prefer `function name()` for named functions and helpers.
- Do not prefer `const fn = () => {}` for normal top-level helpers.
- Exception: callbacks should stay as arrows, for example `items.map((item) => item.id)`.
- Prefer functions over classes.
- Existing classes that are already correct can stay; do not rewrite them for style only.
- Prefer current Bun/Nitro-compatible APIs and syntax over outdated Node-only patterns.
- Keep diffs small and focused.

## Types And Naming

- Prefer `type` over `interface`.
- Avoid `any`; prefer `unknown` and narrow it explicitly.
- Add explicit return types to exported functions and non-trivial helpers.
- Use string literal unions for small state enums like `'ok' | 'error'`.
- Keep generics minimal and purposeful.
- Reuse existing helper types before inventing new ones.
- Use descriptive names.
- Do not abbreviate iterable items; prefer `item`, `entry`, `record`, `status`.
- Avoid one-letter names except for conventional indexes.

## Validation, Errors, And Responses

- Use Zod for environment parsing and request validation.
- Prefer coercion helpers like `z.coerce.number()` and `z.stringbool()` for env values.
- Validate once at the boundary, not repeatedly in inner layers.
- Never throw raw strings.
- Catch infrastructure errors where graceful degradation is expected.
- Clean up temporary resources in `finally` blocks.
- Include stable error codes in config validation and app-level failures.

## Editing Guidance

- Make the smallest correct change.
- Do not polish unrelated code.
- Do not remove correct comments or documentation.
- Do not rename broad parts of the codebase unless required.
- Do not expand a change into a repo-wide refactor unless necessary.
- Prefer leaving correct existing code in place.
- When touching production-sensitive code, prioritize reliability over clever abstractions.

## Before Finishing

- Run `pnpm run fmt` if you changed formatting significantly.
- Run `pnpm run lint` or at least targeted `oxlint` on touched files.
- Run targeted tests when tests exist.
- For runtime-sensitive changes, prefer a narrow smoke check over broad refactors.
- If you changed build or runtime behavior, ensure `pnpm run build` still works.
