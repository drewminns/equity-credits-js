/* eslint-disable class-methods-use-this */
export type WINDOW_SIZE = {
  height: number;
  width: number;
}

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

  get scrollTop(): number {
    return (
      window.pageYOffset
      || (document.documentElement
      || document.body.parentNode
      || document.body).scrollTop
    );
  }

  get deviceIsTouch(): boolean {
    return window.matchMedia('(pointer: coarse)').matches;
  }

  get windowSize(): WINDOW_SIZE {
    return this.WINDOW_SIZE;
  }

  set windowSize(size: WINDOW_SIZE) {
    this.WINDOW_SIZE = {
      height: size.height,
      width: size.width,
    };
  }

  private setDeviceHeight(): void {
    this.DEVICE_HEIGHT = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);

    window.addEventListener('resize', () => {
      this.DEVICE_HEIGHT = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    });
  }

  get deviceHeight(): number {
    return this.DEVICE_HEIGHT;
  }

  get breakpoint(): { name: string; isPortrait: boolean; reducedMotion: boolean } {
    this.trackWindowSize();
    return {
      name: this.VIEWPORT_SIZE,
      isPortrait: this.IS_PORTRAIT,
      reducedMotion: this.IS_REDUCED_MOTION,
    };
  }

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
