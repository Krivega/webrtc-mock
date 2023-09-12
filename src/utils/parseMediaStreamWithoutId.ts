import type MediaStreamMock from '../MediaStreamMock';
import parseMediaStream from './parseMediaStream';

type TMediaStreamMockWithoutId = Omit<MediaStreamMock, 'id'>;

const parseMediaStreamWithoutId = (mediaStream: MediaStreamMock): TMediaStreamMockWithoutId => {
  const mediaStreamParsed = parseMediaStream(mediaStream);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment, @typescript-eslint/prefer-ts-expect-error
  // @ts-ignore
  delete mediaStreamParsed.id;

  return mediaStreamParsed;
};

export default parseMediaStreamWithoutId;
