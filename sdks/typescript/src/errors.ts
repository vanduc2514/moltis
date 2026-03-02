import { ClientError } from "graphql-request";

export class MoltisSdkError extends Error {
  readonly statusCode?: number;

  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = "MoltisSdkError";
    if (statusCode !== undefined) {
      this.statusCode = statusCode;
    }
  }
}

export class DisabledError extends MoltisSdkError {
  constructor(message = "GraphQL is disabled on this Moltis server") {
    super(message, 503);
    this.name = "DisabledError";
  }
}

export class AuthError extends MoltisSdkError {
  constructor(message = "Authentication failed", statusCode?: number) {
    super(message, statusCode);
    this.name = "AuthError";
  }
}

export class GraphQLResponseError extends MoltisSdkError {
  readonly messages: readonly string[];

  constructor(messages: readonly string[], statusCode?: number) {
    super(messages.join(" | ") || "GraphQL request failed", statusCode);
    this.name = "GraphQLResponseError";
    this.messages = messages;
  }
}

export class TransportError extends MoltisSdkError {
  constructor(message: string, statusCode?: number) {
    super(message, statusCode);
    this.name = "TransportError";
  }
}

export function normalizeSdkError(error: unknown): MoltisSdkError {
  if (error instanceof MoltisSdkError) {
    return error;
  }

  if (error instanceof ClientError) {
    const statusCode = error.response.status;
    const messages = error.response.errors?.map((entry) => entry.message) ?? [];

    if (statusCode === 503 || messages.includes("graphql server is disabled")) {
      return new DisabledError(messages[0]);
    }

    if (statusCode === 401 || statusCode === 403) {
      return new AuthError(messages[0], statusCode);
    }

    if (messages.length > 0) {
      return new GraphQLResponseError(messages, statusCode);
    }

    return new TransportError(error.message, statusCode);
  }

  if (error instanceof Error) {
    return new TransportError(error.message);
  }

  return new TransportError("Unknown error");
}
