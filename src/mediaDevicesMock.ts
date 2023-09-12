/* eslint-disable no-param-reassign */
import Events from 'events-constructor';
import { DEVICE_CHANGE } from './constants';
import createMediaStreamMock from './createMediaStreamMock';
import {
  AUDIO_INPUT_KIND,
  VIDEO_KIND,
  getAvailableDevices,
  hasAvailableResolution,
  hasBusyVideoDevice,
  hasNotFoundVideoDevice,
  hasPermissionDeniedBySystem,
  hasUserNotAccessDevice,
  setBusyVideoDevice,
  setCountAudioInDevicesAvailable,
  setCountAudioOutDevicesAvailable,
  setCountVideoDevicesAvailable,
  setNotFoundVideoDevice,
  setPermissionDeniedBySystem,
  setUserNotAccessAll,
  setUserNotAccessAudioIn,
  setUserNotAccessVideo,
  unsetAllRestrictions,
  unsetBusyVideoDevice,
  unsetNotFoundVideoDevice,
  unsetPermissionDeniedBySystem,
} from './devicesMock';
import {
  getNotFoundError,
  getNotReadableErrorVideo,
  getPermissionDeniedByError,
  getPermissionDeniedBySystemError,
} from './errors/errors';

type TEventNames = typeof eventsNames;
type TEventName = TEventNames[number];
type THandler = (event: Event) => void;

const eventsNames = [DEVICE_CHANGE] as const;

class MediaDevicesMock {
  private readonly events: Events<TEventNames>;

  public getDisplayMedia: (constraints: MediaStreamConstraints) => Promise<MediaStream>;

  constructor() {
    this.events = new Events(eventsNames);
    this.getDisplayMedia = this.getUserMedia;
  }

  getUserMedia = async (constraints: MediaStreamConstraints) => {
    let videoDeviceId: string[] | string | undefined = undefined;
    let audioDeviceId: string[] | string | undefined = undefined;

    if (
      typeof constraints === 'object' &&
      typeof constraints.video === 'object' &&
      typeof constraints.video.deviceId === 'object' &&
      !Array.isArray(constraints.video.deviceId)
    ) {
      videoDeviceId = constraints.video.deviceId.exact;
    } else if (
      typeof constraints === 'object' &&
      constraints.video === true &&
      getAvailableDevices().some(({ kind }) => {
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
    } else if (typeof constraints === 'object' && constraints.video === true) {
      constraints.video = {
        deviceId: {
          exact: 'notAvailableDevice',
        },
      };
    }

    if (
      typeof constraints === 'object' &&
      typeof constraints.audio === 'object' &&
      typeof constraints.audio.deviceId === 'object' &&
      !Array.isArray(constraints.audio.deviceId)
    ) {
      audioDeviceId = constraints.audio.deviceId.exact;
    } else if (
      typeof constraints === 'object' &&
      constraints.audio === true &&
      getAvailableDevices().some(({ kind }) => {
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
    } else if (typeof constraints === 'object' && constraints.audio === true) {
      constraints.audio = {
        deviceId: {
          exact: 'notAvailableDevice',
        },
      };
    }

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (videoDeviceId && typeof videoDeviceId === 'string' && hasBusyVideoDevice(videoDeviceId)) {
      const error = getNotReadableErrorVideo();

      throw error;
    }

    if (
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      videoDeviceId &&
      typeof videoDeviceId === 'string' &&
      hasPermissionDeniedBySystem(videoDeviceId)
    ) {
      const error = getPermissionDeniedBySystemError();

      throw error;
    }

    if (
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      videoDeviceId &&
      typeof videoDeviceId === 'string' &&
      hasNotFoundVideoDevice(videoDeviceId)
    ) {
      const error = getNotFoundError();

      throw error;
    }

    if (
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      (videoDeviceId &&
        typeof videoDeviceId === 'string' &&
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        hasUserNotAccessDevice(videoDeviceId)) ||
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      (audioDeviceId && typeof audioDeviceId === 'string' && hasUserNotAccessDevice(audioDeviceId))
    ) {
      const error = getPermissionDeniedByError();

      throw error;
    }

    if (
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      videoDeviceId &&
      typeof videoDeviceId === 'string' &&
      typeof constraints.video === 'object' &&
      typeof constraints.video.height === 'object' &&
      typeof constraints.video.height === 'object' &&
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      constraints.video.height.exact &&
      !hasAvailableResolution({
        deviceId: videoDeviceId,
        exactHeight: constraints.video.height.exact,
      })
    ) {
      throw new Error(
        `Resolution height:${constraints.video.height.exact} is not available: ${videoDeviceId}`,
      );
    }

    // empty function parseConstraints for not parse constraints
    return createMediaStreamMock(constraints);
  };

  enumerateDevices = async (): Promise<MediaDeviceInfo[]> => {
    return new Promise<MediaDeviceInfo[]>((resolve) => {
      setTimeout(() => {
        const availableDevices = getAvailableDevices();

        resolve(availableDevices);
      }, 100);
    });
  };

  addEventListener = (eventName: TEventName, handler: THandler) => {
    this.events.on(eventName, handler);
  };

  removeEventListener = (eventName: TEventName, handler: THandler) => {
    this.events.off(eventName, handler);
  };

  setCountVideoDevicesAvailable = (count: number) => {
    setCountVideoDevicesAvailable(count);

    this.events.trigger(DEVICE_CHANGE, {});
  };

  setCountAudioInDevicesAvailable = (count: number) => {
    setCountAudioInDevicesAvailable(count);

    this.events.trigger(DEVICE_CHANGE, {});
  };

  setCountAudioOutDevicesAvailable = (count: number) => {
    setCountAudioOutDevicesAvailable(count);

    this.events.trigger(DEVICE_CHANGE, {});
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
