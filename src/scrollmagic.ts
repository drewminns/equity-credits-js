import { Section } from './shared/interface';
const ScrollMagic = require('scrollmagic');

export class MagicTime {
  controller: any;
  scene: any;
  SECTION: any;

  init = (section: any) => {

    this.SECTION = section;

    this.controller = new ScrollMagic.Controller();

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
          this.scene = new ScrollMagic.Scene({
            triggerElement: section,
            duration: distance,
            triggerHook: 0.4,
            reverse: false,
          })
            .setPin(pin, { pushFollowers: false })
            .addTo(this.controller);
        }
      }
    }

    this.controller.destroy();
    this.controller = null;
    this.cleanupScrollMagic();

  }

  cleanupScrollMagic() {
    console.log('destroy scrollmagic');

    const pinSpacer = this.SECTION.querySelector('[data-scrollmagic-pin-spacer]');

    if (pinSpacer) {
      this.unwrap(pinSpacer);
    }

  }

  private unwrap(el: Element)  {
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