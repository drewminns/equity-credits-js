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
    this.setImageWidths();
    this.CONTROLLER = new ScrollMagic.Controller();

    this.initScrollMagic();
    this.windowResizeListener();
    window.addEventListener('resize', () => {
      this.setImageWidths();
    })
  }

  private initScrollMagic = () => {
    this.scrollSections();
  }

  private setImageWidths() {
    this.trackLISize();
  }

  private trackLISize() {
    const images = document.querySelectorAll('.pin-me img');
    if ((this.breakpoint.name !== 'xs' && this.breakpoint.name !== 'sm')) {
      const width = (document.querySelector('li[data-media-section]')?.clientWidth || 0) - 60;
      images.forEach((elem) => {
        if (elem instanceof HTMLElement) {
          elem.style.width = `${width}px`;
        } else {
          throw new Error("element #test not in document")
        }
      });
    } else {
      images.forEach((elem) => {
        if (elem instanceof HTMLElement) {
          elem.style.width = '';
        } else {
          throw new Error("element #test not in document")
        }
      })
    }
  }

  private getAspect(pin: Element) {
    const height = Number(pin?.getAttribute(`data-${this.breakpoint.name}-height`));
    const width = Number(pin?.getAttribute(`data-${this.breakpoint.name}-width`));
    let aspect = 1.6;
    if (height && width) {
      aspect = width / height;
    }

    return aspect;
  }

  private scrollSections = async () => {
    this.CONTROLLER = new ScrollMagic.Controller();

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

            const aspect = this.getAspect(pin);
            const image = stopper.querySelector('img');
            let imageHeight = 0;

            if (image) {
              imageHeight = Number(image.style.width.replace('px', '')) / aspect;
            }

            let distance = stopTop - top - imageHeight;


            if (distance > 0) {
              new ScrollMagic.Scene({
                triggerElement: this.SECTION,
                duration: distance,
                triggerHook: 0.3,
                reverse: false,
              })
                .setPin(pin, { pushFollowers: false })
                .addTo(this.CONTROLLER);
            }
          } else if (pin) {

            const { height } = this.SECTION.getBoundingClientRect();
            const image = this.SECTION.querySelector('img');
            const aspect = this.getAspect(pin);

            let imageHeight = 0;

            if (image) {
              imageHeight = Number(image.style.width.replace('px', '')) / aspect;
            }

            let distance = height - imageHeight;

            if (distance > 0) {
              this.SCENE = new ScrollMagic.Scene({
                triggerElement: this.SECTION,
                duration: distance,
                triggerHook: 0.2,
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

      if (this.breakpoint.name !== 'xs' && this.breakpoint.name !== 'sm') {
        this.setImageWidths();
        this.initScrollMagic();
      }

    }, 400));
  }
}