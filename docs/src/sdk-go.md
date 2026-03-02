# Go SDK

Path: `sdks/go`

## Generate types

```bash
cd sdks/go
go mod tidy
go generate ./...
```

## Validate

```bash
go vet ./...
go test ./...
```

The Go SDK uses `genqlient` for type-safe operation generation from shared Moltis GraphQL operations.
