#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
IOS_SCHEMA_PATH="${REPO_ROOT}/apps/ios/GraphQL/Schema/schema.graphqls"
SDK_SCHEMA_PATH="${REPO_ROOT}/sdks/schema/schema.graphqls"
MODE="${1:-sync}"

TMP_SCHEMA="$(mktemp)"
trap 'rm -f "${TMP_SCHEMA}"' EXIT

cargo run -p moltis-schema-export -- "${TMP_SCHEMA}"

if [[ "${MODE}" == "--check" ]]; then
  if [[ ! -f "${IOS_SCHEMA_PATH}" ]]; then
    echo "error: missing iOS schema at ${IOS_SCHEMA_PATH}" >&2
    exit 1
  fi
  if [[ ! -f "${SDK_SCHEMA_PATH}" ]]; then
    echo "error: missing SDK schema at ${SDK_SCHEMA_PATH}" >&2
    exit 1
  fi

  cmp -s "${TMP_SCHEMA}" "${IOS_SCHEMA_PATH}" || {
    echo "error: iOS schema is out of date, run ./scripts/export-graphql-schema.sh" >&2
    exit 1
  }

  cmp -s "${TMP_SCHEMA}" "${SDK_SCHEMA_PATH}" || {
    echo "error: SDK schema is out of date, run ./scripts/export-graphql-schema.sh" >&2
    exit 1
  }

  echo "GraphQL schema check passed (iOS + SDK in sync)."
  exit 0
fi

mkdir -p "$(dirname "${IOS_SCHEMA_PATH}")" "$(dirname "${SDK_SCHEMA_PATH}")"
cp "${TMP_SCHEMA}" "${IOS_SCHEMA_PATH}"
cp "${TMP_SCHEMA}" "${SDK_SCHEMA_PATH}"

echo "Synchronized GraphQL schema to:"
echo "  - ${IOS_SCHEMA_PATH}"
echo "  - ${SDK_SCHEMA_PATH}"
