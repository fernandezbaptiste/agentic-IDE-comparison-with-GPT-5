# Project Spec: AI Development Tools Landscape (Static MERN)

## Overview
A static, read-only landscape of AI development tools organized by Domain > Category > Tool. Content is displayed in a simple list format with tool name, one-line description, and site link. No authentication and no add/edit features.

## Goals
- Present two domains (“Code” and “DevOps”) with specified categories.
- Each category lists exactly two tools (name, one-liner, site link).
- Build with MERN stack (React + Node/Express; data is static; MongoDB not required for MVP).
- Include tests (unit, integration, basic e2e).
- Basic CSS only.

## Non-Goals
- Authentication, authorization.
- Tool creation, updates, or deletions.
- Search, filters, or complex navigation.
- Persistence in a database (MVP uses static JSON).

## Tech Stack
- Client: React 18, Vite or CRA, JSX, CSS.
- Server: Node.js 18+, Express 4.x.
- Data: Static JSON served by Express (read-only).
- Tests: Jest + React Testing Library (client), Jest + Supertest (server), Playwright or Cypress (e2e).
- Linting/Formatting: ESLint, Prettier.

## Architecture
- Single-page React app fetches read-only data from GET /api/tools.
- Express serves the API and static client build.
- No DB connection in MVP; MongoDB can be introduced later without changing the contract.

## Data Model (Read-only)
- Domain: name, categories[]
- Category: name, tools[]
- Tool: name, description, link

Example JSON (server/data/tools.json):
{
  "domains": [
    {
      "name": "Code",
      "categories": [
        {
          "name": "Terminal",
          "tools": [
            { "name": "PromptShell", "description": "AI-assisted CLI that suggests and explains commands.", "link": "https://example.com/promptshell" },
            { "name": "AIDevTerm", "description": "Terminal companion that generates one-liners and fixes errors.", "link": "https://example.com/aidevterm" }
          ]
        },
        {
          "name": "Editor",
          "tools": [
            { "name": "NeuronEdit", "description": "Editor plugin that completes code and explains diffs.", "link": "https://example.com/neuronedit" },
            { "name": "AutoCoder", "description": "Inline AI pair-programmer for refactors and tests.", "link": "https://example.com/autocoder" }
          ]
        },
        {
          "name": "Spec Driven",
          "tools": [
            { "name": "SpecSmith", "description": "Turn specs into skeleton code and tasks.", "link": "https://example.com/specsmith" },
            { "name": "BlueprintAI", "description": "Generates boilerplate from project blueprints.", "link": "https://example.com/blueprintai" }
          ]
        }
      ]
    },
    {
      "name": "DevOps",
      "categories": [
        {
          "name": "SRE",
          "tools": [
            { "name": "ReliabilityBot", "description": "Predicts incidents and suggests runbooks.", "link": "https://example.com/reliabilitybot" },
            { "name": "AIOps Guardian", "description": "Detects anomalies and auto-opens issues.", "link": "https://example.com/aiopsguardian" }
          ]
        },
        {
          "name": "Observability",
          "tools": [
            { "name": "TraceMind", "description": "Correlates traces, logs, and metrics with AI summaries.", "link": "https://example.com/tracemind" },
            { "name": "LogLens", "description": "Natural-language log search and alert insights.", "link": "https://example.com/loglens" }
          ]
        },
        {
          "name": "Infra-as-code",
          "tools": [
            { "name": "StackWeaver", "description": "Generates IaC templates from prompts.", "link": "https://example.com/stackweaver" },
            { "name": "InfraGenie", "description": "Validates and explains infra changes.", "link": "https://example.com/infragenie" }
          ]
        }
      ]
    }
  ]
}

## API Contract (Read-only)
- GET /api/health → { status: "ok" }
- GET /api/tools → 200 { domains: [...] }
  - No query params, no auth.
  - Caching headers: Cache-Control: public, max-age=300.

## UI/UX
- Single route “/”.
- Page sections:
  - Header: title “AI Development Tools Landscape”.
  - Content: For each Domain, show Domain name (H2).
    - Under each Domain, list Categories (H3).
      - Under each Category, list exactly two items:
        - Tool Name (bold) — one-line description — external link “[site]”.
- Basic CSS:
  - Responsive single column, max-width 960px, 16px base, 1.5 line-height.
  - Light theme, accessible contrast.
  - Semantic HTML lists (ul/li) for categories/tools.

## Accessibility
- Semantic headings and lists.
- Links have descriptive text and target=”_blank” with rel=”noopener”.
- Sufficient color contrast.

## Testing
- Client (Jest + RTL):
  - Renders page title.
  - Renders both domains and all categories.
  - Each category lists exactly 2 tools.
  - External links have correct href attributes.
- Server (Jest + Supertest):
  - GET /api/health returns 200 and status ok.
  - GET /api/tools returns 200, JSON schema, correct counts (2 domains, 6 categories total, 12 tools total).
- E2E (Playwright/Cypress):
  - Loads “/”, content visible, links present.
  - No auth UI present.
- Optional snapshot for the tool list.

## Performance
- Serve client build with compression.
- Simple client-side fetch + render.
- Static JSON load under 25KB.

## Folder Structure
- /client
  - /src
    - components/DomainList.jsx
    - components/CategoryList.jsx
    - components/ToolItem.jsx
    - App.jsx
    - index.jsx
    - styles.css
  - package.json
- /server
  - index.js
  - routes/tools.js
  - data/tools.json
  - package.json
- /tests
  - client/App.test.jsx
  - server/tools.test.js
  - e2e/smoke.spec.ts
- package.json (workspace root, scripts)

## Scripts
- client: dev, build, test
- server: dev (nodemon), start, test
- root: install, build (client), start (server), test (client+server), e2e

## Acceptance Criteria
- The UI displays exactly:
  - 2 domains: “Code” and “DevOps”.
  - Categories: Code → Terminal, Editor, Spec Driven; DevOps → SRE, Observability, Infra-as-code.
  - Each category shows exactly 2 tools with name, one-liner, and site link.
- No authentication or add/edit controls exist.
- App builds and runs with MERN stack (Express serves static client and read-only API).
- All tests pass (unit, integration, basic e2e).
- Basic, clean styling; accessible and responsive.

## Deployment
- Single container or Node process serving Express and static client.
- Environment: NODE_ENV, PORT.
- Optional CDN for static assets.
