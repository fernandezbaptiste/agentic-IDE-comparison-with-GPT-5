# Tool Detail Pages + Comparison – Spec

## Goals
- Make each `tool` routable at `/landscape/<slug>`.
- Keep Landscape grid + popup/overlay unchanged.
- Add “View full details” link on the Landscape tool card (under the logo).
- Add a comparison section on the tool detail page (compare with tools in the same domain and category).

## Scope
- CMS: Make `tool` documents routable via a `pathname` field generated from `name`, under `/landscape/`.
- App: Add query + loader + page template to render a tool detail page.
- UI: Add “View full details” link on the tool card (grid/list), not replacing the existing overlay.
- Comparison: On the tool page, compare against peers in the same category (and thus domain).

## CMS Changes
- File: `sanity/schemas/documents/tool.ts`
- Convert to page document:
  - Replace `defineSchema` with `definePage`.
  - Add:
    - `pathnameOptions: { folder: {canUnlock: false}, source: "name", initialValue: "/landscape/" }`
  - Keep existing fields (name, description, publishedAt, image, link, tags, keywords, category, flags). Keep `domain` read-only/deprecated.
- Migration note: existing tools (when present) require a one-time `pathname` set in Studio.

## Data Layer
- File: `data/sanity/queries.ts`
  - Add:
    - `TOOL_QUERY`: fetch by `pathname.current` + `locale`, include `category->{..., domain->}`, and `tags`.
    - `TOOL_COMPARABLES_QUERY`: fetch tools with same category (exclude current), ordered by `popular desc, name asc`.
  - Ensure Landscape tools selection also returns `pathname`.

- File: `data/sanity/index.ts`
  - Add loaders:
    - `loadTool({ locale, pathname })`
    - `loadToolComparables({ locale, currentId, categoryId })`
  - In `loadPageByPathname` switch: add `case "tool"` -> `loadTool(...)`.

## Routing + Templates
- File: `app/(website)/[locale]/[...path]/page.tsx`
  - Include `"tool"` in `PAGE_TYPES`.
  - Add `case "tool"` to render tool page template.

- Files (new) under `components/templates/landscape/tools/`:
  - `page.tsx`: render title, description, tags, category/domain chips, primary CTA (website).
  - `tool-compare.tsx`: comparison UI (lazy-load comparables, select up to N, render table).

## Landscape Card Link
- File: `components/templates/landscape/tools/tool-card.tsx`
  - Under the logo, add a secondary link “View full details” -> `tool.pathname.current`.
  - Preserve existing click-to-open-overlay behavior on the card itself (link should not obstruct primary interactions; use a small link below the image/logo).

## Comparison UX
- Entry: On tool page, a “Compare with similar tools” button/section.
- Data: same `category` (implicitly same `domain`), same `locale`, exclude current tool.
- Table:
  - Columns: current tool + selected peers (cap e.g., 3).
  - Rows: name, flags (popular/verified/beta/oss), tags, website link, publishedAt.
- Accessibility: keyboard operable; table headers/labels; focus management on open/close.
- Perf: Lazy fetch comparables; memoize results; render responsively.

## Testing (TDD)
- Unit (Vitest + RTL):
  - `TOOL_QUERY` and `TOOL_COMPARABLES_QUERY` return expected shapes/filters.
  - `loadTool`, `loadToolComparables` call `sanityFetch` with correct params and perspective.
  - Tool page renders mandatory fields; hides missing optional bits.
  - Tool card shows “View full details” when `pathname.current` exists (under logo).
- E2E (Playwright):
  - `/en/landscape/<slug>` renders; missing slug 404s.
  - Landscape grid still loads; card still opens overlay; “View full details” navigates to the detail page.
  - Comparison: open, select one peer, table renders expected badges/links.
- CI gates: unit + e2e + typecheck + lint.

## Acceptance Criteria
- Tools have canonical pages at `/landscape/<slug>`.
- Landscape grid behavior unchanged; card shows a working “View full details” link under logo.
- Comparison section works and is accessible.
- Tests pass locally and in CI.

## Risks / Rollback
- One-time `pathname` fill for existing tools (if any).
- Rollback: switch `definePage` -> `defineSchema`, remove page wiring, and revert card link.
