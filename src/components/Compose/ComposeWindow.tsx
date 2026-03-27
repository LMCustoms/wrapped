interface ComposeWindowProps {
  onClose: () => void;
}

export function ComposeWindow({ onClose }: ComposeWindowProps) {
  return (
    <div className="fixed bottom-4 right-4 w-[540px] bg-surface-overlay border border-white/10 rounded-xl shadow-2xl flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <span className="text-sm font-semibold text-gray-200">New Message</span>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white text-xl leading-none transition-colors"
          aria-label="Close"
        >
          ×
        </button>
      </div>
      <div className="p-4 space-y-3">
        <input
          placeholder="To"
          className="w-full bg-transparent border-b border-white/10 pb-2 text-sm outline-none text-gray-200 placeholder-gray-500"
        />
        <input
          placeholder="Subject"
          className="w-full bg-transparent border-b border-white/10 pb-2 text-sm outline-none text-gray-200 placeholder-gray-500"
        />
        <textarea
          placeholder="Write your message..."
          rows={8}
          className="w-full bg-transparent text-sm outline-none text-gray-200 placeholder-gray-500 resize-none"
        />
      </div>
      <div className="px-4 py-3 border-t border-white/10 flex items-center justify-between">
        <button className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
          Attach
        </button>
        <button className="px-4 py-1.5 bg-accent hover:bg-accent-hover text-white text-sm rounded-lg transition-colors font-medium">
          Send
        </button>
      </div>
    </div>
  );
}
