import type MediaStreamMock from '../MediaStreamMock';
import parseObject from './parseObject';
import parseTracks from './parseTracks';

const parseMediaStream = (mediaStream: MediaStreamMock): MediaStreamMock => {
  return parseObject({ ...mediaStream, tracks: parseTracks(mediaStream.tracks) });
};

export default parseMediaStream;
