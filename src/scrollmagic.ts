import { Section } from './shared/interface';
import { Window } from './window';
import debounce from 'lodash.debounce';

const ScrollMagic = require('scrollmagic');

export class MagicTime extends Window {
  CONTROLLER: any;
  SCENE: any;
  SECTION: Element | null;

  constructor() {
    super();
    this.SECTION = null;
  }

  init = (section: any) => {
    this.SECTION = section;

    this.windowResizeListener();
    this.initScrollMagic();
  }

  private initScrollMagic = () => {
    this.CONTROLLER = new ScrollMagic.Controller();

    if (this.SECTION && (this.breakpoint.name !== 'xs' && this.breakpoint.name !== 'sm')) {
      const wrapper = this.SECTION.querySelector('[data-section-wrap]');

      if (wrapper) {
        const top = wrapper.getBoundingClientRect().top;
        // Check if wrapper has images
        const pin = wrapper.querySelector('.pin-me');

        if (pin) {

          console.log(pin);

          const stopper = wrapper.querySelector('li[data-layout]')!;

          const stopTop = stopper.getBoundingClientRect().top;
          const height = pin.getBoundingClientRect().height;

          console.log(height);

          const distance = stopTop - top - height;

          if (distance >= 0) {
            this.SCENE = new ScrollMagic.Scene({
              triggerElement: this.SECTION,
              duration: distance,
              triggerHook: 0.4,
              reverse: false,
            })
              .setPin(pin, { pushFollowers: false })
              .addTo(this.CONTROLLER);
          }
        }
      }
    }
  }

  private cleanupScrollMagic() {
    if (this.SECTION) {
      const pinSpacer = this.SECTION.querySelector('[data-scrollmagic-pin-spacer]');

      if (pinSpacer) this.unwrapEl(pinSpacer);
    }
  }

  private unwrapEl(el: Element) {
    const parent = el.parentNode!;
    const pin = parent.querySelector('.pin-me')!;

    if (pin) {
      pin.removeAttribute('style');
      parent.insertBefore(pin, el);
    }

    // remove the empty element
    parent.removeChild(el);
  }

  windowResizeListener = () => {
    window.addEventListener('resize', debounce(() => {

      if (this.CONTROLLER) {
        this.CONTROLLER.destroy();
        this.CONTROLLER = null;
      }
      this.cleanupScrollMagic();

      if (this.breakpoint.name !== 'xs' && this.breakpoint.name !== 'sm') {
        this.initScrollMagic();
      }

    }, 400));
  }

}