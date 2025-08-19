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

  public get capabilities() {
    return this._capabilities;
  }

  public setCapabilities(capabilities: TCapabilities) {
    this._capabilities = capabilities;
  }

  public resetCapabilities() {
    this.setCapabilities(defaultCapabilities);
  }

  public setMinWidth(width: number) {
    this._capabilities.width.min = width;
  }

  public setMaxWidth(width: number) {
    this._capabilities.width.max = width;
  }

  public setMinHeight(height: number) {
    this._capabilities.height.min = height;
  }

  public setMaxHeight(height: number) {
    this._capabilities.height.max = height;
  }
}
