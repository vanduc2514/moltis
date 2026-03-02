# @moltis/sdk

Official TypeScript SDK for Moltis GraphQL.

## Install

```bash
npm install @moltis/sdk
```

## Generate typed operations

```bash
npm run generate
```

The SDK generates types and typed document nodes from:

- `../schema/schema.graphqls`
- `../operations/**/*.graphql`

## Usage

```ts
import { MoltisGraphQLClient } from "@moltis/sdk";

const client = new MoltisGraphQLClient({
  endpoint: "http://localhost:13131/graphql",
  apiKey: process.env.MOLTIS_API_KEY
});
```

## Scripts

- `npm run generate` generate typed GraphQL documents
- `npm run typecheck` run strict type checking
- `npm run test` run unit tests
- `npm run build` generate and compile distributable output
