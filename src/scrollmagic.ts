import debounce from 'lodash.debounce';
import ScrollMagic from 'scrollmagic';

import { Window } from './window';

import s from './styles/components/_item.scss';

export class MagicTime extends Window {
  CONTROLLER: any;

  SCENES: any[];

  SECTIONS: Element[];

  constructor() {
    super();
    this.SECTIONS = [];
    this.SCENES = [];
  }

  init = (sections: Element[]): void => {
    this.CONTROLLER = new ScrollMagic.Controller();
    this.SECTIONS = sections;

    this.setImageWidths();
    this.scrollSections();
    this.windowResizeListener();
  }

  /**
   * Tracks width of columns and updates width attribute of image.
   *
   * @returns void
   */
  private setImageWidths(): void {
    const sections = document.querySelectorAll('[data-section-wrap]');

    sections.forEach((section) => {
      const images = section.querySelectorAll('.pin-me img');
      let width = 0;
      let count = 0;

      if ((this.breakpoint.name !== 'xs' && this.breakpoint.name !== 'sm')) {
        width = (document.querySelector('li[data-media-section]')?.clientWidth || 0) - 100;
      }

      images.forEach((elem) => {
        if (elem instanceof HTMLElement) {
          const element = elem;

          if (element.dataset.cluster !== undefined) {
            if (this.breakpoint.name === 'md') {
              element.style.width = count > 1 ? '150px' : '300px';
            } else if ((this.breakpoint.name !== 'xs' && this.breakpoint.name !== 'sm')) {
              element.style.width = count > 1 ? '200px' : '350px';
            } else {
              element.style.width = width > 0 ? `${width}px` : '';
            }
          } else {
            element.style.width = width > 0 ? `${width}px` : '';
          }

          // eslint-disable-next-line no-plusplus
          count++;
        } else {
          throw new Error('element #test not in document');
        }
      });
    });
  }

  /**
  * Returns aspect ratio of an element
  * @param pin    element to get dimensions of
  * @returns number
  * */
  private getAspect(pin: Element): number {
    const breakpoint = this.breakpoint.name;
    const height = Number(pin?.getAttribute(`data-${breakpoint}-height`));
    const width = Number(pin?.getAttribute(`data-${breakpoint}-width`));
    let aspect = 1.6;
    if (height && width) {
      aspect = width / height;
    }

    return aspect;
  }

  /**
   * Initializes ScrollMagic for all sections provided to the class
   *
   * @returns void
   */
  private scrollSections = (): void => {
    this.SECTIONS.forEach((section) => {
      // this.SECTION.forEach((section, index) => {

      if (section.id === 'section--audio') {
        this.scrollAudioSection(section);
      } else if (this.breakpoint.name !== 'xs' && this.breakpoint.name !== 'sm') {
        const wrapper = section.querySelector('[data-section-wrap]')!;

        if (wrapper) {
          const { top } = wrapper.getBoundingClientRect();

          const mediaItems = wrapper.querySelectorAll('[data-media-section]');

          // These are images that get dragged away by green bars
          if (mediaItems && mediaItems.length > 0) {
            mediaItems.forEach((item, index) => {
              const stopper = item;
              const pin = item.querySelector('.pin-me');
              let triggerHook = 0.3;

              if (stopper && pin) {
                const aspect = this.getAspect(pin);

                const image = item.querySelector('img');
                let imageHeight = 0;

                if (image) {
                  imageHeight = Number(image.style.width.replace('px', '')) / aspect;
                }

                const stopTop = stopper.getBoundingClientRect().top;
                let distance = stopTop - top - imageHeight;

                if (mediaItems.length > 1) {
                  distance -= (100 * index * index);
                  triggerHook = 0.2;
                }

                if (distance > 0) {
                  const scene = new ScrollMagic.Scene({
                    triggerElement: section,
                    duration: distance,
                    triggerHook,
                    reverse: false,
                  })
                    .setPin(pin, { pushFollowers: false })
                    .addTo(this.CONTROLLER);
                  this.SCENES.push(scene);
                }
              }
            });
          } else {
            const mediaItem = section.querySelector('.pin-me');

            if (mediaItem) {
              const aspect = this.getAspect(mediaItem);
              const image = mediaItem.querySelector('img');
              let imageHeight = 0;
              const triggerHook = 0.3;

              if (image) {
                imageHeight = Number(image.style.width.replace('px', '')) / aspect;
              }

              const distance = top - imageHeight;

              if (distance > 50) {
                const scene = new ScrollMagic.Scene({
                  triggerElement: section,
                  duration: distance,
                  triggerHook,
                  reverse: false,
                })
                  .setPin(mediaItem, { pushFollowers: false })
                  .addTo(this.CONTROLLER);
                this.SCENES.push(scene);
              }
            }
          }
        }
      }

    });
  }

  private scrollAudioSection(section: Element): void {
    const items = section.querySelectorAll('[data-audio-link]');

    if (items && items.length > 0) {
      const highlight = section.querySelectorAll('[data-section-highlight]');
      const { height } = section.getBoundingClientRect();

      const scene = new ScrollMagic.Scene({
        triggerElement: section,
        duration: height - 8,
        triggerHook: 0.5,
        reverse: false,
      })
        .setPin(highlight, { pushFollowers: false })
        .addTo(this.CONTROLLER);

      this.SCENES.push(scene);

      items.forEach((item) => {
        const createScene = new ScrollMagic.Scene({
          triggerElement: item,
          duration: 0,
          triggerHook: 0.47,
          reverse: false,
        })
          .setClassToggle(item, s.audio_scrolled)
          .addTo(this.CONTROLLER);

        this.SCENES.push(createScene);
      });
    }
  }

  /**
  * Iterates through this.SCENES and resets scrollMagic scenes for each.
  *
  * @returns void
  * */
  private resetScenes = (shouldRefreshPositioning = false): void => {
    this.SCENES.forEach((scene) => {
      scene.removePin(true);
      if (shouldRefreshPositioning) {
        scene.refresh();
      }
    });
  }

  /**
  * Adds a window resize listener to the window to update image sizes
  * and reset scrollmagic settings
  *
  * @returns void
  * */
  private windowResizeListener = (): void => {
    window.addEventListener('resize', debounce(() => {
      this.setImageWidths();

      if (this.breakpoint.name !== 'xs' && this.breakpoint.name !== 'sm') {
        this.resetScenes(true);
        this.scrollSections();
      } else {
        this.resetScenes();
      }
    }, 500));
  }
}
