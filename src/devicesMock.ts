/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import resolutionsList from './resolutionsList';
import type { TGlobal } from './types';

declare let global: TGlobal;

export const VIDEO_KIND = 'videoinput' as const;
export const AUDIO_INPUT_KIND = 'audioinput' as const;
export const AUDIO_OUTPUT_KIND = 'audiooutput' as const;

const DEVICE_ID_POSTFIX = 'DeviceId';

const generateDeviceProperty = ({
  prefix,
  postfix = DEVICE_ID_POSTFIX,
  index,
}: {
  prefix: string;
  postfix?: string;
  index?: number;
}) => {
  return `${prefix}${postfix}${index ?? ''}`;
};

export const setBusyVideoDevice = (deviceId: string) => {
  if (!global.DEVICES_BUSY[VIDEO_KIND].includes(deviceId)) {
    global.DEVICES_BUSY[VIDEO_KIND].push(deviceId);
  }
};
export const unsetBusyVideoDevice = (deviceId: string) => {
  global.DEVICES_BUSY[VIDEO_KIND] = global.DEVICES_BUSY[VIDEO_KIND].filter((id) => {
    return id !== deviceId;
  });
};

export const hasBusyVideoDevice = (deviceId: string): boolean => {
  return global.DEVICES_BUSY[VIDEO_KIND].includes(deviceId);
};

export const setNotFoundVideoDevice = (deviceId: string) => {
  if (!global.DEVICES_NOT_FOUND[VIDEO_KIND].includes(deviceId)) {
    global.DEVICES_NOT_FOUND[VIDEO_KIND].push(deviceId);
  }
};

export const unsetNotFoundVideoDevice = (deviceId: string) => {
  global.DEVICES_NOT_FOUND[VIDEO_KIND] = global.DEVICES_NOT_FOUND[VIDEO_KIND].filter((id) => {
    return id !== deviceId;
  });
};

export const hasNotFoundVideoDevice = (deviceId: string): boolean => {
  return global.DEVICES_NOT_FOUND[VIDEO_KIND].includes(deviceId);
};

export const setPermissionDeniedBySystem = (deviceId: string) => {
  if (!global.DEVICES_PERMISSION_DENIED_BY_SYSTEM[VIDEO_KIND].includes(deviceId)) {
    global.DEVICES_PERMISSION_DENIED_BY_SYSTEM[VIDEO_KIND].push(deviceId);
  }
};

export const unsetPermissionDeniedBySystem = (deviceId: string) => {
  global.DEVICES_PERMISSION_DENIED_BY_SYSTEM[VIDEO_KIND] =
    global.DEVICES_PERMISSION_DENIED_BY_SYSTEM[VIDEO_KIND].filter((id) => {
      return id !== deviceId;
    });
};

export const hasPermissionDeniedBySystem = (deviceId: string): boolean => {
  return global.DEVICES_PERMISSION_DENIED_BY_SYSTEM[VIDEO_KIND].includes(deviceId);
};
export class DeviceMock implements MediaDeviceInfo {
  deviceId: string;

  groupId: string;

  kind: MediaDeviceKind;

  label: string;

  constructor(kind: MediaDeviceKind, index?: number) {
    this.kind = kind;
    this.deviceId = generateDeviceProperty({ index, prefix: kind });
    this.groupId = generateDeviceProperty({ index, prefix: 'groupId', postfix: kind });
    this.label = generateDeviceProperty({ index, prefix: 'label ', postfix: kind });
  }

  toJSON() {
    return JSON.stringify(this);
  }
}

export const hasUserNotAccessDevice = (deviceId: string): boolean => {
  const deviceIdLowerCase = deviceId.toLowerCase();
  let isUserNotAccessDevice = false;

  if (deviceIdLowerCase.includes(VIDEO_KIND)) {
    isUserNotAccessDevice = global.DEVICES_USER_NOT_ACCESS[VIDEO_KIND];
  } else if (deviceIdLowerCase.includes(AUDIO_INPUT_KIND)) {
    isUserNotAccessDevice = global.DEVICES_USER_NOT_ACCESS[AUDIO_INPUT_KIND];
  } else if (deviceIdLowerCase.includes(AUDIO_OUTPUT_KIND)) {
    isUserNotAccessDevice = global.DEVICES_USER_NOT_ACCESS[AUDIO_OUTPUT_KIND];
  }

  return isUserNotAccessDevice;
};

export const parseDevice = (device: DeviceMock): DeviceMock => {
  const parsedDevice = { ...device } as DeviceMock;

  return parsedDevice;
};

export const getDeviceVideo = (index?: number): MediaDeviceInfo => {
  return parseDevice(new DeviceMock(VIDEO_KIND, index));
};

export const getDeviceAudioIn = (index?: number): MediaDeviceInfo => {
  return parseDevice(new DeviceMock(AUDIO_INPUT_KIND, index));
};

export const getDeviceAudioOut = (index?: number): MediaDeviceInfo => {
  return parseDevice(new DeviceMock(AUDIO_OUTPUT_KIND, index));
};

export const getDevicesVideo = (): MediaDeviceInfo[] => {
  const countDevices = global.COUNT_DEVICES_AVAILABLE[VIDEO_KIND];

  switch (countDevices) {
    case 0: {
      return [];
    }
    case 1: {
      return [getDeviceVideo()];
    }
    case 2: {
      return [getDeviceVideo(), getDeviceVideo(2)];
    }
    case 3: {
      return [getDeviceVideo(), getDeviceVideo(2), getDeviceVideo(3)];
    }
    default: {
      return [getDeviceVideo()];
    }
  }
};

export const getDevicesAudioIn = (): MediaDeviceInfo[] => {
  const countDevices = global.COUNT_DEVICES_AVAILABLE[AUDIO_INPUT_KIND];

  switch (countDevices) {
    case 0: {
      return [];
    }
    case 1: {
      return [getDeviceAudioIn()];
    }
    case 2: {
      return [getDeviceAudioIn(), getDeviceAudioIn(2)];
    }
    case 3: {
      return [getDeviceAudioIn(), getDeviceAudioIn(2), getDeviceAudioIn(3)];
    }
    default: {
      return [getDeviceAudioIn()];
    }
  }
};

export const getDevicesAudioOut = (): MediaDeviceInfo[] => {
  const countDevices = global.COUNT_DEVICES_AVAILABLE[AUDIO_OUTPUT_KIND];

  switch (countDevices) {
    case 0: {
      return [];
    }
    case 1: {
      return [getDeviceAudioOut()];
    }
    case 2: {
      return [getDeviceAudioOut(), getDeviceAudioOut(2)];
    }
    case 3: {
      return [getDeviceAudioOut(), getDeviceAudioOut(2), getDeviceAudioOut(3)];
    }
    default: {
      return [getDeviceAudioOut()];
    }
  }
};

export const getAvailableDevices = (): MediaDeviceInfo[] => {
  return [...getDevicesVideo(), ...getDevicesAudioIn(), ...getDevicesAudioOut()];
};

export const setUserNotAccessVideo = (notAccess: boolean) => {
  global.DEVICES_USER_NOT_ACCESS[VIDEO_KIND] = notAccess;
};

export const setUserNotAccessAudioIn = (notAccess: boolean) => {
  global.DEVICES_USER_NOT_ACCESS[AUDIO_INPUT_KIND] = notAccess;
};

export const setUserNotAccessAll = (notAccess: boolean) => {
  setUserNotAccessAudioIn(notAccess);
  setUserNotAccessVideo(notAccess);
};

export const unsetAllRestrictions = () => {
  global.DEVICES_BUSY[VIDEO_KIND] = [];
  global.DEVICES_NOT_FOUND[VIDEO_KIND] = [];
  global.DEVICES_PERMISSION_DENIED_BY_SYSTEM[VIDEO_KIND] = [];
  setUserNotAccessAll(false);
};

export const setCountVideoDevicesAvailable = (count = 1) => {
  global.COUNT_DEVICES_AVAILABLE[VIDEO_KIND] = count;
};

export const setCountAudioInDevicesAvailable = (count = 1) => {
  global.COUNT_DEVICES_AVAILABLE[AUDIO_INPUT_KIND] = count;
};

export const setCountAudioOutDevicesAvailable = (count = 1) => {
  global.COUNT_DEVICES_AVAILABLE[AUDIO_OUTPUT_KIND] = count;
};

const resolutionsWithout1080p = resolutionsList.filter(({ id }) => {
  return id !== '1080p';
});

export const videoDevicesAvailableResolutions = {
  [generateDeviceProperty({
    prefix: VIDEO_KIND,
  })]: resolutionsList,
  [generateDeviceProperty({
    prefix: VIDEO_KIND,
    index: 1,
  })]: resolutionsList,
  [generateDeviceProperty({
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

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/strict-boolean-expressions
  if (!availableResolutions) {
    return true;
  }

  return availableResolutions.some(({ height }) => {
    return height === exactHeight;
  });
};

export const getAvailableResolution = (deviceId: string) => {
  return videoDevicesAvailableResolutions[deviceId];
};
