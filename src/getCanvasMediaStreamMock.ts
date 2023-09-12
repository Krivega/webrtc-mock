import MediaStreamMock from './MediaStreamMock';
import { createCanvasVideoMediaStreamTrackMock } from './createMediaStreamTrackMock';

const getCanvasMediaStreamMock = async (): Promise<MediaStreamMock> => {
  return new MediaStreamMock([createCanvasVideoMediaStreamTrackMock()]);
};

export default getCanvasMediaStreamMock;
