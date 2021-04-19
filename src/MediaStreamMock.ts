import type MediaStreamTrackMock from './mediaStreamTrackMock';

let indexId = 0;
const getId = () => {
  indexId += 1;

  return `identifier-${indexId}`;
};

class MediaStreamMock implements MediaStream {
  id: string;

  active = true;

  onaddtrack: any;

  onremovetrack: any;

  clone: any;

  getTrackById: any;

  removeTrack: any;

  dispatchEvent: any;

  tracks: MediaStreamTrackMock[];

  constructor(tracks: MediaStreamTrackMock[] = []) {
    this.id = getId();
    this.tracks = tracks;
  }

  addEventListener = jest.fn();

  removeEventListener = jest.fn();

  getTracks = () => {
    return this.tracks;
  };

  getAudioTracks = () => {
    return this.tracks.filter(({ kind }) => {
      return kind === 'audio';
    });
  };

  getVideoTracks = () => {
    return this.tracks.filter(({ kind }) => {
      return kind === 'video';
    });
  };

  addTrack = (track: MediaStreamTrackMock) => {
    this.tracks = [...this.tracks, track];

    return this;
  };
}

export default MediaStreamMock;
