class MediaStreamTrackMock implements MediaStreamTrack {
  id: string;

  kind: string;

  constraints: MediaTrackConstraints;

  enabled: boolean;

  readyState: MediaStreamTrackState = 'live';

  isolated: boolean = false;

  label: string = '';

  muted: boolean = false;

  onended: ((this: MediaStreamTrack, ev: Event) => any) | null = null;

  onisolationchange: ((this: MediaStreamTrack, ev: Event) => any) | null = null;

  onmute: ((this: MediaStreamTrack, ev: Event) => any) | null = null;

  onunmute: ((this: MediaStreamTrack, ev: Event) => any) | null = null;

  constructor(kind: string, { id = 'identifier', constraints = {} } = {}) {
    this.id = `${id}-${kind}-track`;
    this.kind = kind;
    this.enabled = true;
    this.constraints = { ...constraints };
  }

  // eslint-disable-next-line class-methods-use-this
  clone(): MediaStreamTrack {
    throw new Error('Method not implemented.');
  }

  // eslint-disable-next-line class-methods-use-this
  getCapabilities(): MediaTrackCapabilities {
    throw new Error('Method not implemented.');
  }

  // eslint-disable-next-line class-methods-use-this
  getSettings(): MediaTrackSettings {
    throw new Error('Method not implemented.');
  }

  // eslint-disable-next-line class-methods-use-this,@typescript-eslint/no-unused-vars
  dispatchEvent(event: Event): boolean {
    throw new Error('Method not implemented.');
  }

  applyConstraints(constraints: MediaTrackConstraints) {
    this.constraints = { ...constraints };

    return Promise.resolve();
  }

  getConstraints = () => {
    return this.constraints;
  };

  stop = () => {
    this.readyState = 'ended';
  };

  addEventListener = jest.fn();

  removeEventListener = jest.fn();
}

export default MediaStreamTrackMock;
