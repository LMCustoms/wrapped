# Wrapped — Claude Code Instructions

## Project
Native macOS email client built with Tauri v2 + React + TypeScript.
Uses JMAP protocol to communicate with any JMAP-compatible mail server (e.g. Stalwart).

## Commands
```bash
npm run dev          # Start Vite dev server (frontend only, hot reload)
npm run tauri dev    # Start full Tauri app in dev mode (requires Rust + Xcode CLI tools)
npm run build        # Production frontend build
npm run tauri build  # Build macOS .app / .dmg bundle
npm run typecheck    # TypeScript check (no emit)
npm run lint         # ESLint
```

## Docs
- Architecture: `.claude/docs/architecture.md`
- Tech stack: `.claude/docs/stack.md`
- JMAP reference: `.claude/docs/jmap.md`

## Code Style — Non-Negotiable

### TypeScript
- Strict mode — no `any`, no `// @ts-ignore`
- All function parameters and return types must be explicit
- Use `unknown` over `any` when type is truly unknown
- Prefer `interface` over `type` for object shapes
- Prefer `type` for unions, intersections, mapped types

### React
- Functional components only — no class components
- Props interfaces defined above the component: `interface FooProps { ... }`
- Named exports for all components — no default exports except App
- Hooks extract logic — keep components thin

### State
- Zustand for all global state — no Redux, no React Context for data
- Local component state (`useState`) only for UI-only state (open/closed, hover, etc.)
- Store actions co-located with the store slice they mutate

### Styling
- Tailwind CSS only — no inline styles, no CSS modules, no styled-components
- Dark theme by default — test in dark mode
- Use `clsx` for conditional class names

### File Naming
- Components: `PascalCase.tsx` in a `PascalCase/` folder
- Services/hooks/utils: `camelCase.ts`
- One component per file

### Imports
- Absolute imports from `src/` — configure paths in tsconfig if needed
- Group: React → third-party → local
- No barrel files (index.ts re-exports) unless the folder has >4 files

## JMAP Rules
- All JMAP calls go through `src/services/jmap/client.ts` — never call `fetch` directly in components
- Session stored in Zustand `mailStore` — always call `getPrimaryAccountId(session)` before use
- Server URL is user-configurable at login — no hardcoded default
- Always batch method calls — use a single `call()` with multiple `methodCalls` when possible
- Handle `JMAPClientError` — show user-facing error messages, never swallow errors

## Security
- Sanitize ALL HTML email bodies with DOMPurify before rendering in WKWebView
- Store credentials in Tauri secure store (keychain) — never localStorage, never sessionStorage in production
- No credentials in logs, error messages, or console output

## Git
- Branch naming: `feat/`, `fix/`, `chore/`, `docs/`
- Conventional commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `style:`
- Never push to main — always branch + PR
- Keep PRs focused — one feature per PR
- PR description must include what changed and why
