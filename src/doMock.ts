import { VIDEO_KIND, AUDIO_INPUT_KIND, AUDIO_OUTPUT_KIND } from './devicesMock';
import MediaStreamMock from './MediaStreamMock';
import mediaDevicesMock from './mediaDevicesMock';
import type { IGlobal } from './global';

declare let global: IGlobal;

const doMock = () => {
  global.MediaStream = MediaStreamMock;
  global.navigator.mediaDevices = mediaDevicesMock;
  global.DEVICES_AVAILABLE = {
    [VIDEO_KIND]: true,
    [AUDIO_INPUT_KIND]: true,
    [AUDIO_OUTPUT_KIND]: true,
  };
  global.COUNT_DEVICES_AVAILABLE = {
    [VIDEO_KIND]: 1,
    [AUDIO_INPUT_KIND]: 1,
    [AUDIO_OUTPUT_KIND]: 1,
  };
  global.DEVICES_USER_NOT_ACCESS = {
    [VIDEO_KIND]: false,
    [AUDIO_INPUT_KIND]: false,
    [AUDIO_OUTPUT_KIND]: false,
  };
};

export default doMock;
