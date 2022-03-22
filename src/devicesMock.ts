import resolutionsList from './resolutionsList';
import type { IGlobal } from './global';

declare let global: IGlobal;

export const VIDEO_KIND = 'videoinput' as const;
export const AUDIO_INPUT_KIND = 'audioinput' as const;
export const AUDIO_OUTPUT_KIND = 'audiooutput' as const;

const DEVICE_ID_POSTFIX = 'DeviceId';

export const generateDeviceId = ({
  prefix,
  postfix = DEVICE_ID_POSTFIX,
  index,
}: {
  prefix: string;
  postfix?: string;
  index?: number;
}) => {
  return `${prefix}${postfix}${index === undefined ? '' : index}`;
};

export const setBusyVideoDevice = (deviceId: string) => {
  const deviceIdLowerCase = deviceId.toLowerCase();

  if (
    deviceIdLowerCase.includes(VIDEO_KIND) &&
    !global.DEVICES_BUSY[VIDEO_KIND].includes(deviceId)
  ) {
    global.DEVICES_BUSY[VIDEO_KIND].push(deviceId);
  }
};
export const unsetBusyVideoDevice = () => {
  global.DEVICES_BUSY[VIDEO_KIND] = [];
};

export const hasBusyVideoDevice = (deviceId: string): boolean => {
  const deviceIdLowerCase = deviceId.toLowerCase();
  let isBusyVideoDevice = false;

  if (deviceIdLowerCase.includes(VIDEO_KIND)) {
    isBusyVideoDevice = global.DEVICES_BUSY[VIDEO_KIND].includes(deviceId);
  }

  return isBusyVideoDevice;
};

export const setNotFoundVideoDevice = (deviceId: string) => {
  const deviceIdLowerCase = deviceId.toLowerCase();

  if (
    deviceIdLowerCase.includes(VIDEO_KIND) &&
    !global.DEVICES_NOT_FOUND[VIDEO_KIND].includes(deviceId)
  ) {
    global.DEVICES_NOT_FOUND[VIDEO_KIND].push(deviceId);
  }
};

export const unsetNotFoundVideoDevice = () => {
  global.DEVICES_NOT_FOUND[VIDEO_KIND] = [];
};

export const hasNotFoundVideoDevice = (deviceId: string) => {
  const deviceIdLowerCase = deviceId.toLowerCase();
  let isNotFoundVideoDevice = false;

  if (deviceIdLowerCase.includes(VIDEO_KIND)) {
    isNotFoundVideoDevice = global.DEVICES_NOT_FOUND[VIDEO_KIND].includes(deviceId);
  }

  return isNotFoundVideoDevice;
};

export const setPermissionDeniedBySystem = (deviceId: string) => {
  const deviceIdLowerCase = deviceId.toLowerCase();

  if (
    deviceIdLowerCase.includes(VIDEO_KIND) &&
    !global.DEVICES_PERMISSION_DENIED_BY_SYSTEM[VIDEO_KIND].includes(deviceId)
  ) {
    global.DEVICES_PERMISSION_DENIED_BY_SYSTEM[VIDEO_KIND].push(deviceId);
  }
};

export const unsetPermissionDeniedBySystem = () => {
  global.DEVICES_PERMISSION_DENIED_BY_SYSTEM[VIDEO_KIND] = [];
};

export const hasPermissionDeniedBySystem = (deviceId: string) => {
  const deviceIdLowerCase = deviceId.toLowerCase();
  let isPermissionDeniedBySystem = false;

  if (deviceIdLowerCase.includes(VIDEO_KIND)) {
    isPermissionDeniedBySystem =
      global.DEVICES_PERMISSION_DENIED_BY_SYSTEM[VIDEO_KIND].includes(deviceId);
  }

  return isPermissionDeniedBySystem;
};
export class DeviceMock implements MediaDeviceInfo {
  deviceId: string;

  groupId: string;

  kind: MediaDeviceKind;

  label: string;

  constructor(kind: MediaDeviceKind, index?: number) {
    this.kind = kind;
    this.deviceId = generateDeviceId({ index, prefix: kind });
    this.groupId = `groupId ${kind}`;
    this.label = `label ${kind}`;
  }

  // eslint-disable-next-line class-methods-use-this
  toJSON() {
    throw new Error('Method not implemented.');
  }
}

export const hasUserNotAccessDevice = (deviceId: string): boolean => {
  const deviceIdLowerCase = deviceId.toLowerCase();
  let isUserNotAccessDevice = false;

  if (deviceIdLowerCase.includes(VIDEO_KIND)) {
    isUserNotAccessDevice = global.DEVICES_USER_NOT_ACCESS[VIDEO_KIND] === true;
  } else if (deviceIdLowerCase.includes(AUDIO_INPUT_KIND)) {
    isUserNotAccessDevice = global.DEVICES_USER_NOT_ACCESS[AUDIO_INPUT_KIND] === true;
  } else if (deviceIdLowerCase.includes(AUDIO_OUTPUT_KIND)) {
    isUserNotAccessDevice = global.DEVICES_USER_NOT_ACCESS[AUDIO_OUTPUT_KIND] === true;
  }

  return isUserNotAccessDevice;
};

export const parseDevice = (device: DeviceMock) => {
  const parsedDevice = { ...device };

  return parsedDevice;
};

export const getDeviceVideo = (index?: number) => {
  return parseDevice(new DeviceMock(VIDEO_KIND, index));
};

export const getDeviceAudioIn = (index?: number) => {
  return parseDevice(new DeviceMock(AUDIO_INPUT_KIND, index));
};

export const getDeviceAudioOut = () => {
  return parseDevice(new DeviceMock(AUDIO_OUTPUT_KIND));
};

export const getDevicesVideo = () => {
  const countDevices = global.COUNT_DEVICES_AVAILABLE[VIDEO_KIND];

  switch (countDevices) {
    case 0:
      return [];
    case 1:
      return [getDeviceVideo()];
    case 2:
      return [getDeviceVideo(), getDeviceVideo(2)];
    case 3:
      return [getDeviceVideo(), getDeviceVideo(2), getDeviceVideo(3)];
    default:
      return [getDeviceVideo()];
  }
};

/**
 * getDevicesAudioIn
 *
 * @returns {Array} devices
 */
export const getDevicesAudioIn = () => {
  const countDevices = global.COUNT_DEVICES_AVAILABLE[AUDIO_INPUT_KIND];

  switch (countDevices) {
    case 0:
      return [];
    case 1:
      return [getDeviceAudioIn()];
    case 2:
      return [getDeviceAudioIn(), getDeviceAudioIn(2)];
    case 3:
      return [getDeviceAudioIn(), getDeviceAudioIn(2), getDeviceAudioIn(3)];
    default:
      return [getDeviceAudioIn()];
  }
};

/**
 * getAvailableDevices
 *
 * @returns {Array} devices
 */
export const getAvailableDevices = () => {
  return [...getDevicesVideo(), ...getDevicesAudioIn(), getDeviceAudioOut()];
};

/**
 * setUserNotAccessAudioIn
 *
 * @param {boolean} notAccess - notAccess
 *
 * @returns {undefined}
 */
export const setUserNotAccessVideo = (notAccess: boolean) => {
  global.DEVICES_USER_NOT_ACCESS[VIDEO_KIND] = notAccess;
};

/**
 * setUserNotAccessAudioIn
 *
 * @param {boolean} notAccess - notAccess
 *
 * @returns {undefined}
 */
export const setUserNotAccessAudioIn = (notAccess: boolean) => {
  global.DEVICES_USER_NOT_ACCESS[AUDIO_INPUT_KIND] = notAccess;
};
/**
 * setUserNotAccessAll
 *
 * @param {boolean} notAccess - notAccess
 *
 * @returns {undefined}
 */
export const setUserNotAccessAll = (notAccess: boolean) => {
  setUserNotAccessAudioIn(notAccess);
  setUserNotAccessVideo(notAccess);
};

export const unsetAllRestrictions = () => {
  unsetBusyVideoDevice();
  unsetNotFoundVideoDevice();
  unsetPermissionDeniedBySystem();
  setUserNotAccessAll(false);
};

export const setCountVideoDevicesAvailable = (count = 1) => {
  global.COUNT_DEVICES_AVAILABLE[VIDEO_KIND] = count;
};

export const setCountAudioInDevicesAvailable = (count = 1) => {
  global.COUNT_DEVICES_AVAILABLE[AUDIO_INPUT_KIND] = count;
};

const resolutionsWithout1080p = resolutionsList.filter(({ id }) => {
  return id !== '1080p';
});

export const videoDevicesAvailableResolutions = {
  [generateDeviceId({
    prefix: VIDEO_KIND,
  })]: resolutionsList,
  [generateDeviceId({
    prefix: VIDEO_KIND,
    index: 1,
  })]: resolutionsList,
  [generateDeviceId({
    prefix: VIDEO_KIND,
    index: 2,
  })]: resolutionsWithout1080p,
};

export const hasAvailableResolution = ({
  deviceId,
  exactHeight,
}: {
  deviceId: string;
  exactHeight: number;
}) => {
  const availableResolutions = videoDevicesAvailableResolutions[deviceId];

  if (!availableResolutions) {
    return true;
  }

  return (
    availableResolutions.filter(({ height }) => {
      return height === exactHeight;
    }).length !== 0
  );
};

/**
 * get Available Resolution for Video Device
 *
 * @param {string} deviceId - deviceId
 *
 * @returns {Array} resolutions
 */
export const getAvailableResolution = (deviceId: string) => {
  return videoDevicesAvailableResolutions[deviceId];
};
