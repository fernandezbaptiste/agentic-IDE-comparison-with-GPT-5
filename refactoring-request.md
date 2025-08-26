Refactoring request


# IDE Refactoring Prompt

You’re refactoring a Next.js + TypeScript repo. Make the **exact** changes below, and after each step, stage the file so I can diff it.

---

## 1. Deprecate the `cva` alias

- In `package.json`, under `dependencies`, **remove** the entry  
  `"cva": "npm:class-variance-authority@^0.7.1"`.
- Keep `"class-variance-authority": "^0.7.1"` as the canonical dependency.
- Then in the **entire codebase**, update imports so that any line like:

```ts
import { cva, cx } from "cva"
```

becomes

```ts
import { cva, cx } from "class-variance-authority"
```

Only change the module specifier (`"cva"` → `"class-variance-authority"`); **do not** alter identifiers (`cva`, `cx`) unless required by types.

---

## 2. Modernize ESLint parser version

- Open `eslint.config.mjs`. In the `languageOptions.parserOptions`, change  
  `ecmaVersion: 2019` → `ecmaVersion: "latest"`.

---

## 3. Update ESLint rules & ignores

- In `eslint.config.mjs`, change the rule value:  
  `"perfectionist/sort-objects": 0` → `"perfectionist/sort-objects": "off"`.

- In the top-level `ignores` array, **append** the following entries (if they aren’t present):  
  - `"next-env.d.ts"`  
  - `"tsconfig.tsbuildinfo"`

Keep the existing ignores as-is.

---

## 4. Sanity check Prettier & PostCSS

- Confirm `postcss.config.mjs` exports the Tailwind v4 plugin block.  
- Confirm `prettier.config.mjs` exports a config with `plugins: ["prettier-plugin-tailwindcss"]`.  
- If already correct, **make no edits**.

---

## 5. Post-refactor checks

After making changes, run:

```bash
pnpm i
pnpm lint
pnpm typecheck
```

Report any new errors introduced by these edits only.

