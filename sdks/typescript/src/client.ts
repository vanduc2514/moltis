import { print, type TypedQueryDocumentNode } from "graphql";
import { GraphQLClient } from "graphql-request";
import { createClient, type Client, type ClientOptions } from "graphql-ws";

import {
  GraphQLResponseError,
  MoltisSdkError,
  TransportError,
  normalizeSdkError
} from "./errors.js";

export interface MoltisClientOptions {
  endpoint: string;
  apiKey?: string;
  headers?: Readonly<Record<string, string>>;
  fetch?: typeof fetch;
  wsEndpoint?: string;
  webSocketImpl?: ClientOptions["webSocketImpl"];
}

export interface SubscriptionHandlers {
  onNext: (data: unknown) => void;
  onError?: (error: MoltisSdkError) => void;
  onComplete?: () => void;
}

function buildHeaders(options: MoltisClientOptions): Record<string, string> {
  const headers: Record<string, string> = {};

  if (options.apiKey) {
    headers.Authorization = `Bearer ${options.apiKey}`;
  }

  if (options.headers) {
    for (const [key, value] of Object.entries(options.headers)) {
      headers[key] = value;
    }
  }

  return headers;
}

export function toWebSocketEndpoint(httpEndpoint: string): string {
  if (httpEndpoint.startsWith("https://")) {
    return httpEndpoint.replace("https://", "wss://");
  }

  if (httpEndpoint.startsWith("http://")) {
    return httpEndpoint.replace("http://", "ws://");
  }

  return httpEndpoint;
}

export class MoltisGraphQLClient {
  private readonly httpClient: GraphQLClient;
  private readonly wsClient: Client;

  constructor(options: MoltisClientOptions) {
    const headers = buildHeaders(options);

    const requestConfig: { headers: Record<string, string>; fetch?: typeof fetch } = { headers };
    if (options.fetch) {
      requestConfig.fetch = options.fetch;
    }

    this.httpClient = new GraphQLClient(options.endpoint, requestConfig);

    const wsEndpoint = options.wsEndpoint ?? toWebSocketEndpoint(options.endpoint);
    const wsOptions: ClientOptions = {
      url: wsEndpoint
    };
    if (options.webSocketImpl) {
      wsOptions.webSocketImpl = options.webSocketImpl;
    }
    if (Object.keys(headers).length > 0) {
      wsOptions.connectionParams = { headers };
    }

    this.wsClient = createClient(wsOptions);
  }

  async query<TData, TVariables extends Record<string, unknown>>(
    document: TypedQueryDocumentNode<TData, TVariables>,
    variables: TVariables
  ): Promise<TData> {
    return this.execute(document, variables);
  }

  async queryNoVariables<TData>(
    document: TypedQueryDocumentNode<TData, Record<string, never>>
  ): Promise<TData> {
    return this.execute(document, {});
  }

  async mutate<TData, TVariables extends Record<string, unknown>>(
    document: TypedQueryDocumentNode<TData, TVariables>,
    variables: TVariables
  ): Promise<TData> {
    return this.execute(document, variables);
  }

  subscribe(
    query: TypedQueryDocumentNode<unknown, Record<string, unknown>>,
    variables: Record<string, unknown>,
    handlers: SubscriptionHandlers
  ): () => void {
    return this.wsClient.subscribe(
      {
        query: print(query),
        variables
      },
      {
        next: (payload) => {
          if (payload.errors && payload.errors.length > 0) {
            const messages = payload.errors.map((entry) => entry.message);
            handlers.onError?.(new GraphQLResponseError(messages));
            return;
          }

          handlers.onNext(payload.data);
        },
        error: (error) => {
          handlers.onError?.(normalizeSdkError(error));
        },
        complete: () => {
          handlers.onComplete?.();
        }
      }
    );
  }

  private async execute<TData, TVariables extends Record<string, unknown>>(
    document: TypedQueryDocumentNode<TData, TVariables>,
    variables: TVariables
  ): Promise<TData> {
    try {
      const response = await this.httpClient.rawRequest<TData, TVariables>(
        print(document),
        variables
      );
      return response.data;
    } catch (error) {
      throw normalizeSdkError(error);
    }
  }

  close(): void {
    this.wsClient.dispose();
  }
}
