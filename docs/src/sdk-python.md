# Python SDK

Path: `sdks/python`

## Generate types

```bash
cd sdks/python
uv sync --group dev
uv run ariadne-codegen
```

## Validate

```bash
uv run ruff check .
uv run mypy .
uv run pytest
```

## Build

```bash
uv run python -m build
```

The Python SDK uses Ariadne codegen for typed operation models and clients.
