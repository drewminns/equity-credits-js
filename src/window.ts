/* eslint-disable class-methods-use-this */
export type WINDOW_SIZE = {
  height: number;
  width: number;
}

/**
 * Window methods to handle media queries in JS
 * Not to be used directly, but extended.
 * class NewClass extends Window {}
 *
 */
export abstract class Window {
  private VIEWPORT_SIZE: string;

  private WINDOW_SIZE: WINDOW_SIZE;

  private IS_PORTRAIT: boolean;

  private IS_REDUCED_MOTION: boolean;

  private SCROLL_TOP: number;

  private DEVICE_HEIGHT: number;

  constructor() {
    this.VIEWPORT_SIZE = 'MD';
    this.SCROLL_TOP = 0;
    this.DEVICE_HEIGHT = 0;
    this.IS_PORTRAIT = false;
    this.IS_REDUCED_MOTION = false;
    this.WINDOW_SIZE = {
      height: window.innerHeight,
      width: window.innerWidth,
    };
    this.trackWindowSize();
    this.trackScroll();
    this.setDeviceHeight();
  }

  /**
   * Listens for scroll on window and updates SCROLL_TOP property
   *
   * @returns void
   */
  private trackScroll(): void {
    window.addEventListener('scroll', () => {
      this.SCROLL_TOP = (
        window.pageYOffset
        || (document.documentElement
        || document.body.parentNode
        || document.body).scrollTop
      );
    });
  }

  /**
   * Getter for document.scrollTop value
   * https://www.typescriptlang.org/docs/handbook/classes.html#accessors
   *
   * Property is available on child class as `this.scrollTop`
   *
   * @returns number
   */
  get scrollTop(): number {
    return (
      window.pageYOffset
      || (document.documentElement
      || document.body.parentNode
      || document.body).scrollTop
    );
  }

  /**
   * Getter for deviceIsTouch
   * https://www.typescriptlang.org/docs/handbook/classes.html#accessors
   *
   * Property is available on child class as `this.deviceIsTouch`
   *
   * @returns boolean
   */
  get deviceIsTouch(): boolean {
    return window.matchMedia('(pointer: coarse)').matches;
  }

  /**
   * Getter for windowSize
   * https://www.typescriptlang.org/docs/handbook/classes.html#accessors
   *
   * Property is available on child class as `this.windowSize`
   * @returns WINDOW_SIZE = { width: number; height: number; }
   */
  get windowSize(): WINDOW_SIZE {
    return this.WINDOW_SIZE;
  }

  /**
   * Setter for windowSize
   * https://www.typescriptlang.org/docs/handbook/classes.html#accessors
   *
   * @param  {WINDOW_SIZE} size = { height: number; width: number; }
   */
  set windowSize(size: WINDOW_SIZE) {
    this.WINDOW_SIZE = {
      height: size.height,
      width: size.width,
    };
  }

  /**
   * sets deviceHeight on initial load and window resize.
   * Useful for tracking browser chrome on iOS and Android
   *
   * @returns void
   */
  private setDeviceHeight(): void {
    this.DEVICE_HEIGHT = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);

    window.addEventListener('resize', () => {
      this.DEVICE_HEIGHT = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    });
  }

  /**
   * Getter for deviceHeight
   * https://www.typescriptlang.org/docs/handbook/classes.html#accessors
   *
   * Property is available on child class as `this.deviceHeight`
   *
   * @returns number
   */
  get deviceHeight(): number {
    return this.DEVICE_HEIGHT;
  }

  /**
   * Getter for breakpoint value
   * https://www.typescriptlang.org/docs/handbook/classes.html#accessors
   *
   * Property is available on child class as `this.breakpoint`
   *
   * @returns {Object} { name: string; isPortrait: boolean; reducedMotion: boolean }
   */
  get breakpoint(): { name: string; isPortrait: boolean; reducedMotion: boolean } {
    this.trackWindowSize();
    return {
      name: this.VIEWPORT_SIZE,
      isPortrait: this.IS_PORTRAIT,
      reducedMotion: this.IS_REDUCED_MOTION,
    };
  }

  /**
   * Tracks the window size on initial Load
   *
   * @returns void
   */
  private trackWindowSize(): void {
    this.IS_PORTRAIT = window.matchMedia('(orientation: portrait) and (max-width: 544px) and (-webkit-min-device-pixel-ratio: 2) and (hover: none)').matches;
    this.IS_REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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
    this.VIEWPORT_SIZE = viewportSize;
  }
}
