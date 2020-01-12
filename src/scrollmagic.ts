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

  init = (section: Element) => {
    this.SECTION = section;
    this.CONTROLLER = new ScrollMagic.Controller();

    this.windowResizeListener();
    this.initScrollMagic();
  }

  private initScrollMagic = () => {
    // this.scrollHero();
    this.scrollSections();
  }

  private scrollSections = () => {
    if (this.SECTION && (this.breakpoint.name !== 'xs' && this.breakpoint.name !== 'sm')) {

      // this.SECTION.forEach((section, index) => {
        const wrapper = this.SECTION.querySelector('[data-section-wrap]');

        if (wrapper) {
          const top = wrapper.getBoundingClientRect().top;
          // Check if wrapper has images
          const pin = wrapper.querySelector('.pin-me');
          const stopper = wrapper.querySelector('li[data-layout]')!;

          if (pin && stopper) {

            const stopTop = stopper.getBoundingClientRect().top;

            let distance = stopTop - top - 328;

            if (distance > 0) {
              this.SCENE = new ScrollMagic.Scene({
                triggerElement: this.SECTION,
                duration: distance,
                triggerHook: 0.4,
                reverse: false,
              })
                .setPin(pin, { pushFollowers: false })
                .addTo(this.CONTROLLER);
            }
          } else if (pin) {

            const { height, top } = this.SECTION.getBoundingClientRect();
            const caption = pin.querySelector('figcaption');

            let distance = height - 328;

            if (caption) {
              const captionHeight = caption.getBoundingClientRect().height;

              distance = distance - captionHeight;
            }

            if (distance > 0) {
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
      // })
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