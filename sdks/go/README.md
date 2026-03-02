# Moltis Go SDK

Official Go SDK for Moltis GraphQL.

## Install

```bash
go get github.com/moltis-org/moltis/sdks/go@latest
```

## Generate typed operations

```bash
go generate ./...
```

`genqlient` is configured to read:

- `../schema/schema.graphqls`
- `../operations/**/*.graphql`

## Usage

```go
sdk := client.New(client.Options{
    Endpoint: "http://localhost:13131/graphql",
    APIKey:   "mk_...",
})
```
