import type MediaStreamMock from '../MediaStreamMock';
import parseObject from './parseObject';
import parseTracks from './parseTracks';

const parseMediaStream = (mediaStream: MediaStreamMock): MediaStreamMock => {
  return parseObject<MediaStreamMock>({
    ...mediaStream,
    tracks: parseTracks(mediaStream.getTracks()),
  } as unknown as MediaStreamMock);
};

export default parseMediaStream;
