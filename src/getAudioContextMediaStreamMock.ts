import { createAudioContextAudioMediaStreamTrackMock } from './createMediaStreamTrackMock';
import MediaStreamMock from './MediaStreamMock';

const getAudioContextMediaStreamMock = async (): Promise<MediaStreamMock> => {
  return new MediaStreamMock([createAudioContextAudioMediaStreamTrackMock()]);
};

export default getAudioContextMediaStreamMock;
