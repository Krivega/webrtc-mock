/* eslint-disable @typescript-eslint/ban-ts-comment */
import type MediaStreamMock from '../MediaStreamMock';
import parseMediaStream from './parseMediaStream';

type TMediaStreamMockWithoutId = Omit<MediaStreamMock, 'id'>;

const parseMediaStreamWithoutId = (mediaStream: MediaStreamMock): TMediaStreamMockWithoutId => {
  const mediaStreamParsed = parseMediaStream(mediaStream);

  // @ts-ignore
  delete mediaStreamParsed.id;

  return mediaStreamParsed;
};

export default parseMediaStreamWithoutId;
