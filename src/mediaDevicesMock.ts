import Events from 'events-constructor';
import createMediaStreamMock from './createMediaStreamMock';
import {
  getAvailableDevices,
  hasAvailableResolution,
  hasUserNotAccessDevice,
  setCountVideoDevicesAvailable,
  setCountAudioInDevicesAvailable,
  VIDEO_KIND,
  AUDIO_INPUT_KIND,
} from './devicesMock';

type TEventNames = typeof eventsNames;
type TEventName = TEventNames[number];
type THandler = (event: Event) => void;

const DEVICE_CHANGE = 'devicechange'

const eventsNames = [
  DEVICE_CHANGE,
] as const;

class MediaDevicesMock {
  private _events: Events<TEventNames>;

  constructor() {
    this._events = new Events(eventsNames);
  }

  getUserMedia = (constraints: MediaStreamConstraints) => {
    let videoDeviceId;
    let audioDeviceId;

    if (
      constraints &&
      constraints.video &&
      typeof constraints.video === 'object' &&
      typeof constraints.video.deviceId === 'object' &&
      !Array.isArray(constraints.video.deviceId)
    ) {
      videoDeviceId = constraints.video.deviceId.exact;
    } else if (
      constraints &&
      constraints.video === true &&
      getAvailableDevices().find(({ kind }) => {
        return kind === VIDEO_KIND;
      })
    ) {
      videoDeviceId = getAvailableDevices().find(({ kind }) => {
        return kind === VIDEO_KIND;
      })!.deviceId;
      constraints.video = {
        deviceId: {
          exact: videoDeviceId,
        },
      };
    } else if (constraints && constraints.video === true) {
      constraints.video = {
        deviceId: {
          exact: 'notAvailableDevice',
        },
      };
    }

    if (
      constraints &&
      constraints.audio &&
      typeof constraints.audio === 'object' &&
      typeof constraints.audio.deviceId === 'object' &&
      !Array.isArray(constraints.audio.deviceId)
    ) {
      audioDeviceId = constraints.audio.deviceId.exact;
    } else if (
      constraints &&
      constraints.audio === true &&
      getAvailableDevices().find(({ kind }) => {
        return kind === AUDIO_INPUT_KIND;
      })
    ) {
      audioDeviceId = getAvailableDevices().find(({ kind }) => {
        return kind === AUDIO_INPUT_KIND;
      })!.deviceId;
      constraints.audio = {
        deviceId: {
          exact: audioDeviceId,
        },
      };
    } else if (constraints && constraints.audio === true) {
      constraints.audio = {
        deviceId: {
          exact: 'notAvailableDevice',
        },
      };
    }

    if (
      videoDeviceId &&
      typeof videoDeviceId === 'string' &&
      hasUserNotAccessDevice(videoDeviceId)
    ) {
      return Promise.reject(new Error(`Video DeviceId is not available: ${videoDeviceId}`));
    }

    if (
      videoDeviceId &&
      typeof videoDeviceId === 'string' &&
      typeof constraints.video === 'object' &&
      typeof constraints.video.height === 'object' &&
      constraints.video.height &&
      constraints.video.height.exact &&
      !hasAvailableResolution({
        deviceId: videoDeviceId,
        exactHeight: constraints.video.height.exact,
      })
    ) {
      return Promise.reject(
        new Error(
          `Resolution height:${constraints.video.height.exact} is not available: ${videoDeviceId}`
        )
      );
    }

    if (
      audioDeviceId &&
      typeof audioDeviceId === 'string' &&
      hasUserNotAccessDevice(audioDeviceId)
    ) {
      return Promise.reject(new Error(`Audio DeviceId is not available: ${audioDeviceId}`));
    }

    // empty function parseConstraints for not parse constraints
    return Promise.resolve(createMediaStreamMock(constraints));
  };
  enumerateDevices = () => {
    return new Promise((resolve) => {
      return setTimeout(() => {
        return resolve(getAvailableDevices());
      }, 100);
    });
  };

  addEventListener = (eventName: TEventName, handler: THandler) => {
    this._events.on(eventName, handler);
  };

  removeEventListener = (eventName: TEventName, handler: THandler) => {
    this._events.off(eventName, handler);
  };

  triggerVideoDeviceAdded = () => {
    this._addVideoDevice();
    this._events.trigger(DEVICE_CHANGE, undefined)
  }

  triggerVideoDeviceRemoved = () => {
    this._removeVideoDevice();
    this._events.trigger(DEVICE_CHANGE, undefined)
  }

  triggerAudioInDeviceAdded = () => {
    this._addAudioInDevice();
    this._events.trigger(DEVICE_CHANGE, undefined)
  }

  triggerAudioInDeviceRemoved = () => {
    this._removeAudioInDevice();
    this._events.trigger(DEVICE_CHANGE, undefined)
  }

  private _addVideoDevice = () => {
    setCountVideoDevicesAvailable(3)
  };

  private _removeVideoDevice = () => {
    setCountVideoDevicesAvailable(1)
  };

  private _addAudioInDevice = () => {
    setCountAudioInDevicesAvailable(3)
  };

  private _removeAudioInDevice = () => {
    setCountAudioInDevicesAvailable(1)
  };

};

export default MediaDevicesMock;
