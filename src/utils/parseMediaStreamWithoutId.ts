import parseMediaStream from './parseMediaStream';

import type MediaStreamMock from '../MediaStreamMock';

type TMediaStreamMockWithoutId = Omit<MediaStreamMock, 'id'>;

const parseMediaStreamWithoutId = (mediaStream: MediaStreamMock): TMediaStreamMockWithoutId => {
  const mediaStreamParsed = parseMediaStream(mediaStream);

  // @ts-ignore
  delete mediaStreamParsed.id;

  return mediaStreamParsed;
};

export default parseMediaStreamWithoutId;
