import MediaStreamMock from './MediaStreamMock';
import { createAudioContextAudioMediaStreamTrackMock } from './createMediaStreamTrackMock';

const getAudioContextMediaStreamMock = async (): Promise<MediaStreamMock> => {
  return new MediaStreamMock([createAudioContextAudioMediaStreamTrackMock()]);
};

export default getAudioContextMediaStreamMock;
