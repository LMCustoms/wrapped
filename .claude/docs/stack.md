# Tech Stack Reference

## Tauri v2
**What:** Rust-based framework for building native desktop apps with a web frontend.
**Why:** Ships ~8MB bundles vs Electron's ~150MB. Native OS integration (keychain, notifications, menus). macOS titlebar overlay for a proper native feel.
**Key APIs used:**
- `@tauri-apps/api/window` — window management, titlebar
- `@tauri-apps/plugin-store` — secure key-value store (credentials)
- `@tauri-apps/api/notification` — native macOS notifications
- `tauri::Builder` — Rust main entry, command registration

**Config:** `src-tauri/tauri.conf.json`
**Rust entry:** `src-tauri/src/main.rs`

## React 18
**What:** UI library for building component trees.
**Why:** Ecosystem, concurrent features, good TypeScript support.
**Key patterns:**
- Functional components only
- `useEffect` for side effects (data fetching via hooks, not components)
- `useMemo` / `useCallback` for expensive computations in lists
- `Suspense` for async states (future)

## TypeScript (strict)
**Config:** `tsconfig.json` with `"strict": true`
**Enforced:**
- No implicit `any`
- Strict null checks
- No unused locals/parameters
- All JMAP types in `src/services/jmap/types.ts`

## Vite
**What:** Build tool and dev server.
**Why:** HMR, fast cold start, ESM-native.
**Config:** `vite.config.ts` — port 1420 (Tauri's expected dev port), TAURI_ env prefix
**Build target:** `es2021, chrome100, safari13` (Tauri's WebView)

## Tailwind CSS v3
**What:** Utility-first CSS framework.
**Why:** No context switching, composable, dark mode built-in.
**Config:** `tailwind.config.js`
**Custom tokens:**
- `bg-surface` → `#1a1a1a` (base dark)
- `bg-surface-raised` → `#242424` (panels)
- `bg-surface-overlay` → `#2e2e2e` (modals, compose)
- `bg-accent` → `#6366f1` (indigo, primary action)
- `font-sans` → SF Pro Display / system-ui

## Zustand
**What:** Minimal state management.
**Why:** No boilerplate, no providers, just hooks.
**Stores:**
- `useMailStore` — auth session, credentials, mailboxes, emails, selection state
**Pattern:** Flat store with typed actions. No selectors library needed at this scale.

## JMAP Client (`src/services/jmap/`)
**What:** Custom HTTP client for JMAP protocol.
**Files:**
- `types.ts` — all TypeScript interfaces (JMAPSession, Mailbox, Email, etc.)
- `client.ts` — `initSession()`, `call()`, `getFirstResponse()`
- `session.ts` — session cache, `getPrimaryAccountId()`
**Server:** `https://mail.lmcustoms.cc` (Stalwart)
**Auth:** HTTP Basic over HTTPS

## DOMPurify
**What:** HTML sanitizer.
**Why:** Email bodies contain untrusted HTML. Rendering unsanitized HTML is an XSS vector.
**Usage:** Always call `DOMPurify.sanitize(htmlBody)` before setting `innerHTML` or using `dangerouslySetInnerHTML`.

## date-fns
**What:** Date formatting utilities.
**Why:** Lightweight (tree-shakable), no global mutation, great TypeScript types.
**Key functions:** `format`, `formatRelative`, `parseISO`, `isToday`, `isThisYear`

## clsx
**What:** Tiny utility for conditional className strings.
**Usage:** `clsx("base-class", { "conditional-class": isActive })`
