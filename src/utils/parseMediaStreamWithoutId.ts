import type MediaStreamMock from '../MediaStreamMock';
import parseMediaStream from './parseMediaStream';

const parseMediaStreamWithoutId = (mediaStream: MediaStreamMock): Omit<MediaStreamMock, 'id'> => {
  const mediaStreamParsed = parseMediaStream(mediaStream);

  // @ts-ignore
  delete mediaStreamParsed.id;

  return mediaStreamParsed;
};

export default parseMediaStreamWithoutId;
