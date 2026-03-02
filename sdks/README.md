# Moltis SDKs

Shared SDK workspace for generated GraphQL clients and native bridge artifacts.

## Layout

- `schema/` canonical GraphQL schema used by all SDK generators
- `operations/` shared GraphQL operations/fragments for code generation
- `typescript/` TypeScript SDK package
- `python/` Python SDK package
- `go/` Go SDK module
- `libmoltis/` native C/Swift bridge packaging assets

## Source of truth

GraphQL schema is generated from `moltis-graphql` via `moltis-schema-export`.
Do not edit `schema/schema.graphqls` manually.
