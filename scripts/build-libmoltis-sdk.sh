#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
DIST_DIR="${REPO_ROOT}/sdks/libmoltis/dist"
HEADER_DIR="${REPO_ROOT}/apps/macos/Generated"
HEADER_FILE="${HEADER_DIR}/moltis_bridge.h"

if [[ "$(uname -s)" != "Darwin" ]]; then
  echo "error: libmoltis SDK packaging currently requires macOS (xcodebuild + lipo)." >&2
  exit 1
fi

./scripts/build-swift-bridge.sh

X64_LIB="${REPO_ROOT}/target/x86_64-apple-darwin/release/libmoltis_swift_bridge.a"
ARM64_LIB="${REPO_ROOT}/target/aarch64-apple-darwin/release/libmoltis_swift_bridge.a"
UNIVERSAL_LIB="${HEADER_DIR}/libmoltis_bridge.a"
XCFRAMEWORK_PATH="${DIST_DIR}/MoltisBridge.xcframework"
ZIP_PATH="${DIST_DIR}/MoltisBridge.xcframework.zip"

if [[ ! -f "${HEADER_FILE}" ]]; then
  echo "error: expected generated header at ${HEADER_FILE}" >&2
  exit 1
fi

if [[ ! -f "${X64_LIB}" || ! -f "${ARM64_LIB}" ]]; then
  echo "error: missing architecture libraries from swift bridge build" >&2
  exit 1
fi

rm -rf "${XCFRAMEWORK_PATH}" "${ZIP_PATH}"
mkdir -p "${DIST_DIR}"

xcodebuild -create-xcframework \
  -library "${X64_LIB}" -headers "${HEADER_DIR}" \
  -library "${ARM64_LIB}" -headers "${HEADER_DIR}" \
  -output "${XCFRAMEWORK_PATH}"

cp "${HEADER_FILE}" "${DIST_DIR}/moltis_bridge.h"
cp "${UNIVERSAL_LIB}" "${DIST_DIR}/libmoltis_bridge.a"

ditto -c -k --sequesterRsrc --keepParent "${XCFRAMEWORK_PATH}" "${ZIP_PATH}"

echo "Built libmoltis SDK artifacts:"
echo "  - ${DIST_DIR}/moltis_bridge.h"
echo "  - ${DIST_DIR}/libmoltis_bridge.a"
echo "  - ${XCFRAMEWORK_PATH}"
echo "  - ${ZIP_PATH}"
