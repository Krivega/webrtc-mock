import Events from 'events-constructor';
import { ENDED, ISOLATION_CHANGE, MUTE, OVERCONSTRAINED, UNMUTE } from './constants';

const eventsNames = [ENDED, MUTE, UNMUTE, ISOLATION_CHANGE, OVERCONSTRAINED] as const;

type TEventNames = typeof eventsNames;
type TEventName = TEventNames[number];
type THandler = (event: Event) => void;

export type TOptions = {
  id?: string;
  constraints?: MediaTrackConstraints;
};

class MediaStreamTrackMock implements MediaStreamTrack {
  private readonly events: Events<TEventNames>;

  id: string;

  kind: string;

  constraints: MediaTrackConstraints;

  enabled: boolean;

  contentHint = '';

  readyState: MediaStreamTrackState = 'live';

  isolated = false;

  label = '';

  muted = false;

  onended: ((this: MediaStreamTrack, event_: Event) => unknown) | null = null;

  onisolationchange: ((this: MediaStreamTrack, event_: Event) => unknown) | null = null;

  onmute: ((this: MediaStreamTrack, event_: Event) => unknown) | null = null;

  onunmute: ((this: MediaStreamTrack, event_: Event) => unknown) | null = null;

  constructor(kind: string, { id = 'identifier', constraints = {} }: TOptions = {}) {
    this.id = `${id}-${kind}-track`;
    this.kind = kind;
    this.enabled = true;
    this.constraints = { ...constraints };

    this.events = new Events(eventsNames);
  }

  clone(): MediaStreamTrack {
    return { ...this };
  }

  getCapabilities(): MediaTrackCapabilities {
    return {
      width: { min: 352, max: 4096 },
      height: { min: 288, max: 2160 },
    };
  }

  getSettings(): MediaTrackSettings {
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

  async applyConstraints(constraints: MediaTrackConstraints): Promise<void> {
    this.constraints = { ...constraints };
  }

  getConstraints = (): MediaTrackConstraints => {
    return this.constraints;
  };

  stop = (): void => {
    const event = { ...new Event(ENDED) };

    this.events.trigger(ENDED, event);
    this.readyState = ENDED;

    if (this.onended) {
      this.onended(event);
    }
  };

  addEventListener = (eventName: TEventName, handler: THandler) => {
    this.events.on(eventName, handler);
  };

  removeEventListener = (eventName: TEventName, handler: THandler) => {
    this.events.off(eventName, handler);
  };

  dispatchEvent(event: Event): boolean {
    const eventName = event.type as TEventName;

    this.events.trigger(eventName, event);

    return true;
  }
}

export default MediaStreamTrackMock;
