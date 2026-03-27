# JMAP Protocol Reference

JMAP (JSON Meta Application Protocol) — RFC 8620 (core) + RFC 8621 (mail).
Stalwart supports JMAP natively. It's a modern, REST-like replacement for IMAP.

## Session Discovery

```
GET /.well-known/jmap
Authorization: Basic <base64(username:password)>
```

**Response: JMAPSession**
```json
{
  "username": "anian@lmcustoms.cc",
  "apiUrl": "https://mail.lmcustoms.cc/jmap/",
  "downloadUrl": "https://mail.lmcustoms.cc/jmap/download/{accountId}/{blobId}/{name}",
  "uploadUrl": "https://mail.lmcustoms.cc/jmap/upload/{accountId}/",
  "eventSourceUrl": "https://mail.lmcustoms.cc/jmap/eventsource/",
  "accounts": {
    "account-id-here": {
      "name": "anian@lmcustoms.cc",
      "isPersonal": true,
      "isReadOnly": false,
      "accountCapabilities": { ... }
    }
  },
  "primaryAccounts": {
    "urn:ietf:params:jmap:mail": "account-id-here"
  },
  "state": "some-state-string"
}
```

The `apiUrl` is used for all subsequent calls.
The `primaryAccounts["urn:ietf:params:jmap:mail"]` gives you the `accountId`.

## API Request Format

```
POST <session.apiUrl>
Authorization: Basic <base64(username:password)>
Content-Type: application/json
Accept: application/json

{
  "using": ["urn:ietf:params:jmap:core", "urn:ietf:params:jmap:mail"],
  "methodCalls": [
    ["MethodName/action", { ...args }, "callId1"],
    ["AnotherMethod/action", { ...args }, "callId2"]
  ]
}
```

**Batch multiple calls** — JMAP supports batching in one HTTP request. Always prefer this.

## Response Format

```json
{
  "sessionState": "state-string",
  "methodResponses": [
    ["MethodName/action", { ...result }, "callId1"],
    ["AnotherMethod/action", { ...result }, "callId2"]
  ]
}
```

On error, the method name becomes `"error"`:
```json
["error", { "type": "notFound", "description": "..." }, "callId1"]
```

## Key Methods

### Mailbox/get — List folders
```json
{
  "using": ["urn:ietf:params:jmap:core", "urn:ietf:params:jmap:mail"],
  "methodCalls": [
    ["Mailbox/get", { "accountId": "<id>", "ids": null }, "mailboxes"]
  ]
}
```
`ids: null` returns all mailboxes. Response: `{ list: Mailbox[], notFound: string[] }`

### Email/query — List email IDs in a mailbox
```json
["Email/query", {
  "accountId": "<id>",
  "filter": { "inMailbox": "<mailboxId>" },
  "sort": [{ "property": "receivedAt", "isAscending": false }],
  "position": 0,
  "limit": 50
}, "emailIds"]
```
Response: `{ ids: string[], total: number, position: number }`

### Email/get — Fetch email details
```json
["Email/get", {
  "accountId": "<id>",
  "#ids": { "resultOf": "emailIds", "name": "Email/query", "path": "/ids" },
  "properties": ["id", "subject", "from", "to", "receivedAt", "preview", "hasAttachment", "keywords", "mailboxIds"]
}, "emails"]
```
Use `#ids` back-reference to chain query → get in one HTTP call.

For full body:
```json
"properties": ["id", "subject", "from", "to", "receivedAt", "bodyValues", "htmlBody", "textBody"],
"fetchHTMLBodyValues": true,
"fetchTextBodyValues": true,
"maxBodyValueBytes": 102400
```

### Email/set — Mark read, move, delete
```json
["Email/set", {
  "accountId": "<id>",
  "update": {
    "<emailId>": {
      "keywords/$seen": true
    }
  }
}, "markRead"]
```

Move to trash:
```json
"update": {
  "<emailId>": {
    "mailboxIds": { "<trashMailboxId>": true }
  }
}
```

Permanent delete:
```json
"destroy": ["<emailId>"]
```

### EmailSubmission/set — Send email
First create the Email object, then submit it:
```json
{
  "methodCalls": [
    ["Email/set", {
      "accountId": "<id>",
      "create": {
        "draft": {
          "from": [{ "email": "anian@lmcustoms.cc" }],
          "to": [{ "email": "recipient@example.com" }],
          "subject": "Hello",
          "keywords": { "$draft": true },
          "mailboxIds": { "<draftsMailboxId>": true },
          "bodyValues": { "body": { "value": "Message text", "charset": "utf-8" } },
          "textBody": [{ "partId": "body", "type": "text/plain" }]
        }
      }
    }, "createEmail"],
    ["EmailSubmission/set", {
      "accountId": "<id>",
      "create": {
        "send": {
          "#emailId": { "resultOf": "createEmail", "name": "Email/set", "path": "/created/draft/id" },
          "envelope": {
            "mailFrom": { "email": "anian@lmcustoms.cc" },
            "rcptTo": [{ "email": "recipient@example.com" }]
          }
        }
      }
    }, "sendEmail"]
  ]
}
```

### Thread/get — Fetch a conversation thread
```json
["Thread/get", {
  "accountId": "<id>",
  "ids": ["<threadId>"]
}, "thread"]
```
Response: `{ list: [{ id: string, emailIds: string[] }] }`

## Authentication
HTTP Basic Auth over HTTPS only. Header: `Authorization: Basic <base64(user:pass)>`
Never send over plain HTTP.

## Error Types
| Type | Meaning |
|------|---------|
| `serverError` | Internal server error |
| `notFound` | Email/mailbox ID not found |
| `forbidden` | No permission |
| `overQuota` | Storage quota exceeded |
| `tooLarge` | Object too large |
| `invalidArguments` | Bad request parameters |
| `stateMismatch` | Concurrent modification |

## Stalwart-Specific Notes
- Server: `https://mail.lmcustoms.cc`
- Well-known: `https://mail.lmcustoms.cc/.well-known/jmap`
- Stalwart implements JMAP Core + JMAP Mail fully
- Also supports JMAP push via EventSource (`eventSourceUrl`) for real-time updates
- Admin API is separate (not JMAP) at `/api/` — don't mix these
