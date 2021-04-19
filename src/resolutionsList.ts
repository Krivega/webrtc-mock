const ID_CIF = 'CIF';
const ID_360P = '360p';
export const ID_720P = '720p';
export const ID_1080P = '1080p';

const resolutionCIF = {
  id: ID_CIF,
  width: 352,
  height: 288,
  aspectRatio: 4 / 3,
};
export const resolution360p = {
  id: ID_360P,
  width: 640,
  height: 360,
  aspectRatio: 16 / 9,
};
const resolution720p = {
  id: ID_720P,
  width: 1280,
  height: 720,
  aspectRatio: 16 / 9,
};
const resolution1080p = {
  id: ID_1080P,
  width: 1920,
  height: 1080,
  aspectRatio: 16 / 9,
};
const resolutionsList = [resolutionCIF, resolution360p, resolution720p, resolution1080p];

export default resolutionsList;
