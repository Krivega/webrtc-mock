import MediaStreamMock from './MediaStreamMock';
import { createCanvasVideoMediaStreamTrackMock } from './createMediaStreamTrackMock';

const getCanvasMediaStreamMock = (): Promise<MediaStreamMock> => {
  return Promise.resolve(new MediaStreamMock([createCanvasVideoMediaStreamTrackMock()]));
};

export default getCanvasMediaStreamMock;
