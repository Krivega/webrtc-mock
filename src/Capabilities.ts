/* eslint-disable no-underscore-dangle */
const MIN_WIDTH = 352;
const MAX_WIDTH = 4096;
const MIN_HEIGHT = 288;
const MAX_HEIGHT = 2160;

export type TCapabilities = {
  width: { min: number; max: number };
  height: { min: number; max: number };
};

const defaultCapabilities: TCapabilities = {
  width: { min: MIN_WIDTH, max: MAX_WIDTH },
  height: { min: MIN_HEIGHT, max: MAX_HEIGHT },
};

export default class Capabilities {
  private _capabilities: TCapabilities = defaultCapabilities;

  get capabilities() {
    return this._capabilities;
  }

  setCapabilities(capabilities: TCapabilities) {
    this._capabilities = capabilities;
  }

  resetCapabilities() {
    this.setCapabilities(defaultCapabilities);
  }

  setMinWidth(width: number) {
    this._capabilities.width.min = width;
  }

  setMaxWidth(width: number) {
    this._capabilities.width.max = width;
  }

  setMinHeight(height: number) {
    this._capabilities.height.min = height;
  }

  setMaxHeight(height: number) {
    this._capabilities.height.max = height;
  }
}
