import {
  createAudioMediaStreamTrackMock,
  createVideoMediaStreamTrackMock,
  createAudioContextAudioMediaStreamTrackMock,
  createCanvasVideoMediaStreamTrackMock,
} from './createMediaStreamTrackMock';
import {
  VIDEO_KIND,
  AUDIO_INPUT_KIND,
  AUDIO_OUTPUT_KIND,
  generateDeviceId,
  hasUserNotAccessDevice,
  parseDevice,
  getAvailableDevices,
  videoDevicesAvailableResolutions,
  hasAvailableResolution,
  getAvailableResolution,
} from './devicesMock';

const devicesMock = {
  VIDEO_KIND,
  AUDIO_INPUT_KIND,
  AUDIO_OUTPUT_KIND,
  generateDeviceId,
  hasUserNotAccessDevice,
  parseDevice,
  getAvailableDevices,
  videoDevicesAvailableResolutions,
  hasAvailableResolution,
  getAvailableResolution,
};

export { default as MediaStreamTrackMock } from './MediaStreamTrackMock';
export { default as MediaStreamMock } from './MediaStreamMock';
export { default as getAudioContextMediaStreamMock } from './getAudioContextMediaStreamMock';
export { default as getCanvasMediaStreamMock } from './getCanvasMediaStreamMock';
export { default as createMediaStreamMock } from './createMediaStreamMock';
export { default as parseTracks } from './utils/parseTracks';
export { default as parseObject } from './utils/parseObject';
export { default as parseMediaStream } from './utils/parseMediaStream';
export { default as parseMediaStreamWithoutId } from './utils/parseMediaStreamWithoutId';
export { default as resolveParseArray } from './utils/resolveParseArray';
export { default as getAvailableDevicesWithResolutions } from './getAvailableDevicesWithResolutions';
export { default as MediaDevicesMock } from './MediaDevicesMock';
export { default as resolutionsList } from './resolutionsList';
export { default as doMock } from './doMock';

export {
  createAudioMediaStreamTrackMock,
  createVideoMediaStreamTrackMock,
  createAudioContextAudioMediaStreamTrackMock,
  createCanvasVideoMediaStreamTrackMock,
  devicesMock,
};
