# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

```bash
npm run dev          # Web mode (localStorage fallback, no Rust)
npm run build        # Next.js production build
npm run tauri dev    # Full desktop app with Tauri (requires Rust)
npm run tauri build  # Build desktop release
npm run lint         # ESLint
```

## Architecture

### Tauri IPC Bridge Pattern

The frontend uses a dual-mode data layer in `src/lib/db.ts`:
- **Tauri mode**: Detected via `'__TAURI__' in window` — calls Rust backend via `invoke()`
- **Browser mode**: Falls back to localStorage (for `npm run dev` without Rust)

All database operations go through this bridge. When adding new commands:
1. Add the Rust handler in `src-tauri/src/commands.rs`
2. Export it from `src-tauri/src/lib.rs`
3. Register in `src-tauri/src/main.rs` invoke_handler
4. Add the frontend wrapper in `src/lib/db.ts`

### Data Model

SQLite database with three tables:
- **customers**: id, name, email, phone, company, notes, created_at, updated_at
- **tasks**: id, title, description, status (todo|in_progress|done), position, created_at, updated_at
- **settings**: key, value

### State Management

Zustand stores in `src/stores/`:
- `useCustomerStore` — customer CRUD state
- `useTaskStore` — task CRUD + kanban state

### Key Files

| File | Purpose |
|------|---------|
| `src/lib/db.ts` | Tauri IPC bridge + localStorage fallback |
| `src-tauri/src/db.rs` | SQLite operations (all DB logic) |
| `src-tauri/src/commands.rs` | Tauri IPC command handlers |
| `src-tauri/src/main.rs` | Tauri app entry, DB initialization |
| `src/stores/*.ts` | Zustand stores for UI state |

## Development Notes

- Tauri window: 1200x800, min 800x600, resizable
- Database path: `~/.local/share/yihao-command/data.db`
- Rust deps: rusqlite (bundled), uuid, chrono, dirs
- Frontend: Next.js 14 App Router, Tailwind, dnd-kit for drag-and-drop