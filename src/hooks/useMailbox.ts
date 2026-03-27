import { useEffect } from "react";
import { useMailStore } from "../store/mailStore";
import { call, getFirstResponse } from "../services/jmap/client";
import { getPrimaryAccountId } from "../services/jmap/session";
import type { Mailbox } from "../services/jmap/types";

export function useMailboxes() {
  const { session, credentials, setMailboxes, setLoading, setError } =
    useMailStore();

  useEffect(() => {
    if (!session || !credentials) return;

    const accountId = getPrimaryAccountId(session);
    setLoading(true);
    setError(null);

    call(session, credentials, {
      using: ["urn:ietf:params:jmap:core", "urn:ietf:params:jmap:mail"],
      methodCalls: [["Mailbox/get", { accountId, ids: null }, "mailboxes"]],
    })
      .then((response) => {
        const result = getFirstResponse<{ list: Mailbox[] }>(
          response,
          "mailboxes"
        );
        setMailboxes(result.list);
      })
      .catch((err: unknown) => {
        setError(
          err instanceof Error ? err.message : "Failed to load mailboxes"
        );
      })
      .finally(() => setLoading(false));
  }, [session, credentials, setMailboxes, setLoading, setError]);
}
