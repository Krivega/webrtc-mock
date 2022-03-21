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

class DeviceMock implements MediaDeviceInfo {
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

type TParsedDeviceMock = ReturnType<typeof parseDevice>;

export const getDeviceVideo = (index?: number) => {
  return parseDevice(new DeviceMock(VIDEO_KIND, index));
};

export const getDeviceAudioIn = (index?: number) => {
  return parseDevice(new DeviceMock(AUDIO_INPUT_KIND, index));
};

export const getDeviceAudioOut = () => {
  return parseDevice(new DeviceMock(AUDIO_OUTPUT_KIND));
};

/**
 * getDevicesNothing
 *
 * @returns {Array} devices
 */
export const getDevicesNothing = () => {
  return [];
};

export const getDevicesVideo = () => {
  if (global.COUNT_DEVICES_AVAILABLE[VIDEO_KIND] === 0) {
    return [];
  } else if (global.COUNT_DEVICES_AVAILABLE[VIDEO_KIND] === 2) {
    return [getDeviceVideo(), getDeviceVideo(2)];
  } else if (global.COUNT_DEVICES_AVAILABLE[VIDEO_KIND] === 3) {
    return [getDeviceVideo(), getDeviceVideo(2), getDeviceVideo(3)];
  }


  return [getDeviceVideo()];
};

/**
 * getDevicesAudioIn
 *
 * @returns {Array} devices
 */
export const getDevicesAudioIn = () => {
  if (global.COUNT_DEVICES_AVAILABLE[AUDIO_INPUT_KIND] === 0) {
    return [];
  } else if (global.COUNT_DEVICES_AVAILABLE[AUDIO_INPUT_KIND] === 2) {
    return [getDeviceAudioIn(), getDeviceAudioIn(2)];
  } else if (global.COUNT_DEVICES_AVAILABLE[AUDIO_INPUT_KIND] === 3) {
    return [getDeviceAudioIn(), getDeviceAudioIn(2), getDeviceAudioIn(3)];
  }


  return [getDeviceAudioIn()];
};

/**
 * getDevicesAudioOut
 *
 * @returns {Array} devices
 */
export const getDevicesAudioOut = () => {
  return [getDeviceAudioOut()];
};

/**
 * getDevicesAudioInOut
 *
 * @returns {Array} devices
 */
export const getDevicesAudioInOut = () => {
  return [getDeviceAudioIn(), getDeviceAudioOut()];
};

/**
 * getDevicesVideoAudioIn
 *
 * @returns {Array} devices
 */
export const getDevicesVideoAudioIn = () => {
  return [...getDevicesVideo(), getDeviceAudioIn()];
};

/**
 * getDevicesVideoAudioOut
 *
 * @returns {Array} devices
 */
export const getDevicesVideoAudioOut = () => {
  return [...getDevicesVideo(), getDeviceAudioOut()];
};

/**
 * getDevicesVideoAudioInOut
 *
 * @returns {Array} devices
 */
export const getDevicesVideoAudioInOut = () => {
  return [...getDevicesVideo(), getDeviceAudioIn(), getDeviceAudioOut()];
};

/**
 * getAvailableDevices
 *
 * @returns {Array} devices
 */
export const getAvailableDevices = () => {
  let devices: TParsedDeviceMock[] = getDevicesNothing();

  if (
    global.DEVICES_AVAILABLE[VIDEO_KIND] &&
    global.DEVICES_AVAILABLE[AUDIO_INPUT_KIND] &&
    global.DEVICES_AVAILABLE[AUDIO_OUTPUT_KIND]
  ) {
    devices = getDevicesVideoAudioInOut();
  } else if (global.DEVICES_AVAILABLE[VIDEO_KIND] && global.DEVICES_AVAILABLE[AUDIO_OUTPUT_KIND]) {
    devices = getDevicesVideoAudioOut();
  } else if (global.DEVICES_AVAILABLE[VIDEO_KIND] && global.DEVICES_AVAILABLE[AUDIO_INPUT_KIND]) {
    devices = getDevicesVideoAudioIn();
  } else if (
    global.DEVICES_AVAILABLE[AUDIO_INPUT_KIND] &&
    global.DEVICES_AVAILABLE[AUDIO_OUTPUT_KIND]
  ) {
    devices = getDevicesAudioInOut();
  } else if (global.DEVICES_AVAILABLE[AUDIO_OUTPUT_KIND]) {
    devices = getDevicesAudioOut();
  } else if (global.DEVICES_AVAILABLE[AUDIO_INPUT_KIND]) {
    devices = getDevicesAudioIn();
  } else if (global.DEVICES_AVAILABLE[VIDEO_KIND]) {
    devices = getDevicesVideo();
  }

  return devices;
};

/**
 * setAvailableVideo
 *
 * @param {boolean} available - available
 *
 * @returns {undefined}
 */
export const setAvailableVideo = (available = true) => {
  global.DEVICES_AVAILABLE[VIDEO_KIND] = available;
};

/**
 * setAvailableAudioIn
 *
 * @param {boolean} available - available
 *
 * @returns {undefined}
 */
export const setAvailableAudioIn = (available = true) => {
  global.DEVICES_AVAILABLE[AUDIO_INPUT_KIND] = available;
};

/**
 * setAvailableAudioOut
 *
 * @param {boolean} available - available
 *
 * @returns {undefined}
 */
export const setAvailableAudioOut = (available = true) => {
  global.DEVICES_AVAILABLE[AUDIO_OUTPUT_KIND] = available;
};

/**
 * setAvailableAll
 *
 * @param {boolean} available - available
 *
 * @returns {undefined}
 */
export const setAvailableAll = (available = true) => {
  setAvailableVideo(available);
  setAvailableAudioIn(available);
  setAvailableAudioOut(available);
};

/**
 * setUserNotAccessAudioIn
 *
 * @param {boolean} notAccess - notAccess
 *
 * @returns {undefined}
 */
const setUserNotAccessVideo = (notAccess = true) => {
  global.DEVICES_USER_NOT_ACCESS[VIDEO_KIND] = notAccess;
};

/**
 * setUserNotAccessAudioIn
 *
 * @param {boolean} notAccess - notAccess
 *
 * @returns {undefined}
 */
const setUserNotAccessAudioIn = (notAccess = true) => {
  global.DEVICES_USER_NOT_ACCESS[AUDIO_INPUT_KIND] = notAccess;
};
/**
 * setUserNotAccessAll
 *
 * @param {boolean} notAccess - notAccess
 *
 * @returns {undefined}
 */
export const setUserNotAccessAll = (notAccess = true) => {
  setUserNotAccessAudioIn(notAccess);
  setUserNotAccessVideo(notAccess);
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
