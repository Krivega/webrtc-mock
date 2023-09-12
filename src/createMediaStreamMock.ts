/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import MediaStreamMock from './MediaStreamMock';
import {
  createAudioContextAudioMediaStreamTrackMock,
  createAudioMediaStreamTrackMock,
  createCanvasVideoMediaStreamTrackMock,
  createVideoMediaStreamTrackMock,
} from './createMediaStreamTrackMock';
import type MediaStreamTrackMock from './mediaStreamTrackMock';

const createMediaStreamMock = (
  constraints: MediaStreamConstraints,
  constraintsOptions: { fromCanvas?: boolean; fromAudioContext?: boolean } = {},
) => {
  const { fromCanvas, fromAudioContext } = constraintsOptions;
  const tracks: MediaStreamTrackMock[] = [];

  if (typeof constraints.audio === 'object' && fromAudioContext !== true) {
    tracks.push(
      createAudioMediaStreamTrackMock({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment, @typescript-eslint/prefer-ts-expect-error
        // @ts-ignore
        id: constraints.audio.deviceId.exact,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment, @typescript-eslint/prefer-ts-expect-error
        // @ts-ignore
        deviceId: constraints.audio.deviceId,
        constraints: constraints.audio,
      }),
    );
  }

  if (typeof constraints.video === 'object' && fromCanvas !== true) {
    tracks.push(
      createVideoMediaStreamTrackMock({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment, @typescript-eslint/prefer-ts-expect-error
        // @ts-ignore
        id: constraints.video.deviceId.exact,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment, @typescript-eslint/prefer-ts-expect-error
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
