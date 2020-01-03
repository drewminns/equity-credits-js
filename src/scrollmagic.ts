import { Section } from './shared/interface';
const ScrollMagic = require('scrollmagic');

export class MagicTime {
  controller: any;
  scene: any;

  init = (section: any) => {

    this.controller = new ScrollMagic.Controller();

    console.log(section);

    // Check if section has images
    const pin = section.querySelector('.pin-me');

    console.log(pin);

    if (pin) {
      this.scene = new ScrollMagic.Scene({
        triggerElement: section,
        duration: (section.offsetHeight - 282),
        triggerHook: 0.4,
      })
      .setPin(pin)
      .addTo(this.controller);
    }

  }
}