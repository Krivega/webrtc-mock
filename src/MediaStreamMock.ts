import Events from 'events-constructor';
import { ADD_TRACK, REMOVE_TRACK } from './constants';
import type MediaStreamTrackMock from './mediaStreamTrackMock';

const eventsNames = [ADD_TRACK, REMOVE_TRACK] as const;

type TEventNames = typeof eventsNames;
type TEventName = TEventNames[number];
type THandler = (event: Event) => void;

let indexId = 0;
const getId = () => {
  indexId += 1;

  return `identifier-${indexId}`;
};

class MediaStreamMock implements MediaStream {
  private _events: Events<TEventNames>;

  private tracks: MediaStreamTrackMock[];

  id: string;

  active = true;

  constructor(tracks: MediaStreamTrackMock[] = []) {
    this.id = getId();
    this.tracks = tracks;

    this._events = new Events(eventsNames);
    this.onaddtrack = null;
    this.onremovetrack = null;
  }
  onaddtrack: ((this: MediaStream, ev: MediaStreamTrackEvent) => unknown) | null;
  onremovetrack: ((this: MediaStream, ev: MediaStreamTrackEvent) => unknown) | null;

  getTracks = (): MediaStreamTrackMock[] => {
    return this.tracks;
  };

  getAudioTracks = (): MediaStreamTrackMock[] => {
    return this.tracks.filter(({ kind }) => {
      return kind === 'audio';
    });
  };

  getVideoTracks = (): MediaStreamTrackMock[] => {
    return this.tracks.filter(({ kind }) => {
      return kind === 'video';
    });
  };

  addTrack = (track: MediaStreamTrackMock): MediaStreamMock => {
    this.tracks = [...this.tracks, track];

    const event = { ...new Event(ADD_TRACK), track };

    this._events.trigger(ADD_TRACK, event);

    if (this.onaddtrack) {
      this.onaddtrack(event);
    }

    return this;
  };

  removeTrack(track: MediaStreamTrack): MediaStreamMock {
    this.tracks = this.tracks.filter((item) => {
      return item.id !== track.id;
    });

    const event = { ...new Event(REMOVE_TRACK), track };

    this._events.trigger(REMOVE_TRACK, event);

    if (this.onremovetrack) {
      this.onremovetrack(event);
    }

    return this;
  }

  addEventListener = (eventName: TEventName, handler: THandler) => {
    this._events.on(eventName, handler);
  };

  removeEventListener = (eventName: TEventName, handler: THandler) => {
    this._events.off(eventName, handler);
  };

  dispatchEvent(event: Event): boolean {
    const eventName = event.type as TEventName;

    this._events.trigger(eventName, event);

    return true;
  }

  clone(): MediaStreamMock {
    return Object.assign({}, this);
  }

  getTrackById(trackId: string): MediaStreamTrack | null {
    return (
      this.tracks.find((item) => {
        return item.id === trackId;
      }) || null
    );
  }
}

export default MediaStreamMock;
