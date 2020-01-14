import { Section } from './shared/interface';
import { Window } from './window';
import debounce from 'lodash.debounce';
import throttle from 'lodash.throttle';

const ScrollMagic = require('scrollmagic');

export class MagicTime extends Window {
  CONTROLLER: any;
  SCENES: any[];
  SECTIONS: Element[];

  constructor() {
    super();
    this.SECTIONS = [];
    this.SCENES = [];
  }

  init = (sections: Element[]) => {
    this.CONTROLLER = new ScrollMagic.Controller();
    this.SECTIONS = sections;
    this.setImageWidths();

    this.initScrollMagic();
    this.windowResizeListener();
  }

  private initScrollMagic = () => {
    this.scrollSections();
  }

  private setImageWidths() {
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

  private scrollSections = () => {

    if (this.breakpoint.name !== 'xs' && this.breakpoint.name !== 'sm') {
      this.SECTIONS.forEach((section) => {

        // this.SECTION.forEach((section, index) => {
          const wrapper = section.querySelector('[data-section-wrap]')!;

          if (wrapper) {
            const top = wrapper.getBoundingClientRect().top;
            // Check if wrapper has images
            const pin = wrapper.querySelector('.pin-me')!;
            const stopper = wrapper.querySelector('li[data-layout]')!;
            // console.log(stopper);

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
                const scene = new ScrollMagic.Scene({
                  triggerElement: section,
                  duration: distance,
                  triggerHook: 0.3,
                  reverse: false,
                })
                  .setPin(pin, { pushFollowers: false })
                  .addTo(this.CONTROLLER)
                this.SCENES.push(scene);
              }
            } else if (pin) {

              const { height } = section.getBoundingClientRect();
              const image = section.querySelector('img');
              const aspect = this.getAspect(pin);

              let imageHeight = 0;
1
              if (image) {
                imageHeight = Number(image.style.width.replace('px', '')) / aspect;
              }

              let distance = height - imageHeight;

              if (distance > 50) {
                const scene = new ScrollMagic.Scene({
                  triggerElement: section,
                  duration: distance,
                  triggerHook: 0.2,
                  reverse: false,
                })
                  .setPin(pin, { pushFollowers: false })
                  .addTo(this.CONTROLLER)
                this.SCENES.push(scene);
              }
            }
          }
        })
      }
  }

  private windowResizeListener = () => {
    window.addEventListener('resize', throttle(() => {
      this.setImageWidths();

      this.SCENES.forEach((scene) => {
        scene.removePin(true);
        scene.refresh();
      });

      if (this.breakpoint.name !== 'xs' && this.breakpoint.name !== 'sm') {
        this.initScrollMagic();
      }

    }, 500));
  }
}