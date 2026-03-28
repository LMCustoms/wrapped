import { clsx } from "clsx";
import { formatRelative, parseISO } from "date-fns";
import { useEmails } from "../../hooks/useEmails";
import { useMailStore } from "../../store/mailStore";
import type { Email } from "../../services/jmap/types";

function senderName(email: Email): string {
  const from = email.from?.[0];
  if (!from) return "Unknown";
  return from.name ?? from.email;
}

function relativeTime(iso: string): string {
  try {
    return formatRelative(parseISO(iso), new Date());
  } catch {
    return iso;
  }
}

function isUnread(email: Email): boolean {
  return !email.keywords["$seen"];
}

export function MessageList() {
  useEmails(); // fires Email/query + Email/get when selectedMailboxId changes

  const emails = useMailStore((s) => s.emails);
  const selectedEmailId = useMailStore((s) => s.selectedEmailId);
  const selectedMailboxId = useMailStore((s) => s.selectedMailboxId);
  const mailboxes = useMailStore((s) => s.mailboxes);
  const selectEmail = useMailStore((s) => s.selectEmail);
  const isLoading = useMailStore((s) => s.isLoading);

  const currentMailbox = mailboxes.find((m) => m.id === selectedMailboxId);

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="h-10 flex items-center justify-between px-4 border-b border-white/10 flex-shrink-0">
        <span className="text-sm font-semibold text-gray-200">
          {currentMailbox?.name ?? "Inbox"}
        </span>
        {currentMailbox && currentMailbox.unreadEmails > 0 && (
          <span className="text-xs text-gray-500">
            {currentMailbox.unreadEmails} unread
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading && emails.length === 0 && (
          <div className="flex flex-col items-center justify-center h-32 text-gray-500 text-sm">
            Loading…
          </div>
        )}

        {!isLoading && !selectedMailboxId && (
          <div className="flex flex-col items-center justify-center h-32 gap-2 text-gray-500">
            <span className="text-2xl">📁</span>
            <span className="text-sm">Select a folder</span>
          </div>
        )}

        {!isLoading && selectedMailboxId && emails.length === 0 && (
          <div className="flex flex-col items-center justify-center h-32 gap-2 text-gray-500">
            <span className="text-2xl">📭</span>
            <span className="text-sm">No messages</span>
          </div>
        )}

        {emails.map((email) => (
          <button
            key={email.id}
            onClick={() => selectEmail(email.id)}
            className={clsx(
              "w-full text-left px-4 py-3 border-b border-white/5 transition-colors",
              selectedEmailId === email.id
                ? "bg-accent/15"
                : "hover:bg-white/5"
            )}
          >
            <div className="flex items-start justify-between gap-2 mb-0.5">
              <span
                className={clsx(
                  "text-sm truncate",
                  isUnread(email)
                    ? "font-semibold text-gray-100"
                    : "font-normal text-gray-300"
                )}
              >
                {senderName(email)}
              </span>
              <span className="text-xs text-gray-500 flex-shrink-0">
                {relativeTime(email.receivedAt)}
              </span>
            </div>
            <p
              className={clsx(
                "text-xs truncate mb-0.5",
                isUnread(email) ? "text-gray-200" : "text-gray-400"
              )}
            >
              {email.subject || "(no subject)"}
            </p>
            <p className="text-xs text-gray-600 truncate">{email.preview}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
