export function MessageList() {
  return (
    <div className="flex-1 flex flex-col">
      <div className="h-10 flex items-center justify-between px-4 border-b border-white/10">
        <span className="text-sm font-semibold text-gray-200">Inbox</span>
        <button className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
          Filter
        </button>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center gap-2 text-gray-500">
        <span className="text-2xl">📭</span>
        <span className="text-sm">No messages</span>
      </div>
    </div>
  );
}
