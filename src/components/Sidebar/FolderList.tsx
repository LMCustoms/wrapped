interface Folder {
  id: string;
  name: string;
  icon: string;
  unreadCount: number;
}

const PLACEHOLDER_FOLDERS: Folder[] = [
  { id: "inbox", name: "Inbox", icon: "📥", unreadCount: 0 },
  { id: "sent", name: "Sent", icon: "📤", unreadCount: 0 },
  { id: "drafts", name: "Drafts", icon: "📝", unreadCount: 0 },
  { id: "archive", name: "Archive", icon: "📦", unreadCount: 0 },
  { id: "trash", name: "Trash", icon: "🗑", unreadCount: 0 },
];

export function FolderList() {
  return (
    <nav className="flex-1 px-2 py-2 space-y-0.5">
      <p className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
        Mailboxes
      </p>
      {PLACEHOLDER_FOLDERS.map((folder) => (
        <button
          key={folder.id}
          className="w-full flex items-center justify-between px-3 py-1.5 rounded-md text-sm text-gray-300 hover:bg-white/10 transition-colors"
        >
          <span className="flex items-center gap-2">
            <span className="text-base">{folder.icon}</span>
            {folder.name}
          </span>
          {folder.unreadCount > 0 && (
            <span className="text-xs bg-accent rounded-full px-1.5 py-0.5 text-white font-medium">
              {folder.unreadCount}
            </span>
          )}
        </button>
      ))}
    </nav>
  );
}
