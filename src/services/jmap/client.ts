import type { JMAPSession, JMAPRequest, JMAPResponse, JMAPError } from "./types";

export interface Credentials {
  username: string;
  password: string;
}

export class JMAPClientError extends Error {
  constructor(
    message: string,
    public readonly type: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = "JMAPClientError";
  }
}

function basicAuth(credentials: Credentials): string {
  return "Basic " + btoa(`${credentials.username}:${credentials.password}`);
}

/**
 * Fetch JMAP session from server's well-known endpoint.
 * This is the first call to make — it returns the API URL and account info.
 */
export async function initSession(
  serverUrl: string,
  credentials: Credentials
): Promise<JMAPSession> {
  const wellKnown = new URL("/.well-known/jmap", serverUrl).toString();

  const response = await fetch(wellKnown, {
    headers: {
      Authorization: basicAuth(credentials),
      Accept: "application/json",
    },
  });

  if (response.status === 401) {
    throw new JMAPClientError("Invalid credentials", "unauthorized");
  }

  if (!response.ok) {
    throw new JMAPClientError(
      `Failed to fetch JMAP session: ${response.status} ${response.statusText}`,
      "sessionFetchError"
    );
  }

  return response.json() as Promise<JMAPSession>;
}

/**
 * Make a JMAP API call with one or more method calls.
 * All JMAP operations go through this function.
 */
export async function call(
  session: JMAPSession,
  credentials: Credentials,
  request: JMAPRequest
): Promise<JMAPResponse> {
  const response = await fetch(session.apiUrl, {
    method: "POST",
    headers: {
      Authorization: basicAuth(credentials),
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new JMAPClientError(
      `JMAP API error: ${response.status} ${response.statusText}`,
      "apiError"
    );
  }

  return response.json() as Promise<JMAPResponse>;
}

/**
 * Extract a typed response from a JMAP response by callId.
 * Throws if the method returned an error or the callId is not found.
 */
export function getFirstResponse<T = Record<string, unknown>>(
  jmapResponse: JMAPResponse,
  callId: string
): T {
  const methodResponse = jmapResponse.methodResponses.find(
    ([, , id]) => id === callId
  );

  if (!methodResponse) {
    throw new JMAPClientError(
      `No response for callId: ${callId}`,
      "missingResponse"
    );
  }

  const [method, response] = methodResponse;

  if (method === "error") {
    const err = response as unknown as JMAPError;
    throw new JMAPClientError(
      err.description ?? "JMAP method error",
      err.type
    );
  }

  return response as T;
}
