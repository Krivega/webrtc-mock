import MediaStreamMock from './MediaStreamMock';
import { AUDIO_INPUT_KIND, AUDIO_OUTPUT_KIND, VIDEO_KIND } from './devicesMock';
import type { IGlobal } from './global';
import MediaDevicesMock from './mediaDevicesMock';

declare let global: IGlobal;

const doMock = () => {
  global.MediaStream = MediaStreamMock;
  global.navigator.mediaDevices = new MediaDevicesMock();
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
  global.DEVICES_BUSY = {
    [VIDEO_KIND]: [],
  };
  global.DEVICES_NOT_FOUND = {
    [VIDEO_KIND]: [],
  };
  global.DEVICES_PERMISSION_DENIED_BY_SYSTEM = {
    [VIDEO_KIND]: [],
  };
};

export default doMock;
