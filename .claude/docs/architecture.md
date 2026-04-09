# App Architecture

## Layout: 3-Pane

```
┌─────────────┬──────────────────┬────────────────────────────┐
│   Sidebar   │  Message List    │      Message Detail        │
│  (w-56)     │  (w-72)          │      (flex-1)              │
│             │                  │                            │
│ 📥 Inbox    │ ● Subject line   │  From: sender@example.com  │
│ 📤 Sent     │   Preview text   │  To: you@example.com      │
│ 📝 Drafts   │   2h ago         │                            │
│ 📦 Archive  │                  │  Email body rendered here  │
│ 🗑 Trash    │ ○ Subject line   │  (DOMPurify sanitized HTML)│
│             │   Preview text   │                            │
└─────────────┴──────────────────┴────────────────────────────┘
                                                    ↑
                                        ComposeWindow floats here
```

**Components:**
- `App.tsx` — layout shell, three panes
- `Sidebar/FolderList` — mailbox list, unread counts
- `MessageList/MessageList` — email rows for selected mailbox
- `MessageDetail/MessageDetail` — full email view with HTML body
- `Compose/ComposeWindow` — floating compose modal

## Data Flow

```
User opens app
  → App checks for saved session in store
  → If none: show login screen (TODO)
  → If session: call initSession() → JMAP session object
  → Store session in useMailStore

User selects folder
  → selectMailbox(id) in store
  → useMailboxEmails hook fires Email/query + Email/get
  → Emails stored in useMailStore.emails

User selects email
  → selectEmail(id) in store
  → MessageDetail renders from store.emails
  → HTML body sanitized with DOMPurify before render

User composes
  → ComposeWindow shown (local UI state)
  → On Send: EmailSubmission/set via JMAP client
  → Success: close compose, sync sent folder
```

## Zustand Store Structure

```typescript
useMailStore {
  // Auth
  session: JMAPSession | null
  credentials: Credentials | null
  serverUrl: string

  // Mail data
  mailboxes: Mailbox[]       // All folders
  emails: Email[]            // Emails in selected mailbox

  // Selection
  selectedMailboxId: string | null
  selectedEmailId: string | null

  // UI state
  isLoading: boolean
  error: string | null

  // Actions
  setSession(session, credentials, serverUrl)
  clearSession()
  setMailboxes(mailboxes)
  setEmails(emails)
  selectMailbox(id)
  selectEmail(id)
  setLoading(bool)
  setError(msg)
}
```

## JMAP Client Flow

```
1. initSession(serverUrl, credentials)
   GET /.well-known/jmap
   → JMAPSession { apiUrl, accounts, primaryAccounts, ... }

2. getPrimaryAccountId(session)
   → accountId (used in all subsequent calls)

3. call(session, credentials, { using, methodCalls })
   POST session.apiUrl
   Body: { using: [...], methodCalls: [[method, args, callId], ...] }
   → JMAPResponse { methodResponses: [[method, result, callId], ...] }

4. getFirstResponse<T>(response, callId)
   → typed result T or throws JMAPClientError
```

## Component Tree

```
App
├── aside (Sidebar)
│   └── FolderList
├── div (MessageList pane)
│   └── MessageList
└── main (MessageDetail pane)
    └── MessageDetail
        └── [ComposeWindow] (conditional, floats)
```

## Tauri IPC (future)
- Use `invoke('command_name', args)` for Rust commands
- Use Tauri plugin-store for keychain (credentials)
- Use Tauri notification plugin for new mail alerts
- Keep all JMAP HTTP calls in the React layer (no proxying through Rust)

## File Structure Reference

```
src/
├── App.tsx                          # Root layout
├── main.tsx                         # React entry point
├── components/
│   ├── Sidebar/
│   │   └── FolderList.tsx           # Folder/mailbox list
│   ├── MessageList/
│   │   └── MessageList.tsx          # Email row list
│   ├── MessageDetail/
│   │   └── MessageDetail.tsx        # Full email view
│   └── Compose/
│       └── ComposeWindow.tsx        # Floating compose modal
├── services/
│   ├── auth.ts                      # Credential helpers
│   └── jmap/
│       ├── types.ts                 # All JMAP TypeScript types
│       ├── client.ts                # HTTP client (initSession, call)
│       └── session.ts               # Session cache + helpers
├── store/
│   └── mailStore.ts                 # Zustand store
├── hooks/
│   └── useMailbox.ts                # Mailbox/get hook
└── styles/
    └── globals.css                  # Tailwind base + global styles
```
