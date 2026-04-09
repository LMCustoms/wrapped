import { create } from "zustand";
import type { Mailbox, Email, JMAPSession } from "../services/jmap/types";
import type { Credentials } from "../services/jmap/client";

interface AuthState {
  session: JMAPSession | null;
  credentials: Credentials | null;
  serverUrl: string;
}

interface MailState {
  mailboxes: Mailbox[];
  emails: Email[];
  selectedMailboxId: string | null;
  selectedEmailId: string | null;
  isLoading: boolean;
  error: string | null;
}

interface MailStore extends AuthState, MailState {
  // Auth actions
  setSession: (session: JMAPSession, credentials: Credentials, serverUrl: string) => void;
  clearSession: () => void;
  // Mail actions
  setMailboxes: (mailboxes: Mailbox[]) => void;
  setEmails: (emails: Email[]) => void;
  selectMailbox: (id: string) => void;
  selectEmail: (id: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useMailStore = create<MailStore>((set) => ({
  // Auth
  session: null,
  credentials: null,
  serverUrl: "",
  // Mail
  mailboxes: [],
  emails: [],
  selectedMailboxId: null,
  selectedEmailId: null,
  isLoading: false,
  error: null,

  setSession: (session, credentials, serverUrl) =>
    set({ session, credentials, serverUrl, error: null }),
  clearSession: () =>
    set({ session: null, credentials: null, mailboxes: [], emails: [] }),
  setMailboxes: (mailboxes) => set({ mailboxes }),
  setEmails: (emails) => set({ emails }),
  selectMailbox: (id) => set({ selectedMailboxId: id, selectedEmailId: null }),
  selectEmail: (id) => set({ selectedEmailId: id }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
