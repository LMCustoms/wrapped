import { useMemo } from "react";
import DOMPurify from "dompurify";
import { format, parseISO } from "date-fns";
import { useMailStore } from "../../store/mailStore";
import { useEmailDetail } from "../../hooks/useEmailDetail";
import type { EmailAddress } from "../../services/jmap/types";

function formatAddresses(addresses: EmailAddress[] | null | undefined): string {
  if (!addresses || addresses.length === 0) return "";
  return addresses
    .map((a) => (a.name ? `${a.name} <${a.email}>` : a.email))
    .join(", ");
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "";
  try {
    return format(parseISO(iso), "MMM d, yyyy 'at' HH:mm");
  } catch {
    return iso;
  }
}

export function MessageDetail() {
  const selectedEmailId = useMailStore((s) => s.selectedEmailId);
  const { email, loading, error } = useEmailDetail(selectedEmailId);

  const sanitizedHtml = useMemo(() => {
    if (!email?.bodyValues || !email.htmlBody) return null;
    const firstPart = email.htmlBody[0];
    if (!firstPart?.partId) return null;
    const bodyValue = email.bodyValues[firstPart.partId];
    if (!bodyValue) return null;
    return DOMPurify.sanitize(bodyValue.value, {
      FORBID_TAGS: ["script", "style", "iframe", "form"],
      FORBID_ATTR: ["on*"],
    });
  }, [email]);

  const plainText = useMemo(() => {
    if (!email?.bodyValues || !email.textBody) return null;
    const firstPart = email.textBody[0];
    if (!firstPart?.partId) return null;
    return email.bodyValues[firstPart.partId]?.value ?? null;
  }, [email]);

  if (!selectedEmailId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-2 text-gray-500">
        <span className="text-3xl">✉️</span>
        <span className="text-sm">Select a message to read</span>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
        Loading…
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center text-red-400 text-sm px-8 text-center">
        {error}
      </div>
    );
  }

  if (!email) return null;

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/10 flex-shrink-0 space-y-2">
        <h2 className="text-lg font-semibold text-gray-100 leading-tight">
          {email.subject || "(no subject)"}
        </h2>
        <div className="space-y-0.5 text-xs text-gray-400">
          <div className="flex gap-2">
            <span className="text-gray-600 w-8 flex-shrink-0">From</span>
            <span>{formatAddresses(email.from)}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-gray-600 w-8 flex-shrink-0">To</span>
            <span>{formatAddresses(email.to)}</span>
          </div>
          {email.cc && email.cc.length > 0 && (
            <div className="flex gap-2">
              <span className="text-gray-600 w-8 flex-shrink-0">Cc</span>
              <span>{formatAddresses(email.cc)}</span>
            </div>
          )}
          <div className="flex gap-2">
            <span className="text-gray-600 w-8 flex-shrink-0">Date</span>
            <span>{formatDate(email.sentAt ?? email.receivedAt)}</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {sanitizedHtml ? (
          <div
            className="prose prose-invert prose-sm max-w-none text-gray-200"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
          />
        ) : plainText ? (
          <pre className="text-sm text-gray-200 whitespace-pre-wrap font-sans leading-relaxed">
            {plainText}
          </pre>
        ) : (
          <p className="text-sm text-gray-500">No content</p>
        )}
      </div>
    </div>
  );
}
