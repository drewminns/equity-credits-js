import debounce from 'lodash.debounce';


export class Window {
  VIEWPORT_SIZE: string | null;
  PHONE_PORTRAIT: boolean;
  WINDOW_SIZE: {
    height: number;
    width: number;
  };

  constructor() {
    this.VIEWPORT_SIZE = null;
    this.PHONE_PORTRAIT = false;
    this.WINDOW_SIZE = { height: 0, width: 0 };
    this.reportWindowSize();
    this.trackWindowSize();
  }

  trackEvents = () => {
    window.addEventListener('resize', debounce(() => {
      this.reportWindowSize();
      this.trackWindowSize();
    }, 200));
  }

  private reportWindowSize = () => {
    this.WINDOW_SIZE = {
      height: window.innerHeight,
      width: window.innerWidth
    }
  }

  private trackWindowSize() {
    this.PHONE_PORTRAIT = window.matchMedia('(orientation: portrait) and (max-width: 768px) and (-webkit-min-device-pixel-ratio: 2)').matches;
  }

}