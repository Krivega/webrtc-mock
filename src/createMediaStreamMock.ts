import type MediaStreamTrackMock from './mediaStreamTrackMock';
import {
  createAudioMediaStreamTrackMock,
  createVideoMediaStreamTrackMock,
  createAudioContextAudioMediaStreamTrackMock,
  createCanvasVideoMediaStreamTrackMock,
} from './createMediaStreamTrackMock';
import MediaStreamMock from './MediaStreamMock';

const createMediaStreamMock = (
  constraints: MediaStreamConstraints,
  constraintsOptions: { fromCanvas?: boolean; fromAudioContext?: boolean } = {}
) => {
  const { fromCanvas, fromAudioContext } = constraintsOptions;
  const tracks: MediaStreamTrackMock[] = [];

  if (constraints.audio && !fromAudioContext) {
    tracks.push(
      createAudioMediaStreamTrackMock({
        // @ts-ignore
        id: constraints.audio.deviceId.exact,
        // @ts-ignore
        deviceId: constraints.audio.deviceId,
        constraints: constraints.audio,
      })
    );
  }

  if (constraints.video && !fromCanvas) {
    tracks.push(
      createVideoMediaStreamTrackMock({
        // @ts-ignore
        id: constraints.video.deviceId.exact,
        // @ts-ignore
        deviceId: constraints.video.deviceId,
        constraints: constraints.video,
      })
    );
  }

  let mediaStreamMock = new MediaStreamMock(tracks);

  if (fromCanvas && fromAudioContext) {
    mediaStreamMock = new MediaStreamMock([
      createCanvasVideoMediaStreamTrackMock(),
      createAudioContextAudioMediaStreamTrackMock(),
    ]);
  } else if (fromCanvas) {
    mediaStreamMock.addTrack(createCanvasVideoMediaStreamTrackMock());
  } else if (fromAudioContext) {
    mediaStreamMock.addTrack(createAudioContextAudioMediaStreamTrackMock());
  }

  return mediaStreamMock;
};

export default createMediaStreamMock;
