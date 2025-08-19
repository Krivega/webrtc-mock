import { createCanvasVideoMediaStreamTrackMock } from './createMediaStreamTrackMock';
import MediaStreamMock from './MediaStreamMock';

const getCanvasMediaStreamMock = async (): Promise<MediaStreamMock> => {
  return new MediaStreamMock([createCanvasVideoMediaStreamTrackMock()]);
};

export default getCanvasMediaStreamMock;
