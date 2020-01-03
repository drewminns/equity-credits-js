type Easing = {
  linear: (t: number) => number,
  easeInQuad: (t: number) => number,
  easeOutQuad: (t: number) => number,
  easeInOutQuad: (t: number) => number,
  easeInCubic: (t: number) => number,
  easeOutCubic: (t: number) => number,
  easeInOutCubic: (t: number) => number,
  easeInQuart: (t: number) => number,
  easeOutQuart: (t: number) => number,
  easeInOutQuart: (t: number) => number,
  easeInQuint: (t: number) => number,
  easeOutQuint: (t: number) => number,
  easeInOutQuint: (t: number) => number
}


export class ScrollIt {
  duration: number;
  easing: keyof Easing;
  callback!: () => {};
  DOC_HEIGHT!: number;
  WINDOW_HEIGHT!: number;
  START_TIME!: number;
  START_OFFSET!: number;

  EASING_FUNCTIONS: Easing = {
    linear(t: number) {
      return t;
    },
    easeInQuad(t: number) {
      return t * t;
    },
    easeOutQuad(t: number) {
      return t * (2 - t);
    },
    easeInOutQuad(t: number) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    },
    easeInCubic(t: number) {
      return t * t * t;
    },
    easeOutCubic(t: number) {
      return (--t) * t * t + 1;
    },
    easeInOutCubic(t: number) {
      return t < 0.5 ? 4 * t * t * t : (t- 1) * (2 * t - 2) * (2 * t - 2) + 1;
    },
    easeInQuart(t: number) {
      return t * t * t * t;
    },
    easeOutQuart(t: number) {
      return 1 - (--t) * t * t * t;
    },
    easeInOutQuart(t: number) {
      return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
    },
    easeInQuint(t: number) {
      return t * t * t * t * t;
    },
    easeOutQuint(t: number) {
      return 1 + (--t) * t * t * t * t;
    },
    easeInOutQuint(t: number) {
      return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t;
    }
  };

  constructor(duration: number, easing: keyof Easing) {
    this.duration = duration || 200;
    this.easing = easing || 'linear';
  }

  init = () => {
    this.DOC_HEIGHT = document.documentElement.scrollHeight;
    this.WINDOW_HEIGHT = window.innerHeight;
    this.START_OFFSET = window.pageYOffset;
    this.START_TIME = 'now' in window.performance ? performance.now() : new Date().getTime();
    if ('requestAnimationFrame' in window === false) {
      window.scroll(0, this.DOC_HEIGHT);
      return;
    }
    this.scroll();
  }

  scroll = () => {
    const now = 'now' in window.performance ? performance.now() : new Date().getTime();
    const time = Math.min(1, ((now - this.START_TIME) / this.duration));
    const timeFunction: number = this._safeNameOf(this.EASING_FUNCTIONS, this.easing) ? this.EASING_FUNCTIONS[this.easing](time) : 1;

    // window.scroll(0, Math.ceil(timeFunction * (this.DOC_HEIGHT - this.START_OFFSET) + this.START_OFFSET));
    // console.log(window.pageYOffset, this.DOC_HEIGHT)
    if (window.scrollY === this.DOC_HEIGHT) {
      // console.log('reached it');
      // if (callback) {
      //   callback();
      // }
      return;
    }

    requestAnimationFrame(this.scroll);
  }

  private _safeNameOf<T, K extends keyof T>(source: T, key: K) {
    return source[key] ? key : null;
  }



}
