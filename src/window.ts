export type WINDOW_SIZE = {
  height: number;
  width: number;
}

export abstract class Window {
  private _VIEWPORT_SIZE: string;
  private _WINDOW_SIZE: WINDOW_SIZE;
  private _IS_PORTRAIT: boolean;

  constructor() {
    this._VIEWPORT_SIZE = 'MD';
    this._IS_PORTRAIT = false;
    this._WINDOW_SIZE = {
      height: window.innerHeight,
      width: window.innerWidth
    }
    this.trackWindowSize();
  }

  get windowSize(): WINDOW_SIZE {
    return this._WINDOW_SIZE;
  }

  set windowSize(size: WINDOW_SIZE) {
    this._WINDOW_SIZE = {
      height: size.height,
      width: size.width,
    }
  }

  get breakpoint() : { name: string, isPortrait: boolean } {
    this.trackWindowSize();
    return {
      name: this._VIEWPORT_SIZE,
      isPortrait: this._IS_PORTRAIT
    }
  }

  private trackWindowSize()  {
      this._IS_PORTRAIT = window.matchMedia('(orientation: portrait) and (max-width: 544px) and (-webkit-min-device-pixel-ratio: 2) and (hover: none)').matches;

      if (window.matchMedia('(min-width: 544px').matches) {
        this._VIEWPORT_SIZE = 'sm';
      } else if (window.matchMedia('(min-width: 768px').matches) {
        this._VIEWPORT_SIZE = 'md';
      } else if (window.matchMedia('(min-width: 996px').matches) {
        this._VIEWPORT_SIZE = 'lg';
      } else if (window.matchMedia('min-width: 1456px').matches) {
        this._VIEWPORT_SIZE = 'xl';
      } else {
        this._VIEWPORT_SIZE = 'xs';
      }
  }

}