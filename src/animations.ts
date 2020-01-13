import anime, { AnimeInstance, AnimeTimelineInstance } from 'animejs';
import debounce from 'lodash.debounce';

import { Window } from './window';

import pause from './assets/pause.svg';
import play from './assets/play.svg';

export class Animations extends Window {
  TIME_LINE: AnimeTimelineInstance;
  PAGE_HEIGHT: number;
  SCROLL_ELEMENT: Element;
  SCROLL_TOP: number;
  PAGE_SCROLLING_PAUSED: boolean;
  USER_PAUSED: boolean;
  SCROLL_ANIMATION: AnimeInstance | null;
  SCROLL_POSITION: number;
  PAGE_SECTIONS: Array<Element>;
  CURRENT_SECTION: number;
  DISTANCE_MAP: Array<number>;
  SCROLL_OFFSET: number;
  PLAY_PAUSE_BUTTON: any;
  USER_CLICKED_PLAY_PAUSE: boolean;
  LINKS: NodeListOf<Element> | null;
  DEBUG: boolean;

  constructor() {
    super();
    this.DEBUG = false;
    this.SCROLL_ANIMATION = null;
    this.LINKS = null;
    this.SCROLL_TOP = 0;
    this.SCROLL_POSITION = 0;
    this.PAGE_HEIGHT = 0;
    this.PAGE_SCROLLING_PAUSED = false;
    this.USER_PAUSED = false;
    this.USER_CLICKED_PLAY_PAUSE = false;
    this.SCROLL_ELEMENT = window.document.scrollingElement || window.document.body || window.document.documentElement;
    this.TIME_LINE = anime.timeline({
      easing: 'easeOutExpo',
      endDelay: 500
    });
    this.PAGE_SECTIONS = [];
    this.DISTANCE_MAP = [];
    this.CURRENT_SECTION = 0;
    this.SCROLL_OFFSET = 100;
  }

  init = (SCROLL_TOP: number) : void => {
    this.LINKS = document.querySelectorAll('.product_link');
    this.PLAY_PAUSE_BUTTON = document.getElementById('play')!;
    this.SCROLL_TOP = SCROLL_TOP;
    this.PAGE_HEIGHT = document.body.scrollHeight;
    this.SCROLL_OFFSET = this.getScrollOffset();

    const intro = document.getElementById('intro')!;
    const sections = Array.from(document.querySelectorAll('[data-section-main]'));

    this.PAGE_SECTIONS = [ intro, ...sections];
    this.setDistanceMap();

    window.document.body.setAttribute('data-no-scroll', 'true');
    this.introAnimation();

    this.setDeviceHeight();
    this.attachEventListeners();
    // this.preventScrollInPortrait(this.breakpoint.isPortrait);

  }

  private getScrollOffset = () => {
    return (this.breakpoint.name !== 'xs' && this.breakpoint.name !== 'sm') ? 100 : 100;
  }

  private attachEventListeners = () => {

    if (this.PLAY_PAUSE_BUTTON) {

      this.PLAY_PAUSE_BUTTON.addEventListener('click', () => {
        if (this.PLAY_PAUSE_BUTTON.disabled) return;
        this.scrollControls();
        this.USER_CLICKED_PLAY_PAUSE = !this.USER_CLICKED_PLAY_PAUSE;
        this.USER_PAUSED = !this.USER_PAUSED;
      });
    }

    this.handleLinkHover();

    const backButton = document.getElementById('back')!;
    const forwardButton = document.getElementById('forward')!;

    backButton.addEventListener('click', (e) => {
      this.rewind(e, forwardButton, backButton);
    })

    forwardButton.addEventListener('click', (e) => {
      this.fastForward(e, forwardButton, backButton);
    });

    window.addEventListener('scroll', () => {
      this.CURRENT_SECTION = this.getCurrentSectionIndex();
      this.manageActiveButtons(forwardButton, backButton);
    });


    window.addEventListener('resize', debounce(() => {
      const { innerHeight: height, innerWidth: width } = window;
      this.windowSize = { height, width };
      this.SCROLL_OFFSET = this.getScrollOffset();
      this.setDeviceHeight();
      this.setDistanceMap();

      console.log(this.DISTANCE_MAP);
      // this.preventScrollInPortrait(this.breakpoint.isPortrait);
    }, 400));
  }

  private offsetTop = (el: any) => {
    var location = 0;
    if (el.offsetParent) {
      do {
        location += el.offsetTop;
        el = el.offsetParent;
      } while (el);
    }
    return location >= 0 ? location : 0;
  }

  private setDistanceMap = () => {
    // Store the distance for each section from the top of the page to the top of the section
    const distances = this.PAGE_SECTIONS.map((item, index) => {
      return index === 0 ? 0 : this.offsetTop(item);
    });

    this.DISTANCE_MAP = distances;
  }

  private setDeviceHeight = () => {
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
  }

  private listenUserScroll = () => {
    window.addEventListener('wheel', (e) => {
      this.handleUserScroll();
    });

    window.addEventListener('touchmove', (e) => {
      if (e.target instanceof Element) {
        const tagName = e.target.tagName.toLowerCase();
        if (tagName === 'rect' || tagName === 'svg' || tagName === 'button') {
          return;
        }
      }
      this.handleUserScroll();
    });
  }

  // private preventScrollInPortrait(isPortrait: boolean) {
  //   if (isPortrait) {
  //     this.PAGE_SCROLLING_PAUSED = true;
  //     // document.body.setAttribute('data-no-scroll', 'true');
  //     this.SCROLL_ANIMATION?.pause();
  //   } else if (this.PAGE_SCROLLING_PAUSED && !this.USER_PAUSED) {
  //     this.PAGE_SCROLLING_PAUSED = false;
  //     document.body.removeAttribute('data-no-scroll');
  //     this.pageScroll();
  //   }
  // }

  private handleLinkHover = () => {

    let resumeScroll = false;
    let isScrolling: any;

    const startScroll = () => {
      if (this.USER_CLICKED_PLAY_PAUSE) {
        return;
      }
      if (resumeScroll) {

        if (isScrolling) {
          window.clearTimeout(isScrolling);
        }

        isScrolling = setTimeout(() => {

          // We need to check if scrolling has resumed in the meantime
          // This could be via play/pause click
          if (this.PAGE_SCROLLING_PAUSED) {

            this.manageScrollState('play');
            this.USER_PAUSED = false;
          }
        }, 3500);
      }
    }

    const pauseScroll = () => {
      if (!this.PAGE_SCROLLING_PAUSED) {
        this.SCROLL_ANIMATION?.pause();
        this.PAGE_SCROLLING_PAUSED = true;
        this.USER_PAUSED = true;
        this.managePlayBtnState('play');
        resumeScroll = true;
      }
    }

    if (this.LINKS) {
      this.LINKS.forEach((el) => {
        el.addEventListener('focus', () => pauseScroll());
        el.addEventListener('mouseenter', () => pauseScroll());
        el.addEventListener('mouseleave', () => startScroll())
      });
    }

    // If the page is not paused, pause it and let default scroll take over

  }

  private handleUserScroll = () => {
    let resumeScroll = false;
    let isScrolling: any;

    if (this.PAGE_SCROLLING_PAUSED) {
      return;
    }

    // If the page is not paused, pause it and let default scroll take over
    if (!this.PAGE_SCROLLING_PAUSED) {
      this.SCROLL_ANIMATION?.pause();
      this.PAGE_SCROLLING_PAUSED = true;
      this.USER_PAUSED = true;
      this.managePlayBtnState('play');
      resumeScroll = true;
    }

    if (resumeScroll) {

      if (isScrolling) {
        window.clearTimeout(isScrolling);
      }

      isScrolling = setTimeout(() => {

        // We need to check if scrolling has resumed in the meantime
        // This could be via play/pause click
        if (this.PAGE_SCROLLING_PAUSED) {

          this.manageScrollState('play');
          this.USER_PAUSED = false;
        }
      }, 3500);
    }
  }

  private manageActiveButtons = (f: Element, b: Element) => {

    // if (this.CURRENT_SECTION <= 0) {
    //   b.setAttribute('disabled', 'true');
    // } else {
    //   b.removeAttribute('disabled');
    // }

    if (this.SCROLL_POSITION <= (this.SCROLL_OFFSET * 2)) {
      b.setAttribute('disabled', 'true');
    } else {
      b.removeAttribute('disabled');
    }

    // if ( this.CURRENT_SECTION >= this.PAGE_SECTIONS.length) {
    //   f.setAttribute('disabled', 'true');
    // } else {
    //   f.removeAttribute('disabled');
    // }

    if (this.SCROLL_POSITION >= ( this.PAGE_HEIGHT - this.SCROLL_OFFSET - window.innerHeight )) {
      f.setAttribute('disabled', 'true');
    } else {
      f.removeAttribute('disabled');
    }

  }

  private getCurrentSectionIndex = () => {
    // this.SCROLL_POSITION = (window.pageYOffset || this.SCROLL_ELEMENT.scrollTop) - (this.SCROLL_ELEMENT.clientTop || 0);
    this.SCROLL_POSITION = this.SCROLL_ELEMENT.scrollTop + this.SCROLL_OFFSET;

    const index = this.DISTANCE_MAP.findIndex((item, index) => {
      return this.SCROLL_POSITION < item;
    });

    return index === -1 ? this.PAGE_SECTIONS.length - 1 : (index === 0 ? 0 : index - 1);
  }

  private rewind = (e: any, forward: Element, back: Element) => {
    // we need to calculate how far into the current section one is
    // If we are just starting in the section, go to the previous one
    // if we are far into the curent section, go to the top
    const sectionScrolled = this.SCROLL_POSITION - this.DISTANCE_MAP[this.CURRENT_SECTION];

    let newSectionIndex = sectionScrolled > 50 ? this.CURRENT_SECTION : this.CURRENT_SECTION - 1;

    if (newSectionIndex < 0) {
      newSectionIndex = 0;
    }

    this.scrollToSection(newSectionIndex);
  }

  private fastForward = (e: any, forward: Element, back: Element) => {

    const newSectionIndex = this.CURRENT_SECTION + 1;

    if (newSectionIndex > this.PAGE_SECTIONS.length) {
      return;
    } else if (newSectionIndex === this.PAGE_SECTIONS.length) {
      this.scrollToSection(newSectionIndex - 1, true);
    } else {
      this.scrollToSection(newSectionIndex);
    }
  }

  private scrollToSection = (newIndex: number, end: boolean = false) => {

    let scrollTop: any;

    if (end) {
      scrollTop = this.PAGE_HEIGHT;
    } else {
      scrollTop = newIndex === 0 ? 0 : this.DISTANCE_MAP[newIndex] - this.SCROLL_OFFSET;
    }

    // const distance = Math.abs(scrollTop - this.SCROLL_POSITION);

    let resumeScroll = false;

    this.PLAY_PAUSE_BUTTON.setAttribute('disabled', true);

    if (!this.PAGE_SCROLLING_PAUSED) {
      this.SCROLL_ANIMATION?.pause();
      this.PAGE_SCROLLING_PAUSED = true;
      resumeScroll = true;
    }

    // const duration = distance < 1000 ? (distance / (100)) * 100 : (distance / (300)) * 100;

    this.SCROLL_ANIMATION = anime({
      targets: this.SCROLL_ELEMENT,
      scrollTop: scrollTop,
      easing: 'linear',
      duration: 500,
      complete: () => {
        this.PLAY_PAUSE_BUTTON.removeAttribute('disabled');
        // el.removeAttribute('disabled');
        if (resumeScroll) {
          this.pageScroll();
          this.PAGE_SCROLLING_PAUSED = false;
        }

        this.CURRENT_SECTION = newIndex;
      }
    });
  }

  private runScrolling = () => {
    const intro = document.getElementById('intro')!;
    const introText1 = document.getElementById('intro-text1')!;
    const introText2 = document.getElementById('intro-text2')!;
    intro.style.opacity = '1';
    introText1.style.opacity = '1';
    introText2.style.opacity = '1';

    const footer = document.getElementById('IndependentsFooter')!;
    if (footer) {
      footer.classList.remove('hidden');
    }

    this.scrollFadeIn();
    this.pageScroll();
    this.navigationAnimation();
    this.listenUserScroll();
  }

  private introAnimation = () => {

    this.TIME_LINE
      .add({
        targets: '#intro',
        opacity: 1,
        duration: this.DEBUG ? 0 : 1200
      })
      .add({
        targets: '#intro-text1',
        opacity: 1,
        duration: this.DEBUG ? 0 : 3500
      })
      .add({
        targets: '#intro-text2',
        opacity: 1,
        duration: this.DEBUG ? 0 : 3500,
        endDelay: this.DEBUG ? 0 : 2500
      });

    this.TIME_LINE.finished.then(() => {
      window.scrollTo(0, 1);
      this.runScrolling();
      window.document.body.removeAttribute('data-no-scroll');
    });
  }

  private scrollFadeIn() {
    anime({
      targets: '#main_content',
      opacity: 1,
      duration: this.DEBUG ? 0 : 1000,
    });
  }

  private pageScroll = () => {
    const currentScroll = this.SCROLL_ELEMENT.scrollTop;

    this.SCROLL_ANIMATION = anime({
      targets: this.SCROLL_ELEMENT,
      scrollTop: this.PAGE_HEIGHT + 500,
      duration: (this.PAGE_HEIGHT - currentScroll) / .007
    });
  }

  private managePlayBtnState = (state: string) => {

    if (this.PLAY_PAUSE_BUTTON) {
      const text = document.getElementById('play--text')!;
      const icon = document.getElementById('play--icon')!;

      if (state === 'play') {
        text.innerHTML = 'Play';
        icon.innerHTML = play;
      } else {
        text.innerHTML = 'Pause';
        icon.innerHTML = pause;
      }
    }
  }

  private manageScrollState(state: string = 'pause') {
    if (!this.SCROLL_ANIMATION) return;

    if (state === 'play') {
      this.pageScroll();
      this.PAGE_SCROLLING_PAUSED = false;
      this.managePlayBtnState('pause');
    } else {
      this.SCROLL_ANIMATION.pause();
      this.PAGE_SCROLLING_PAUSED = true;
      this.managePlayBtnState('play');
    }
  }

  private scrollControls = () => {
    if (!this.PAGE_SCROLLING_PAUSED) {
      this.manageScrollState('pause');
    } else {
      this.manageScrollState('play');
    }
  }

  private navigationAnimation = () => {
    anime({
      targets: '#nav',
      opacity: 1,
      duration: 2000,
    })
  }
}