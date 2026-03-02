/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "fragment SessionFields on SessionEntry {\n  id\n  key\n  label\n  model\n  preview\n  createdAt\n  updatedAt\n  messageCount\n  lastSeenMessageCount\n  archived\n}": typeof types.SessionFieldsFragmentDoc,
    "mutation SendMessage($message: String!, $sessionKey: String, $model: String) {\n  chat {\n    send(message: $message, sessionKey: $sessionKey, model: $model) {\n      ok\n    }\n  }\n}": typeof types.SendMessageDocument,
    "mutation UpdateUserLocation($input: JSON!) {\n  agents {\n    updateIdentity(input: $input) {\n      ok\n    }\n  }\n}": typeof types.UpdateUserLocationDocument,
    "query FetchModels {\n  models {\n    list {\n      id\n      name\n      provider\n    }\n  }\n}": typeof types.FetchModelsDocument,
    "query FetchSessions {\n  sessions {\n    list {\n      ...SessionFields\n    }\n  }\n}\n\nquery SearchSessions($query: String!) {\n  sessions {\n    search(query: $query) {\n      ...SessionFields\n    }\n  }\n}": typeof types.FetchSessionsDocument,
    "query FetchStatus {\n  status {\n    hostname\n    version\n    connections\n    uptimeMs\n  }\n}": typeof types.FetchStatusDocument,
    "subscription Tick {\n  tick {\n    ts\n  }\n}": typeof types.TickDocument,
};
const documents: Documents = {
    "fragment SessionFields on SessionEntry {\n  id\n  key\n  label\n  model\n  preview\n  createdAt\n  updatedAt\n  messageCount\n  lastSeenMessageCount\n  archived\n}": types.SessionFieldsFragmentDoc,
    "mutation SendMessage($message: String!, $sessionKey: String, $model: String) {\n  chat {\n    send(message: $message, sessionKey: $sessionKey, model: $model) {\n      ok\n    }\n  }\n}": types.SendMessageDocument,
    "mutation UpdateUserLocation($input: JSON!) {\n  agents {\n    updateIdentity(input: $input) {\n      ok\n    }\n  }\n}": types.UpdateUserLocationDocument,
    "query FetchModels {\n  models {\n    list {\n      id\n      name\n      provider\n    }\n  }\n}": types.FetchModelsDocument,
    "query FetchSessions {\n  sessions {\n    list {\n      ...SessionFields\n    }\n  }\n}\n\nquery SearchSessions($query: String!) {\n  sessions {\n    search(query: $query) {\n      ...SessionFields\n    }\n  }\n}": types.FetchSessionsDocument,
    "query FetchStatus {\n  status {\n    hostname\n    version\n    connections\n    uptimeMs\n  }\n}": types.FetchStatusDocument,
    "subscription Tick {\n  tick {\n    ts\n  }\n}": types.TickDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment SessionFields on SessionEntry {\n  id\n  key\n  label\n  model\n  preview\n  createdAt\n  updatedAt\n  messageCount\n  lastSeenMessageCount\n  archived\n}"): (typeof documents)["fragment SessionFields on SessionEntry {\n  id\n  key\n  label\n  model\n  preview\n  createdAt\n  updatedAt\n  messageCount\n  lastSeenMessageCount\n  archived\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation SendMessage($message: String!, $sessionKey: String, $model: String) {\n  chat {\n    send(message: $message, sessionKey: $sessionKey, model: $model) {\n      ok\n    }\n  }\n}"): (typeof documents)["mutation SendMessage($message: String!, $sessionKey: String, $model: String) {\n  chat {\n    send(message: $message, sessionKey: $sessionKey, model: $model) {\n      ok\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation UpdateUserLocation($input: JSON!) {\n  agents {\n    updateIdentity(input: $input) {\n      ok\n    }\n  }\n}"): (typeof documents)["mutation UpdateUserLocation($input: JSON!) {\n  agents {\n    updateIdentity(input: $input) {\n      ok\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query FetchModels {\n  models {\n    list {\n      id\n      name\n      provider\n    }\n  }\n}"): (typeof documents)["query FetchModels {\n  models {\n    list {\n      id\n      name\n      provider\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query FetchSessions {\n  sessions {\n    list {\n      ...SessionFields\n    }\n  }\n}\n\nquery SearchSessions($query: String!) {\n  sessions {\n    search(query: $query) {\n      ...SessionFields\n    }\n  }\n}"): (typeof documents)["query FetchSessions {\n  sessions {\n    list {\n      ...SessionFields\n    }\n  }\n}\n\nquery SearchSessions($query: String!) {\n  sessions {\n    search(query: $query) {\n      ...SessionFields\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query FetchStatus {\n  status {\n    hostname\n    version\n    connections\n    uptimeMs\n  }\n}"): (typeof documents)["query FetchStatus {\n  status {\n    hostname\n    version\n    connections\n    uptimeMs\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "subscription Tick {\n  tick {\n    ts\n  }\n}"): (typeof documents)["subscription Tick {\n  tick {\n    ts\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;