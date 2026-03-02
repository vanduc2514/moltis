# SDKs

Moltis publishes multiple SDK tracks built from one shared GraphQL schema and operation set.

## SDK matrix

| SDK | Path | Primary use |
|-----|------|-------------|
| TypeScript | `sdks/typescript` | Browser + Node integrations |
| Python | `sdks/python` | Automation, backend services, notebooks |
| Go | `sdks/go` | Backend services and infrastructure tooling |
| libmoltis | `sdks/libmoltis` | Native app embedding via C ABI |

Compatibility mapping is tracked in [`sdks/compatibility.json`](https://github.com/moltis-org/moltis/blob/main/sdks/compatibility.json).

## Shared generation inputs

All SDKs consume:

- `sdks/schema/schema.graphqls`
- `sdks/operations/**/*.graphql`

Schema synchronization command:

```bash
just sdk-schema-export
```

Validation command:

```bash
just sdk-schema-check
```

## CI and release

- SDK CI workflow: `.github/workflows/sdk-ci.yml`
- SDK release workflow: `.github/workflows/sdk-release.yml`

These run independently from core Moltis package release workflows.
