import { clsx } from "clsx";
import { useMailboxes } from "../../hooks/useMailbox";
import { useMailStore } from "../../store/mailStore";
import type { Mailbox } from "../../services/jmap/types";

const ROLE_ICONS: Record<string, string> = {
  inbox: "📥",
  sent: "📤",
  drafts: "📝",
  archive: "📦",
  trash: "🗑",
  junk: "🚫",
  flagged: "⭐",
  all: "📋",
};

function folderIcon(mailbox: Mailbox): string {
  return mailbox.role ? (ROLE_ICONS[mailbox.role] ?? "📁") : "📁";
}

export function FolderList() {
  useMailboxes(); // fires Mailbox/get on mount

  const mailboxes = useMailStore((s) => s.mailboxes);
  const selectedMailboxId = useMailStore((s) => s.selectedMailboxId);
  const selectMailbox = useMailStore((s) => s.selectMailbox);
  const isLoading = useMailStore((s) => s.isLoading);

  // Sort by sortOrder, show top-level only
  const sorted = [...mailboxes]
    .filter((m) => !m.parentId)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto">
      <p className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
        Mailboxes
      </p>

      {isLoading && mailboxes.length === 0 && (
        <p className="px-3 py-2 text-xs text-gray-600">Loading…</p>
      )}

      {sorted.map((mailbox) => (
        <button
          key={mailbox.id}
          onClick={() => selectMailbox(mailbox.id)}
          className={clsx(
            "w-full flex items-center justify-between px-3 py-1.5 rounded-md text-sm transition-colors",
            selectedMailboxId === mailbox.id
              ? "bg-accent/20 text-accent"
              : "text-gray-300 hover:bg-white/10"
          )}
        >
          <span className="flex items-center gap-2">
            <span className="text-base">{folderIcon(mailbox)}</span>
            {mailbox.name}
          </span>
          {mailbox.unreadEmails > 0 && (
            <span className="text-xs bg-accent rounded-full px-1.5 py-0.5 text-white font-medium">
              {mailbox.unreadEmails}
            </span>
          )}
        </button>
      ))}
    </nav>
  );
}
