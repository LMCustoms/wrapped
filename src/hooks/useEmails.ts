import { useEffect } from "react";
import { useMailStore } from "../store/mailStore";
import { call, getFirstResponse } from "../services/jmap/client";
import { getPrimaryAccountId } from "../services/jmap/session";
import type { Email } from "../services/jmap/types";

const EMAIL_LIST_PROPERTIES = [
  "id",
  "threadId",
  "mailboxIds",
  "keywords",
  "hasAttachment",
  "subject",
  "from",
  "to",
  "receivedAt",
  "preview",
];

export function useEmails() {
  const { session, credentials, selectedMailboxId, setEmails, setLoading, setError } =
    useMailStore();

  useEffect(() => {
    if (!session || !credentials || !selectedMailboxId) return;

    const accountId = getPrimaryAccountId(session);
    setLoading(true);
    setError(null);
    setEmails([]);

    call(session, credentials, {
      using: ["urn:ietf:params:jmap:core", "urn:ietf:params:jmap:mail"],
      methodCalls: [
        [
          "Email/query",
          {
            accountId,
            filter: { inMailbox: selectedMailboxId },
            sort: [{ property: "receivedAt", isAscending: false }],
            position: 0,
            limit: 50,
          },
          "emailIds",
        ],
        [
          "Email/get",
          {
            accountId,
            "#ids": {
              resultOf: "emailIds",
              name: "Email/query",
              path: "/ids",
            },
            properties: EMAIL_LIST_PROPERTIES,
          },
          "emails",
        ],
      ],
    })
      .then((response) => {
        const result = getFirstResponse<{ list: Email[] }>(response, "emails");
        setEmails(result.list);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to load emails");
      })
      .finally(() => setLoading(false));
  }, [session, credentials, selectedMailboxId, setEmails, setLoading, setError]);
}
