# moltis-sdk

Official Python SDK for Moltis GraphQL.

## Install

```bash
uv add moltis-sdk
```

## Generate typed operations

```bash
uv run --no-sync ariadne-codegen
```

The generator uses the shared schema and operations:

- `../schema/schema.graphqls`
- `../operations/**`

## Usage

```python
from moltis_sdk import MoltisClientOptions, MoltisGraphQLClient

client = MoltisGraphQLClient(
    MoltisClientOptions(
        endpoint="http://localhost:13131/graphql",
        api_key="mk_...",
    )
)
```
