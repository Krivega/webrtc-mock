import {
  ERROR_NOT_READABLE,
  ERROR_NOT_FOUND,
  ERROR_COULD_NOT_START_VIDEO_SOURCE,
  PERMISSION_DENIED,
  ERROR_PERMISSION_DENIED_BY_SYSTEM,
} from './constants';

export const getNotReadableErrorVideo = (): Error => {
  const error = new Error(ERROR_COULD_NOT_START_VIDEO_SOURCE);

  error.name = ERROR_NOT_READABLE;

  return error;
};

export const getNotFoundError = (): Error => {
  const error = new Error();

  error.name = ERROR_NOT_FOUND;

  return error;
};

export const getPermissionDeniedByError = (): Error => {
  const error = new Error(PERMISSION_DENIED);

  return error;
};

export const getPermissionDeniedBySystemError = (): Error => {
  const error = new Error(ERROR_PERMISSION_DENIED_BY_SYSTEM);

  return error;
};
