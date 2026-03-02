# TypeScript SDK

Path: `sdks/typescript`

## Generate types

```bash
cd sdks/typescript
npm ci
npm run generate
```

## Validate

```bash
npm run typecheck
npm run test
```

## Build

```bash
npm run build
```

The TypeScript SDK uses GraphQL Code Generator `client` preset and supports both HTTP request/response and WebSocket subscriptions.
