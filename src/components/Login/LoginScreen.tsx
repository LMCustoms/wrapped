import { useState, type FormEvent } from "react";
import { initSession } from "../../services/jmap/client";
import { useMailStore } from "../../store/mailStore";

export function LoginScreen() {
  const [serverUrl, setServerUrl] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const setSession = useMailStore((s) => s.setSession);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const session = await initSession(serverUrl, { username, password });
      setSession(session, { username, password }, serverUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-surface">
      {/* Drag region for window */}
      <div
        className="fixed top-0 left-0 right-0 h-10"
        style={{ WebkitAppRegion: "drag" } as React.CSSProperties}
      />

      <div className="w-80 space-y-8">
        {/* Logo / name */}
        <div className="text-center space-y-1">
          <div className="text-4xl">✉️</div>
          <h1 className="text-2xl font-semibold text-gray-100">Wrapped</h1>
          <p className="text-sm text-gray-500">Sign in to your mail account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs text-gray-500 uppercase tracking-wide">
              Server
            </label>
            <input
              type="url"
              value={serverUrl}
              onChange={(e) => setServerUrl(e.target.value)}
              placeholder="https://mail.example.com"
              className="w-full bg-surface-raised border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-200 outline-none focus:border-accent transition-colors placeholder-gray-600"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-gray-500 uppercase tracking-wide">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="user@example.com"
              autoComplete="username"
              className="w-full bg-surface-raised border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-200 outline-none focus:border-accent transition-colors placeholder-gray-600"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-gray-500 uppercase tracking-wide">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="w-full bg-surface-raised border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-200 outline-none focus:border-accent transition-colors"
              required
            />
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium py-2 rounded-lg transition-colors"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
