/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  createAudioContextAudioMediaStreamTrackMock,
  createAudioMediaStreamTrackMock,
  createCanvasVideoMediaStreamTrackMock,
  createVideoMediaStreamTrackMock,
} from './createMediaStreamTrackMock';
import MediaStreamMock from './MediaStreamMock';

import type { MediaStreamUnionTrack } from './types';

const createMediaStreamMock = (
  constraints: MediaStreamConstraints,
  constraintsOptions: { fromCanvas?: boolean; fromAudioContext?: boolean } = {},
) => {
  const { fromCanvas, fromAudioContext } = constraintsOptions;
  const tracks: MediaStreamUnionTrack[] = [];

  if (typeof constraints.audio === 'object' && fromAudioContext !== true) {
    tracks.push(
      createAudioMediaStreamTrackMock({
        // @ts-ignore
        id: constraints.audio.deviceId.exact,
        // @ts-ignore
        deviceId: constraints.audio.deviceId,
        constraints: constraints.audio,
      }),
    );
  }

  if (typeof constraints.video === 'object' && fromCanvas !== true) {
    tracks.push(
      createVideoMediaStreamTrackMock({
        // @ts-ignore
        id: constraints.video.deviceId.exact,
        // @ts-ignore
        deviceId: constraints.video.deviceId,
        constraints: constraints.video,
      }),
    );
  }

  let mediaStreamMock = new MediaStreamMock(tracks);

  if (fromCanvas === true && fromAudioContext === true) {
    mediaStreamMock = new MediaStreamMock([
      createCanvasVideoMediaStreamTrackMock(),
      createAudioContextAudioMediaStreamTrackMock(),
    ]);
  } else if (fromCanvas === true) {
    mediaStreamMock.addTrack(createCanvasVideoMediaStreamTrackMock());
  } else if (fromAudioContext === true) {
    mediaStreamMock.addTrack(createAudioContextAudioMediaStreamTrackMock());
  }

  return mediaStreamMock;
};

export default createMediaStreamMock;
