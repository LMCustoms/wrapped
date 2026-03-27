import { initSession, type Credentials } from "./client";
import type { JMAPSession } from "./types";

let cachedSession: JMAPSession | null = null;

export async function getSession(
  serverUrl: string,
  credentials: Credentials
): Promise<JMAPSession> {
  if (cachedSession) return cachedSession;
  cachedSession = await initSession(serverUrl, credentials);
  return cachedSession;
}

export function invalidateSession(): void {
  cachedSession = null;
}

export function getPrimaryAccountId(session: JMAPSession): string {
  const accountId = session.primaryAccounts["urn:ietf:params:jmap:mail"];
  if (!accountId) {
    throw new Error("No primary mail account found in JMAP session");
  }
  return accountId;
}
