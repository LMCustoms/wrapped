import { useEffect, useState } from "react";
import { useMailStore } from "../store/mailStore";
import { call, getFirstResponse } from "../services/jmap/client";
import { getPrimaryAccountId } from "../services/jmap/session";
import type { Email } from "../services/jmap/types";

const DETAIL_PROPERTIES = [
  "id",
  "threadId",
  "mailboxIds",
  "keywords",
  "hasAttachment",
  "subject",
  "from",
  "to",
  "cc",
  "bcc",
  "replyTo",
  "sentAt",
  "receivedAt",
  "bodyValues",
  "htmlBody",
  "textBody",
  "attachments",
];

export function useEmailDetail(emailId: string | null) {
  const { session, credentials } = useMailStore();
  const [email, setEmail] = useState<Email | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session || !credentials || !emailId) {
      setEmail(null);
      return;
    }

    const accountId = getPrimaryAccountId(session);
    setLoading(true);
    setError(null);

    call(session, credentials, {
      using: ["urn:ietf:params:jmap:core", "urn:ietf:params:jmap:mail"],
      methodCalls: [
        [
          "Email/get",
          {
            accountId,
            ids: [emailId],
            properties: DETAIL_PROPERTIES,
            fetchHTMLBodyValues: true,
            fetchTextBodyValues: true,
            maxBodyValueBytes: 1048576, // 1MB
          },
          "emailDetail",
        ],
      ],
    })
      .then((response) => {
        const result = getFirstResponse<{ list: Email[] }>(response, "emailDetail");
        setEmail(result.list[0] ?? null);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to load email");
      })
      .finally(() => setLoading(false));
  }, [session, credentials, emailId]);

  return { email, loading, error };
}
