import Events from 'events-constructor';
import createMediaStreamMock from './createMediaStreamMock';
import {
  getNotFoundError,
  getNotReadableErrorVideo,
  getPermissionDeniedBySystemError,
  getPermissionDeniedByError,
} from './errors/errors';
import {
  setBusyVideoDevice,
  setNotFoundVideoDevice,
  setPermissionDeniedBySystem,
  setUserNotAccessVideo,
  setUserNotAccessAudioIn,
  setUserNotAccessAll,
  unsetAllRestrictions,
  unsetBusyVideoDevice,
  unsetNotFoundVideoDevice,
  unsetPermissionDeniedBySystem,
  getAvailableDevices,
  hasAvailableResolution,
  hasUserNotAccessDevice,
  hasBusyVideoDevice,
  hasNotFoundVideoDevice,
  hasPermissionDeniedBySystem,
  setCountVideoDevicesAvailable,
  setCountAudioInDevicesAvailable,
  setCountAudioOutDevicesAvailable,
  VIDEO_KIND,
  AUDIO_INPUT_KIND,
} from './devicesMock';
import { DEVICE_CHANGE } from './constants';

type TEventNames = typeof eventsNames;
type TEventName = TEventNames[number];
type THandler = (event: Event) => void;

const eventsNames = [DEVICE_CHANGE] as const;

class MediaDevicesMock {
  private _events: Events<TEventNames>;
  public getDisplayMedia: (constraints: MediaStreamConstraints) => Promise<MediaStream>;

  constructor() {
    this._events = new Events(eventsNames);
    this.getDisplayMedia = this.getUserMedia;
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
      })?.deviceId;
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
      })?.deviceId;
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

    if (videoDeviceId && typeof videoDeviceId === 'string' && hasBusyVideoDevice(videoDeviceId)) {
      const error = getNotReadableErrorVideo();

      return Promise.reject(error);
    }

    if (
      videoDeviceId &&
      typeof videoDeviceId === 'string' &&
      hasPermissionDeniedBySystem(videoDeviceId)
    ) {
      const error = getPermissionDeniedBySystemError();

      return Promise.reject(error);
    }

    if (
      videoDeviceId &&
      typeof videoDeviceId === 'string' &&
      hasNotFoundVideoDevice(videoDeviceId)
    ) {
      const error = getNotFoundError();

      return Promise.reject(error);
    }

    if (
      (videoDeviceId &&
        typeof videoDeviceId === 'string' &&
        hasUserNotAccessDevice(videoDeviceId)) ||
      (audioDeviceId && typeof audioDeviceId === 'string' && hasUserNotAccessDevice(audioDeviceId))
    ) {
      const error = getPermissionDeniedByError();

      return Promise.reject(error);
    }

    if (
      videoDeviceId &&
      typeof videoDeviceId === 'string' &&
      typeof constraints.video === 'object' &&
      typeof constraints.video.height === 'object' &&
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

  setCountVideoDevicesAvailable = (count: number) => {
    setCountVideoDevicesAvailable(count);

    this._events.trigger(DEVICE_CHANGE, undefined);
  };

  setCountAudioInDevicesAvailable = (count: number) => {
    setCountAudioInDevicesAvailable(count);

    this._events.trigger(DEVICE_CHANGE, undefined);
  };

  setCountAudioOutDevicesAvailable = (count: number) => {
    setCountAudioOutDevicesAvailable(count);

    this._events.trigger(DEVICE_CHANGE, undefined);
  };

  setBusyVideoDevice = (deviceId: string) => {
    setBusyVideoDevice(deviceId);
  };

  setNotFoundVideoDevice = (deviceId: string) => {
    setNotFoundVideoDevice(deviceId);
  };

  setPermissionDeniedBySystem = (deviceId: string) => {
    setPermissionDeniedBySystem(deviceId);
  };

  setUserNotAccessVideo = (notAccess = true) => {
    setUserNotAccessVideo(notAccess);
  };

  setUserNotAccessAudioIn = (notAccess = true) => {
    setUserNotAccessAudioIn(notAccess);
  };

  setUserNotAccessAll = (notAccess = true) => {
    setUserNotAccessAll(notAccess);
  };

  unsetAllRestrictions = () => {
    unsetAllRestrictions();
  };

  unsetBusyVideoDevice = (deviceId: string) => {
    unsetBusyVideoDevice(deviceId);
  };

  unsetNotFoundVideoDevice = (deviceId: string) => {
    unsetNotFoundVideoDevice(deviceId);
  };

  unsetPermissionDeniedBySystem = (deviceId: string) => {
    unsetPermissionDeniedBySystem(deviceId);
  };
}

export default MediaDevicesMock;
