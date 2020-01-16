/* eslint-disable no-unused-expressions */
import anime, { AnimeInstance, AnimeTimelineInstance } from 'animejs';
import debounce from 'lodash.debounce';

import { Window } from './window';

import pause from './assets/pause.svg';
import play from './assets/play.svg';

export class Animations extends Window {
  TIME_LINE: AnimeTimelineInstance;

  PAGE_HEIGHT: number;

  SCROLL_ELEMENT: Element;

  PAGE_SCROLLING_PAUSED: boolean;

  USER_PAUSED: boolean;

  SCROLL_ANIMATION: AnimeInstance | null;

  SCROLL_POSITION: number;

  IS_USER_SCROLLING: boolean;

  PAGE_SECTIONS: Array<Element>;

  CURRENT_SECTION: number;

  DISTANCE_MAP: Array<number>;

  SCROLL_OFFSET: number;

  PLAY_PAUSE_BUTTON: any;

  USER_CLICKED_PLAY_PAUSE: boolean;

  LINKS: NodeListOf<Element> | null;

  DEBUG: boolean;

  NAV_SHOWN: boolean;

  USER_HAS_STARTED: boolean;

  constructor(debug = false) {
    super();
    this.DEBUG = debug;
    this.SCROLL_ANIMATION = null;
    this.LINKS = null;
    this.SCROLL_POSITION = 0;
    this.PAGE_HEIGHT = 0;
    this.PAGE_SCROLLING_PAUSED = false;
    this.USER_PAUSED = false;
    this.USER_CLICKED_PLAY_PAUSE = false;
    this.SCROLL_ELEMENT = window.document.scrollingElement || window.document.body || window.document.documentElement;
    this.TIME_LINE = anime.timeline({
      easing: 'easeOutExpo',
      endDelay: 500,
    });
    this.PAGE_SECTIONS = [];
    this.DISTANCE_MAP = [];
    this.CURRENT_SECTION = 0;
    this.SCROLL_OFFSET = 100;
    this.IS_USER_SCROLLING = false;
    this.NAV_SHOWN = false;
    this.USER_HAS_STARTED = false;
  }

  init = (): void => {
    if (this.deviceIsTouch) {
      this.SCROLL_OFFSET = 100 - this.deviceHeight;
    }
    this.LINKS = document.querySelectorAll('.product_link');
    this.PLAY_PAUSE_BUTTON = document.getElementById('play')!;
    this.PAGE_HEIGHT = document.body.scrollHeight;

    const intro = document.getElementById('intro')!;
    const sections = Array.from(document.querySelectorAll('[data-section-main]'));

    this.PAGE_SECTIONS = [ intro, ...sections];
    this.DISTANCE_MAP = this.setDistanceMap();

    this.attachEventListeners();

    const footer = document.getElementById('IndependentsFooter')!;
    if (footer) {
      footer.classList.remove('hidden');
    }

    this.navVisibility();
    this.pageScroll();
    this.SCROLL_ANIMATION?.pause();
  }

  private attachEventListeners(): void {
    this.listenUserScroll();

    if (this.PLAY_PAUSE_BUTTON) {
      this.PLAY_PAUSE_BUTTON.addEventListener('click', () => {
        if (this.PLAY_PAUSE_BUTTON.disabled) return;
        this.USER_CLICKED_PLAY_PAUSE = !this.USER_CLICKED_PLAY_PAUSE;
        this.scrollControls();
        this.USER_HAS_STARTED = true;
        this.USER_PAUSED = !this.USER_PAUSED;
      });
    }

    this.handleLinkHover();

    const backButton = document.getElementById('back')!;
    const forwardButton = document.getElementById('forward')!;

    backButton.addEventListener('click', (e) => {
      this.rewind(e, forwardButton, backButton);
    });

    forwardButton.addEventListener('click', (e) => {
      this.fastForward(e, forwardButton, backButton);
    });

    window.addEventListener('scroll', () => {
      if (!this.IS_USER_SCROLLING) {
        this.CURRENT_SECTION = this.getCurrentSectionIndex();
      }
      this.manageActiveButtons(forwardButton, backButton);
      this.navVisibility();
    });


    window.addEventListener('resize', debounce(() => {
      this.pauseScroll();
      const { innerHeight: height, innerWidth: width } = window;
      this.windowSize = { height, width };
      this.DISTANCE_MAP = this.setDistanceMap();
    }, 400));
  }

  private navVisibility() {
    const { scrollTop } = this;
    const threshold = this.windowSize.height * 0.5;
    if (scrollTop >= threshold) {
      this.navigationAnimation(true);
    } else if (scrollTop < threshold) {
      this.navigationAnimation(false);
      if (!this.PAGE_SCROLLING_PAUSED) {
        this.manageScrollState('pause');
      }
    }
  }

  private pauseScroll(): void {
    this.SCROLL_ANIMATION?.pause();
    this.PAGE_SCROLLING_PAUSED = true;
    this.USER_PAUSED = true;
    this.managePlayBtnState('play');
  }

  private offsetTop(el: any) : number {
    var location = 0;
    if (el.offsetParent) {
      do {
        location += el.offsetTop;
        el = el.offsetParent;
      } while (el);
    }
    return location >= 0 ? location : 0;
  }

  private setDistanceMap(): number[] {
    const distances = this.PAGE_SECTIONS.map((item) => {
      return this.offsetTop(item);
    });

    return distances;
  }

  private listenUserScroll(): void {
    window.addEventListener('wheel', (e) => {
      if (this.USER_HAS_STARTED) {
        this.handleUserScroll();
      }
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

  private handleLinkHover(): void {
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
    };

    const pauseScroll = () : void => {
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

  private handleUserScroll(): void {
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
      if (this.breakpoint.name === 'xs' || this.breakpoint.name === 'sm') {
        return;
      }

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

  private manageActiveButtons(f: Element, b: Element) : void {
    if (this.CURRENT_SECTION <= 0) {
      b.setAttribute('disabled', 'true');
    } else {
      b.removeAttribute('disabled');
    }

    if (this.CURRENT_SECTION >= this.PAGE_SECTIONS.length - 1) {
      f.setAttribute('disabled', 'true');
    } else {
      f.removeAttribute('disabled');
    }
  }

  private getCurrentSectionIndex() : number {
    this.SCROLL_POSITION = (
      (window.pageYOffset || this.SCROLL_ELEMENT.scrollTop)
      - (this.SCROLL_ELEMENT.clientTop || 0)
      + this.SCROLL_OFFSET
    );

    const index = this.DISTANCE_MAP.findIndex(item => {
      return this.SCROLL_POSITION < item;
    });

    return index === -1 ? this.PAGE_SECTIONS.length - 1 : (index === 0 ? 0 : index - 1);
  }

  private rewind = (e: any, forward: Element, back: Element) : void => {
    // we need to calculate how far into the current section one is
    // If we are just starting in the section, go to the previous one
    // if we are far into the curent section, go to the top
    const sectionScrolled = this.SCROLL_POSITION - this.DISTANCE_MAP[this.CURRENT_SECTION] - this.SCROLL_OFFSET;

    const newSectionIndex = sectionScrolled > 20 ? this.CURRENT_SECTION : this.CURRENT_SECTION - 1;

    if (newSectionIndex < 0) {
      return;
    }

    this.scrollToSection(newSectionIndex, 'rewind');
  }

  private fastForward = (e: any, forward: Element, back: Element) : void => {
    const newSectionIndex = this.CURRENT_SECTION + 1;

    if (newSectionIndex > this.PAGE_SECTIONS.length) {
      return;
    }

    this.scrollToSection(newSectionIndex, 'forward');
  }

  private scrollToSection(newIndex: number, direction: string) : void {
    let index = newIndex;
    this.IS_USER_SCROLLING = true;
    if (direction === 'forward' && this.PAGE_SECTIONS[index].getBoundingClientRect().top < this.SCROLL_OFFSET) {
      index += 1;
    }


    const nextSection = this.PAGE_SECTIONS[index];
    const scrollTop = (
      newIndex === 0
        ? 0
        : window.pageYOffset + nextSection.getBoundingClientRect().top - this.SCROLL_OFFSET);
    let resumeScroll = false;

    this.PLAY_PAUSE_BUTTON.setAttribute('disabled', true);

    if (!this.PAGE_SCROLLING_PAUSED) {
      this.SCROLL_ANIMATION?.pause();
      this.PAGE_SCROLLING_PAUSED = true;
      resumeScroll = true;
    }

    this.SCROLL_ANIMATION = anime({
      targets: this.SCROLL_ELEMENT,
      scrollTop,
      easing: 'linear',
      duration: 500,
      complete: () => {
        this.PLAY_PAUSE_BUTTON.removeAttribute('disabled');
        this.IS_USER_SCROLLING = false;

        if (resumeScroll) {
          this.pageScroll();
          this.PAGE_SCROLLING_PAUSED = false;
        }
      },
    });

    this.CURRENT_SECTION = newIndex;
  }

  private pageScroll() {
    const currentScroll = this.SCROLL_ELEMENT.scrollTop;

    this.SCROLL_ANIMATION = anime({
      targets: this.SCROLL_ELEMENT,
      scrollTop: this.PAGE_HEIGHT + 500,
      duration: (this.PAGE_HEIGHT - currentScroll) / 0.007,
    });
  }

  private managePlayBtnState(state: string): void {
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

  private manageScrollState(state = 'pause'): void {
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

  private scrollControls(): void {
    if (!this.PAGE_SCROLLING_PAUSED && this.USER_HAS_STARTED) {
      this.manageScrollState('pause');
    } else {
      this.manageScrollState('play');
    }
  }

  private navigationAnimation = (show: boolean): void => {
    const nav = document.querySelector('#nav');

    if (show) {
      nav?.setAttribute('data-nav-visible', 'true');
      nav?.removeAttribute('data-nav-hidden');
    } else {
      nav?.removeAttribute('data-nav-visible');
      nav?.setAttribute('data-nav-hidden', 'true');
    }
  }
}