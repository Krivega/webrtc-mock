import { getAvailableDevices, getAvailableResolution, hasUserNotAccessDevice } from './devicesMock';

const getAvailableDevicesWithResolutions = ({ hasAccessDeviceAudioOutput = false } = {}) => {
  const availableDevices = getAvailableDevices();

  return availableDevices.map((device) => {
    let deviceParsed;

    if (device.kind === 'videoinput') {
      deviceParsed = {
        resolutions: !hasUserNotAccessDevice(device.deviceId)
          ? getAvailableResolution(device.deviceId)
          : [],
        hasAccess: !hasUserNotAccessDevice(device.deviceId),
        ...device,
      };
    } else if (device.kind === 'audioinput') {
      deviceParsed = { hasAccess: !hasUserNotAccessDevice(device.deviceId), ...device };
    } else if (hasAccessDeviceAudioOutput) {
      deviceParsed = { hasAccess: true, ...device };
    } else {
      deviceParsed = { ...device };
    }

    return deviceParsed;
  });
};

export default getAvailableDevicesWithResolutions;
