# libmoltis SDK

Path: `sdks/libmoltis`

`libmoltis` packages the native C ABI from `crates/swift-bridge` for external native app consumers.

## Build artifacts

```bash
just sdk-libmoltis-build
```

Produced files:

- `sdks/libmoltis/dist/moltis_bridge.h`
- `sdks/libmoltis/dist/libmoltis_bridge.a`
- `sdks/libmoltis/dist/MoltisBridge.xcframework`
- `sdks/libmoltis/dist/MoltisBridge.xcframework.zip`

Use these artifacts from Swift, Objective-C, or C/C++ host applications.
