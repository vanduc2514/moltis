# libmoltis SDK

Native bridge SDK built from `crates/swift-bridge`.

## Artifacts

`./scripts/build-libmoltis-sdk.sh` builds and packages:

- `dist/moltis_bridge.h`
- `dist/libmoltis_bridge.a` (universal macOS static library)
- `dist/MoltisBridge.xcframework`
- `dist/MoltisBridge.xcframework.zip`

## Build

```bash
just sdk-libmoltis-build
```

The build reuses the existing bridge pipeline (`scripts/build-swift-bridge.sh`) and then wraps architecture libraries in an XCFramework.

## C ABI surface

The exported symbols are declared in `moltis_bridge.h` and implemented in `crates/swift-bridge/src/lib.rs`.

## Versioning policy

- Patch releases: bug fixes, no ABI changes
- Minor releases: additive ABI changes only
- Major releases: ABI-breaking changes
