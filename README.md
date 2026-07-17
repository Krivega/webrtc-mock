# webrtc-mock

[![npm](https://img.shields.io/npm/v/webrtc-mock?style=flat-square)](https://www.npmjs.com/package/webrtc-mock)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/webrtc-mock?style=flat-square)

Mock WebRTC / Media Capture APIs for unit and integration tests in Node.js (and browser-like test environments).

The library replaces `navigator.mediaDevices` and `MediaStream` with controllable mocks, so you can test camera/mic flows, device enumeration, constraints, and error scenarios without real hardware.

## Features

- Mock `navigator.mediaDevices` (`getUserMedia`, `getDisplayMedia`, `enumerateDevices`, `devicechange`)
- Mock `MediaStream` / `MediaStreamTrack` with events (`addtrack`, `removetrack`, `ended`, `mute`, …)
- Simulate device availability, permissions, busy devices, and not-found errors
- Configurable track capabilities (width / height)
- Helpers for canvas / AudioContext-like tracks and stream snapshots for assertions
- Dual package: ESM + CJS, TypeScript types included

## Install

```sh
npm install webrtc-mock
```

```sh
yarn add webrtc-mock
```

**Peer dependencies:** `events-constructor`, `@types/dom-mediacapture-transform`.

## Quick start

### Jest / Vitest setup file

Install mocks once globally (typical `setupTests.ts` / `setupFilesAfterEnv`):

```ts
import { doMock } from 'webrtc-mock';

// Ensure navigator exists in Node test environments
// @ts-expect-error — Node may not declare navigator
global.navigator ??= {};

doMock();
```

After that, media APIs are available on `global`:

```ts
const stream = await navigator.mediaDevices.getUserMedia({
  audio: true,
  video: true,
});

const devices = await navigator.mediaDevices.enumerateDevices();
```

`doMock()` sets:

| Global                                                                       | Default                                |
| ---------------------------------------------------------------------------- | -------------------------------------- |
| `MediaStream`                                                                | `MediaStreamMock`                      |
| `navigator.mediaDevices`                                                     | `MediaDevicesMock` instance            |
| `COUNT_DEVICES_AVAILABLE`                                                    | 1 video / 1 audioinput / 1 audiooutput |
| `DEVICES_USER_NOT_ACCESS`                                                    | all `false`                            |
| `DEVICES_BUSY` / `DEVICES_NOT_FOUND` / `DEVICES_PERMISSION_DENIED_BY_SYSTEM` | empty                                  |

## Usage examples

### Create a call media stream in `beforeEach`

Common pattern for VoIP / peer-connection tests: build a stream with exact device ids and pass it into the API under test.

```ts
import { createMediaStreamMock } from 'webrtc-mock';

let mediaStream: MediaStream;

beforeEach(() => {
  mediaStream = createMediaStreamMock({
    audio: { deviceId: { exact: 'audioDeviceId' } },
    video: { deviceId: { exact: 'videoDeviceId' } },
  });
});

it('passes audio then video to the peer connection', async () => {
  const peerConnection = await call({ number: '10000', mediaStream });

  expect(peerConnection.getSenders()[0]?.track?.kind).toBe('audio');
  expect(peerConnection.getSenders()[1]?.track?.kind).toBe('video');
  expect(mediaStream.getAudioTracks()).toHaveLength(1);
  expect(mediaStream.getVideoTracks()).toHaveLength(1);
});
```

### Extract a single presentation / content video track

When you need only a video track (screen share, presentation, content stream):

```ts
import { createMediaStreamMock } from 'webrtc-mock';

const videoTrack = createMediaStreamMock({
  video: { deviceId: { exact: 'videoDeviceId' } },
}).getVideoTracks()[0] as MediaStreamVideoTrack;

await startPresentation(videoTrack);
```

Audio-only or video-only streams work the same way — omit the unused constraint key:

```ts
const audioOnly = createMediaStreamMock({
  audio: { deviceId: { exact: 'audioDeviceId' } },
});

const videoOnly = createMediaStreamMock({
  video: { deviceId: { exact: 'videoDeviceId' } },
});
```

### Build a multi-track stream with constructors

Useful for store / user-media unit tests where tracks are assigned individually:

```ts
import { MediaStreamMock, MediaStreamTrackMock } from 'webrtc-mock';

const cameraTrack = new MediaStreamTrackMock('video');
const avatarTrack = new MediaStreamTrackMock('video');
const micTrack = new MediaStreamTrackMock('audio');

const mediaStream = new MediaStreamMock([cameraTrack, avatarTrack, micTrack]);

userMediaStore.videoTrack.setTrack(mediaStream.getVideoTracks()[0]);

expect(getVideoTrackForPresentation()).toBeDefined();
expect(getVideoTrackForPresentation()).not.toBe(userMediaStore.videoTrackReal);
```

### Video track with fixed resolution constraints

```ts
import { createVideoMediaStreamTrackMock } from 'webrtc-mock';

const videoTrack = createVideoMediaStreamTrackMock({
  constraints: { width: 1920, height: 1080 },
}) as MediaStreamVideoTrack;

expect(videoTrack.getSettings()).toMatchObject({
  width: 1920,
  height: 1080,
});
```

### Dynamic `getSettings()` (resolution changes in tests)

Override `getSettings` when the code under test reacts to resolution changes (for example a video sending balancer / track monitor):

```ts
import { createVideoMediaStreamTrackMock } from 'webrtc-mock';

const createMockTrack = (initialWidth: number) => {
  let width = initialWidth;

  const track = createVideoMediaStreamTrackMock({
    constraints: { width, height: 480 },
  });

  Object.defineProperty(track, 'getSettings', {
    value: jest.fn(() => {
      return { width, height: 480 };
    }),
  });

  const setWidth = (newWidth: number) => {
    width = newWidth;
  };

  return { track, setWidth };
};

const { track, setWidth } = createMockTrack(640);

expect(track.getSettings().width).toBe(640);

setWidth(320);
expect(track.getSettings().width).toBe(320);
```

### Compose tracks into a custom stream

```ts
import {
  createAudioMediaStreamTrackMock,
  createVideoMediaStreamTrackMock,
  MediaStreamMock,
} from 'webrtc-mock';

const videoTrack = createVideoMediaStreamTrackMock({
  id: 'cam-1',
  constraints: { width: { ideal: 1280 }, height: { ideal: 720 } },
});

const stream = new MediaStreamMock([videoTrack, createAudioMediaStreamTrackMock({ id: 'mic-1' })]);
```

### Canvas / AudioContext-like streams

```ts
import {
  getCanvasMediaStreamMock,
  getAudioContextMediaStreamMock,
  createMediaStreamMock,
} from 'webrtc-mock';

const canvasStream = await getCanvasMediaStreamMock();
const audioContextStream = await getAudioContextMediaStreamMock();

const mixed = createMediaStreamMock({}, { fromCanvas: true, fromAudioContext: true });
```

### Simulate device errors and access restrictions

After `doMock()`, `navigator.mediaDevices` exposes helpers for test scenarios:

```ts
const { mediaDevices } = navigator;

// Change how many devices enumerateDevices() returns (fires devicechange)
mediaDevices.setCountVideoDevicesAvailable(2);
mediaDevices.setCountAudioInDevicesAvailable(0);

// Deny permission / access
mediaDevices.setUserNotAccessVideo(true);
mediaDevices.setUserNotAccessAudioIn(true);
mediaDevices.setUserNotAccessAll(true);

// Per-device failure modes for getUserMedia
mediaDevices.setBusyVideoDevice('videoinputDeviceId'); // NotReadableError
mediaDevices.setNotFoundVideoDevice('videoinputDeviceId'); // NotFoundError
mediaDevices.setPermissionDeniedBySystem('videoinputDeviceId');

// Reset restrictions
mediaDevices.unsetBusyVideoDevice('videoinputDeviceId');
mediaDevices.unsetAllRestrictions();
```

### Track capabilities

```ts
import {
  setCapabilities,
  setMaxWidthCapabilities,
  setMaxHeightCapabilities,
  resetCapabilities,
} from 'webrtc-mock';

setMaxWidthCapabilities(1920);
setMaxHeightCapabilities(1080);

setCapabilities({
  width: { min: 320, max: 1920 },
  height: { min: 240, max: 1080 },
});

resetCapabilities();
```

### Assert on stream shape

```ts
import { parseMediaStream, parseMediaStreamWithoutId, parseTracks } from 'webrtc-mock';

const snapshot = parseMediaStream(stream);
const withoutIds = parseMediaStreamWithoutId(stream);
const tracks = parseTracks(stream.getTracks());
```

## Public API

| Export                                                                                                 | Description                                 |
| ------------------------------------------------------------------------------------------------------ | ------------------------------------------- |
| `doMock`                                                                                               | Install mocks on `global` / `navigator`     |
| `MediaStreamMock`                                                                                      | `MediaStream` implementation                |
| `MediaStreamTrackMock`                                                                                 | `MediaStreamTrack` implementation           |
| `createMediaStreamMock`                                                                                | Build a stream from constraints             |
| `createAudioMediaStreamTrackMock` / `createVideoMediaStreamTrackMock`                                  | Track factories                             |
| `createCanvasVideoMediaStreamTrackMock` / `createAudioContextAudioMediaStreamTrackMock`                | Special track factories                     |
| `getCanvasMediaStreamMock` / `getAudioContextMediaStreamMock`                                          | Ready-made streams                          |
| `getAvailableDevices` / `getAvailableDevicesWithResolutions`                                           | Device lists (+ resolutions / access flags) |
| `resolutionsList`                                                                                      | CIF, 360p, 720p, 1080p presets              |
| `setCapabilities` / `resetCapabilities` / `setMin*Capabilities` / `setMax*Capabilities`                | Control `getCapabilities()`                 |
| `parseMediaStream` / `parseMediaStreamWithoutId` / `parseTracks` / `parseObject` / `resolveParseArray` | Helpers for snapshots / comparisons         |
| `MediaStreamUnionTrack`, `TGlobal`                                                                     | TypeScript types                            |

## Development

```sh
yarn install
yarn build   # Vite library build → dist/ (ESM + CJS + .d.ts)
yarn lint    # TypeScript check + ESLint
```

Published package contents: `dist/` only (`prepublishOnly` runs `yarn build`).

## Maintainer

**Krivega Dmitriy**

- Website: https://krivega.com
- GitHub: [@Krivega](https://github.com/Krivega)

## Contributing

Issues and feature requests are welcome: [GitHub Issues](https://github.com/Krivega/webrtc-mock/issues).

## License

Copyright © 2021–2026 [Krivega Dmitriy](https://github.com/Krivega).  
This project is [MIT](https://github.com/Krivega/webrtc-mock/blob/master/LICENSE) licensed.
