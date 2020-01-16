export type WINDOW_SIZE = {
  height: number;
  width: number;
}

export abstract class Window {
  private _VIEWPORT_SIZE: string;
  private _WINDOW_SIZE: WINDOW_SIZE;
  private _IS_PORTRAIT: boolean;
  private _IS_REDUCED_MOTION: boolean;
  private _SCROLL_TOP: number;
  private _DEVICE_HEIGHT: number;

  constructor() {
    this._VIEWPORT_SIZE = 'MD';
    this._SCROLL_TOP = 0;
    this._DEVICE_HEIGHT = 0;
    this._IS_PORTRAIT = false;
    this._IS_REDUCED_MOTION = false;
    this._WINDOW_SIZE = {
      height: window.innerHeight,
      width: window.innerWidth
    }
    this.trackWindowSize();
    this.trackScroll();
    this.setDeviceHeight();
  }

  private trackScroll() : void {
    window.addEventListener('scroll', () => {
      this._SCROLL_TOP = window.pageYOffset || (document.documentElement || document.body.parentNode || document.body).scrollTop;
    });
  }

  get scrollTop() : number {
    return window.pageYOffset || (document.documentElement || document.body.parentNode || document.body).scrollTop;
  }

  get deviceIsTouch() : boolean {
    return window.matchMedia('(pointer: coarse)').matches;
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

  private setDeviceHeight() : void {
    this._DEVICE_HEIGHT = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);

    window.addEventListener('resize', () => {
      this._DEVICE_HEIGHT = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    })
  }

  get deviceHeight(): number {
    return this._DEVICE_HEIGHT;
  }

  get breakpoint() : { name: string, isPortrait: boolean, reducedMotion: boolean } {
    this.trackWindowSize();
    return {
      name: this._VIEWPORT_SIZE,
      isPortrait: this._IS_PORTRAIT,
      reducedMotion: this._IS_REDUCED_MOTION,
    }
  }

  private trackWindowSize() : void  {
    this._IS_PORTRAIT = window.matchMedia('(orientation: portrait) and (max-width: 544px) and (-webkit-min-device-pixel-ratio: 2) and (hover: none)').matches;
    this._IS_REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let viewportSize = 'xs';

    if (window.matchMedia('min-width: 1456px)').matches) {
      viewportSize = 'xl';
    } else if (window.matchMedia('(min-width: 996px)').matches) {
      viewportSize = 'lg';
    } else if (window.matchMedia('(min-width: 768px)').matches) {
      viewportSize = 'md';
    } else if (window.matchMedia('(min-width: 544px)').matches) {
      viewportSize = 'sm';
    } else {
      viewportSize = 'xs';
    }

    document.body.setAttribute('data-viewport-size', viewportSize);
    this._VIEWPORT_SIZE = viewportSize;

  }

}