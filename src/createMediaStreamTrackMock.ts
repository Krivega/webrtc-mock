import type { TOptions } from './mediaStreamTrackMock';
import MediaStreamTrackMock from './mediaStreamTrackMock';

export const createAudioMediaStreamTrackMock = (options?: TOptions): MediaStreamTrackMock => {
  return new MediaStreamTrackMock('audio', options);
};

export const createVideoMediaStreamTrackMock = (options?: TOptions): MediaStreamTrackMock => {
  return new MediaStreamTrackMock('video', options);
};

export const createAudioContextAudioMediaStreamTrackMock = (): MediaStreamTrackMock => {
  return createAudioMediaStreamTrackMock({ id: 'fromAudioContext', constraints: {} });
};

export const createCanvasVideoMediaStreamTrackMock = (): MediaStreamTrackMock => {
  return createVideoMediaStreamTrackMock({ id: 'fromCanvas', constraints: {} });
};
