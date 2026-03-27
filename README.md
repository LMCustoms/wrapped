# Wrapped

A native macOS email client built with Tauri + React for [lmcustoms.cc](https://lmcustoms.cc).

![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178c6?style=flat-square&logo=typescript)
![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react)
![Tauri](https://img.shields.io/badge/Tauri-2.0-ffc131?style=flat-square&logo=tauri)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat-square&logo=tailwindcss)

## Stack

| Layer | Tech |
|-------|------|
| Shell | Tauri v2 (Rust) |
| Frontend | React 18 + TypeScript |
| State | Zustand |
| Styling | Tailwind CSS |
| Protocol | JMAP (RFC 8620 + 8621) |
| Mail server | Stalwart at `mail.lmcustoms.cc` |

## Development

### Prerequisites
- Node.js 20+
- Rust (via rustup)
- Xcode Command Line Tools (macOS)

### Setup

```bash
git clone https://github.com/LMCustoms/wrapped.git
cd wrapped
npm install
```

### Run

```bash
# Frontend only (Vite dev server at http://localhost:1420)
npm run dev

# Full Tauri app (opens native window)
npm run tauri dev
```

### Build

```bash
npm run tauri build
# Output: src-tauri/target/release/bundle/
```

## Architecture

Three-pane layout: **Sidebar** (folders) → **Message List** → **Message Detail**

- All mail operations via JMAP protocol — see `.claude/docs/jmap.md`
- State managed with Zustand — see `.claude/docs/architecture.md`
- Full tech stack reference — see `.claude/docs/stack.md`
- Coding conventions — see `.claude/CLAUDE.md`

## Project Structure

```
src/
├── components/     # UI components (Sidebar, MessageList, MessageDetail, Compose)
├── services/jmap/  # JMAP client, session management, TypeScript types
├── store/          # Zustand state store
├── hooks/          # Custom hooks (useMailboxes, ...)
└── styles/         # Tailwind globals
src-tauri/          # Rust/Tauri app shell
.claude/            # AI coding assistant instructions + docs
```
