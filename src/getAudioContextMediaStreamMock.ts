import MediaStreamMock from './MediaStreamMock';
import { createAudioContextAudioMediaStreamTrackMock } from './createMediaStreamTrackMock';

const getAudioContextMediaStreamMock = (): Promise<MediaStreamMock> => {
  return Promise.resolve(new MediaStreamMock([createAudioContextAudioMediaStreamTrackMock()]));
};

export default getAudioContextMediaStreamMock;
