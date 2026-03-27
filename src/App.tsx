import { FolderList } from "./components/Sidebar/FolderList";
import { MessageList } from "./components/MessageList/MessageList";
import { MessageDetail } from "./components/MessageDetail/MessageDetail";

export function App() {
  return (
    <div className="flex h-full w-full overflow-hidden bg-surface text-gray-100">
      {/* Sidebar — folder list */}
      <aside className="w-56 flex-shrink-0 border-r border-white/10 bg-surface flex flex-col">
        {/* Traffic light / drag region */}
        <div className="h-10 flex items-center px-4" style={{ WebkitAppRegion: "drag" } as React.CSSProperties} />
        <FolderList />
      </aside>

      {/* Message list */}
      <div className="w-72 flex-shrink-0 border-r border-white/10 bg-surface-raised flex flex-col">
        <MessageList />
      </div>

      {/* Message detail */}
      <main className="flex-1 flex flex-col bg-surface-raised overflow-hidden">
        <MessageDetail />
      </main>
    </div>
  );
}

export default App;
