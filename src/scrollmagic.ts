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
    this.CONTROLLER = new ScrollMagic.Controller();

    const wrapper = section.querySelector('[data-section-wrap]');

    if (wrapper) {
      const top = wrapper.getBoundingClientRect().top;
      // Check if wrapper has images
      const pin = wrapper.querySelector('.pin-me');

      if (pin) {

        const stopper = wrapper.querySelector('li[data-layout]');
        const stopTop = stopper.getBoundingClientRect().top;

        const distance = stopTop - top - 262;

        if (distance >= 0) {
          this.SCENE = new ScrollMagic.Scene({
            triggerElement: section,
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

  cleanupScrollMagic() {
    console.log('destroy scrollmagic');
    if (this.SECTION) {
      const pinSpacer = this.SECTION.querySelector('[data-scrollmagic-pin-spacer]');

      if (pinSpacer) this.unwrap(pinSpacer);
    }

  }

  private unwrap(el: Element) {
    const parent = el.parentNode!;
    const pin = parent.querySelector('.pin-me')!;

    if (pin) {
      pin.removeAttribute('style');
      parent.insertBefore(pin, el);
    }

    // remove the empty element
    parent.removeChild(el);
  }
}