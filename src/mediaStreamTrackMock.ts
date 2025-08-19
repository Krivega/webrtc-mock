/* eslint-disable unicorn/no-null */
/* eslint-disable @typescript-eslint/class-methods-use-this */
import { Events } from 'events-constructor';

import Capabilities from './Capabilities';
import { ENDED, ISOLATION_CHANGE, MUTE, OVERCONSTRAINED, RESIZE, UNMUTE } from './constants';

import type { TCapabilities } from './Capabilities';
import type { MediaStreamUnionTrack } from './types';

const eventsNames = [ENDED, MUTE, UNMUTE, ISOLATION_CHANGE, OVERCONSTRAINED, RESIZE] as const;

type TEventNames = typeof eventsNames;
type TEventName = TEventNames[number];
type THandler = (event: Event) => void;

const capabilities = new Capabilities();

export const setCapabilities = (value: TCapabilities) => {
  capabilities.setCapabilities(value);
};

export const resetCapabilities = () => {
  capabilities.resetCapabilities();
};

export const setMinWidthCapabilities = (value: number) => {
  capabilities.setMinWidth(value);
};

export const setMaxWidthCapabilities = (value: number) => {
  capabilities.setMaxWidth(value);
};

export const setMinHeightCapabilities = (value: number) => {
  capabilities.setMinHeight(value);
};

export const setMaxHeightCapabilities = (value: number) => {
  capabilities.setMaxHeight(value);
};

export type TOptions = {
  id?: string;
  constraints?: MediaTrackConstraints;
};

// eslint-disable-next-line prettier/prettier
class MediaStreamTrackMock<T extends 'audio' | 'video' = 'video' | 'audio'> implements MediaStreamUnionTrack {
  public id: string;

  public kind: T;

  public constraints: MediaTrackConstraints;

  public enabled: boolean;

  public contentHint = '';

  public readyState: MediaStreamTrackState = 'live';

  public isolated = false;

  public label = '';

  public muted = false;

  public onended: ((this: MediaStreamTrack, event_: Event) => unknown) | null = null;

  public onisolationchange: ((this: MediaStreamTrack, event_: Event) => unknown) | null = null;

  public onmute: ((this: MediaStreamTrack, event_: Event) => unknown) | null = null;

  public onunmute: ((this: MediaStreamTrack, event_: Event) => unknown) | null = null;

  private readonly events: Events<TEventNames>;

  public constructor(kind: T, { id = 'identifier', constraints = {} }: TOptions = {}) {
    this.id = `${id}-${kind}-track`;
    this.kind = kind;
    this.enabled = true;
    this.constraints = { ...constraints };

    this.events = new Events(eventsNames);
  }

  public clone(): this {
    return { ...this };
  }

  public getCapabilities(): MediaTrackCapabilities {
    return capabilities.capabilities;
  }

  public getSettings(): MediaTrackSettings {
    let width = 0;
    let height = 0;

    if (typeof this.constraints.width === 'object' && this.constraints.width.ideal !== undefined) {
      width = this.constraints.width.ideal;
    } else if (
      typeof this.constraints.width === 'object' &&
      this.constraints.width.exact !== undefined
    ) {
      width = this.constraints.width.exact;
    } else if (typeof this.constraints.width === 'number' && this.constraints.width) {
      width = this.constraints.width;
    }

    if (
      typeof this.constraints.height === 'object' &&
      this.constraints.height.ideal !== undefined
    ) {
      height = this.constraints.height.ideal;
    } else if (
      typeof this.constraints.height === 'object' &&
      this.constraints.height.exact !== undefined
    ) {
      height = this.constraints.height.exact;
    } else if (typeof this.constraints.height === 'number' && this.constraints.height) {
      height = this.constraints.height;
    }

    return {
      width,
      height,
    };
  }

  public async applyConstraints(constraints: MediaTrackConstraints): Promise<void> {
    this.constraints = { ...constraints };
  }

  public getConstraints = (): MediaTrackConstraints => {
    return this.constraints;
  };

  public stop = (): void => {
    const event = { ...new Event(ENDED) };

    this.events.trigger(ENDED, event);
    this.readyState = ENDED;

    if (this.onended) {
      this.onended(event);
    }
  };

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
}

export default MediaStreamTrackMock;
