import parseObject from './parseObject';
import parseTracks from './parseTracks';

import type MediaStreamMock from '../MediaStreamMock';

const parseMediaStream = (mediaStream: MediaStreamMock): MediaStreamMock => {
  return parseObject<MediaStreamMock>({
    ...mediaStream,
    tracks: parseTracks(mediaStream.getTracks()),
  } as unknown as MediaStreamMock);
};

export default parseMediaStream;
