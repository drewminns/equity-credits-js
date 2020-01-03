import { Section } from './shared/interface';
const ScrollMagic = require('scrollmagic');

export class MagicTime {
  controller: any;
  scene: any;

  init = (section: any) => {

    console.log(section);

    // Check if section has images
    // const image = section.querySelector('img');

    // console.log(image);

    // if (image) {
    //   this.controller = new ScrollMagic.Controller();
    //   this.scene = new ScrollMagic.Scene({
    //     triggerElement: section,
    //     duration: (section.offsetHeight - 282),
    //     triggerHook: 0.4,
    //   })
    //   .setPin(image)
    //   .addTo(this.controller);
    // }

  }
}