// JMAP Core Types — RFC 8620 + RFC 8621

export interface JMAPSession {
  username: string;
  apiUrl: string;
  downloadUrl: string;
  uploadUrl: string;
  eventSourceUrl: string;
  accounts: Record<string, JMAPAccount>;
  primaryAccounts: Record<string, string>;
  capabilities: Record<string, unknown>;
  state: string;
}

export interface JMAPAccount {
  name: string;
  isPersonal: boolean;
  isReadOnly: boolean;
  accountCapabilities: Record<string, unknown>;
}

export interface JMAPRequest {
  using: string[];
  methodCalls: JMAPMethodCall[];
  createdIds?: Record<string, string>;
}

export type JMAPMethodCall = [method: string, args: Record<string, unknown>, callId: string];

export interface JMAPResponse {
  sessionState: string;
  methodResponses: JMAPMethodResponse[];
  createdIds?: Record<string, string>;
}

export type JMAPMethodResponse = [method: string, response: Record<string, unknown>, callId: string];

export interface JMAPError {
  type: string;
  description?: string;
}

// Mailbox (folder) types

export interface Mailbox {
  id: string;
  name: string;
  parentId: string | null;
  role: MailboxRole | null;
  sortOrder: number;
  totalEmails: number;
  unreadEmails: number;
  totalThreads: number;
  unreadThreads: number;
  myRights: MailboxRights;
  isSubscribed: boolean;
}

export type MailboxRole =
  | "all"
  | "archive"
  | "drafts"
  | "flagged"
  | "important"
  | "inbox"
  | "junk"
  | "scheduled"
  | "sent"
  | "subscribed"
  | "trash";

export interface MailboxRights {
  mayReadItems: boolean;
  mayAddItems: boolean;
  mayRemoveItems: boolean;
  maySetSeen: boolean;
  maySetKeywords: boolean;
  mayCreateChild: boolean;
  mayRename: boolean;
  mayDelete: boolean;
  maySubmit: boolean;
}

// Email types

export interface EmailAddress {
  name: string | null;
  email: string;
}

export interface Email {
  id: string;
  blobId: string;
  threadId: string;
  mailboxIds: Record<string, boolean>;
  keywords: Record<string, boolean>;
  hasAttachment: boolean;
  subject: string;
  from: EmailAddress[] | null;
  to: EmailAddress[] | null;
  cc: EmailAddress[] | null;
  bcc: EmailAddress[] | null;
  replyTo: EmailAddress[] | null;
  sentAt: string | null;
  receivedAt: string;
  size: number;
  preview: string;
  bodyValues?: Record<string, EmailBodyValue>;
  htmlBody?: EmailBodyPart[];
  textBody?: EmailBodyPart[];
  attachments?: EmailBodyPart[];
}

export interface EmailBodyValue {
  value: string;
  isEncodingProblem: boolean;
  isTruncated: boolean;
}

export interface EmailBodyPart {
  partId?: string;
  blobId?: string;
  size: number;
  name?: string;
  type: string;
  charset?: string;
  disposition?: string;
  cid?: string;
}

// EmailSubmission (sending)

export interface EmailSubmission {
  id: string;
  identityId: string;
  emailId: string;
  threadId: string;
  envelope: {
    mailFrom: { email: string; parameters?: Record<string, string | null> };
    rcptTo: { email: string; parameters?: Record<string, string | null> }[];
  };
  sendAt: string;
  undoStatus: "pending" | "final" | "canceled";
  deliveryStatus?: Record<string, DeliveryStatus>;
}

export interface DeliveryStatus {
  smtpReply: string;
  delivered: "queued" | "yes" | "no" | "unknown";
  displayed: "unknown" | "yes";
}

// Thread

export interface Thread {
  id: string;
  emailIds: string[];
}
