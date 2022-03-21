import type MediaDevicesMock from './MediaDevicesMock';
import type MediaStreamMock from './MediaStreamMock';
import { VIDEO_KIND, AUDIO_INPUT_KIND, AUDIO_OUTPUT_KIND } from './devicesMock';

export interface IGlobal {
  DEVICES_USER_NOT_ACCESS: {
    [VIDEO_KIND]: boolean;
    [AUDIO_INPUT_KIND]: boolean;
    [AUDIO_OUTPUT_KIND]: boolean;
  };
  COUNT_DEVICES_AVAILABLE: {
    [VIDEO_KIND]: number;
    [AUDIO_INPUT_KIND]: number;
    [AUDIO_OUTPUT_KIND]: number;
  };
  DEVICES_AVAILABLE: {
    [VIDEO_KIND]: boolean;
    [AUDIO_INPUT_KIND]: boolean;
    [AUDIO_OUTPUT_KIND]: boolean;
  };
  MediaStream: typeof MediaStreamMock;
  navigator: {
    mediaDevices: typeof MediaDevicesMock;
  };
}
