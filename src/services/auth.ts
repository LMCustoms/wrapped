import type { Credentials } from "./jmap/client";

const SERVER_URL_KEY = "wrapped:serverUrl";
const USERNAME_KEY = "wrapped:username";

/**
 * Save credentials to sessionStorage (in-memory only, cleared on close).
 * In production, use Tauri's secure store (keychain) instead.
 */
export function saveCredentials(serverUrl: string, credentials: Credentials): void {
  sessionStorage.setItem(SERVER_URL_KEY, serverUrl);
  sessionStorage.setItem(USERNAME_KEY, credentials.username);
  // NOTE: password intentionally not persisted — use Tauri keychain in production
}

export function loadSavedServerUrl(): string {
  return sessionStorage.getItem(SERVER_URL_KEY) ?? "https://mail.lmcustoms.cc";
}

export function loadSavedUsername(): string {
  return sessionStorage.getItem(USERNAME_KEY) ?? "";
}

export function clearCredentials(): void {
  sessionStorage.removeItem(SERVER_URL_KEY);
  sessionStorage.removeItem(USERNAME_KEY);
}
