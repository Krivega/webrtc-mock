import { Events } from 'events-constructor';

import { ADD_TRACK, REMOVE_TRACK } from './constants';

import type { MediaStreamUnionTrack } from './types';

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
  public id: string;

  public active = true;

  public onaddtrack: ((this: MediaStream, event_: MediaStreamTrackEvent) => unknown) | null;

  public onremovetrack: ((this: MediaStream, event_: MediaStreamTrackEvent) => unknown) | null;

  private readonly events: Events<TEventNames>;

  private tracks: MediaStreamUnionTrack[];

  public constructor(tracks: MediaStreamUnionTrack[] = []) {
    this.id = getId();
    this.tracks = tracks;

    this.events = new Events(eventsNames);
    // eslint-disable-next-line unicorn/no-null
    this.onaddtrack = null;
    // eslint-disable-next-line unicorn/no-null
    this.onremovetrack = null;
  }

  public getTracks = (): MediaStreamUnionTrack[] => {
    return this.tracks;
  };

  public getAudioTracks = (): MediaStreamAudioTrack[] => {
    return this.tracks.filter(({ kind }) => {
      return kind === 'audio';
    }) as MediaStreamAudioTrack[];
  };

  public getVideoTracks = (): MediaStreamVideoTrack[] => {
    return this.tracks.filter(({ kind }) => {
      return kind === 'video';
    }) as MediaStreamVideoTrack[];
  };

  public addTrack = (track: MediaStreamUnionTrack): this => {
    this.tracks = [...this.tracks, track];

    const event = { ...new Event(ADD_TRACK), track };

    this.events.trigger(ADD_TRACK, event);

    if (this.onaddtrack) {
      this.onaddtrack(event);
    }

    return this;
  };

  public removeTrack(track: MediaStreamTrack): this {
    this.tracks = this.tracks.filter((item) => {
      return item.id !== track.id;
    });

    const event = { ...new Event(REMOVE_TRACK), track };

    this.events.trigger(REMOVE_TRACK, event);

    if (this.onremovetrack) {
      this.onremovetrack(event);
    }

    return this;
  }

  public addEventListener = (eventName: TEventName, handler: THandler) => {
    this.events.on(eventName, handler);
  };

  public removeEventListener = (eventName: TEventName, handler: THandler) => {
    this.events.off(eventName, handler);
  };

  public dispatchEvent(event: Event): boolean {
    const eventName = event.type as TEventName;

    this.events.trigger(eventName, event);

    return true;
  }

  public clone(): this {
    return { ...this };
  }

  public getTrackById(trackId: string): MediaStreamTrack | null {
    return (
      this.tracks.find((item) => {
        return item.id === trackId;
        // eslint-disable-next-line unicorn/no-null
      }) ?? null
    );
  }
}

export default MediaStreamMock;
