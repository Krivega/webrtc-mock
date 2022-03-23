import Events from 'events-constructor';
import { ENDED, MUTE, UNMUTE, ISOLATION_CHANGE, OVERCONSTRAINED } from './constants';

type TEventNames = typeof eventsNames;
type TEventName = TEventNames[number];
type THandler = (event: Event) => void;

const eventsNames = [ENDED, MUTE, UNMUTE, ISOLATION_CHANGE, OVERCONSTRAINED] as const;

class MediaStreamTrackMock implements MediaStreamTrack {
  private _events: Events<TEventNames>;

  id: string;

  kind: string;

  constraints: MediaTrackConstraints;

  enabled: boolean;

  contentHint = '';

  readyState: MediaStreamTrackState = 'live';

  isolated = false;

  label = '';

  muted = false;

  onended: ((this: MediaStreamTrack, ev: Event) => any) | null = null;

  onisolationchange: ((this: MediaStreamTrack, ev: Event) => any) | null = null;

  onmute: ((this: MediaStreamTrack, ev: Event) => any) | null = null;

  onunmute: ((this: MediaStreamTrack, ev: Event) => any) | null = null;

  constructor(kind: string, { id = 'identifier', constraints = {} } = {}) {
    this.id = `${id}-${kind}-track`;
    this.kind = kind;
    this.enabled = true;
    this.constraints = { ...constraints };

    this._events = new Events(eventsNames);
  }

  clone(): MediaStreamTrack {
    return Object.assign({}, this);
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

    if (typeof this.constraints?.width === 'object' && this.constraints?.width?.ideal) {
      width = this.constraints.width.ideal;
    } else if (typeof this.constraints?.width === 'object' && this.constraints?.width?.exact) {
      width = this.constraints.width.exact;
    } else if (typeof this.constraints?.width === 'number' && this.constraints?.width) {
      width = this.constraints.width;
    }

    if (typeof this.constraints?.height === 'object' && this.constraints?.height?.ideal) {
      height = this.constraints.height.ideal;
    } else if (typeof this.constraints?.height === 'object' && this.constraints?.height?.exact) {
      height = this.constraints.height.exact;
    } else if (typeof this.constraints?.height === 'number' && this.constraints?.height) {
      height = this.constraints.height;
    }

    return {
      width,
      height,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  dispatchEvent(event: Event): boolean {
    const eventName = event as unknown as TEventName;

    this._events.trigger(eventName, this);

    return true;
  }

  applyConstraints(constraints: MediaTrackConstraints): Promise<void> {
    this.constraints = { ...constraints };

    return Promise.resolve();
  }

  getConstraints = (): MediaTrackConstraints => {
    return this.constraints;
  };

  stop = (): void => {
    this.readyState = 'ended';
  };

  addEventListener = (eventName: TEventName, handler: THandler) => {
    this._events.on(eventName, handler);
  };

  removeEventListener = (eventName: TEventName, handler: THandler) => {
    this._events.off(eventName, handler);
  };
}

export default MediaStreamTrackMock;
