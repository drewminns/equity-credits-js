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
  IS_USER_SCROLLING: Boolean;
  PAGE_SECTIONS: Array<Element>;
  CURRENT_SECTION: number;
  DISTANCE_MAP: Array<number>;
  SCROLL_OFFSET: number;
  PLAY_PAUSE_BUTTON: any;
  USER_CLICKED_PLAY_PAUSE: boolean;
  LINKS: NodeListOf<Element> | null;
  DEBUG: boolean;

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
      endDelay: 500
    });
    this.PAGE_SECTIONS = [];
    this.DISTANCE_MAP = [];
    this.CURRENT_SECTION = 0;
    this.SCROLL_OFFSET = 100;
    this.IS_USER_SCROLLING = false;
  }

  init = () : void => {

    this.LINKS = document.querySelectorAll('.product_link');
    this.PLAY_PAUSE_BUTTON = document.getElementById('play')!;
    this.PAGE_HEIGHT = document.body.scrollHeight;

    const intro = document.getElementById('intro')!;
    const sections = Array.from(document.querySelectorAll('[data-section-main]'));

    this.PAGE_SECTIONS = [ intro, ...sections];
    this.DISTANCE_MAP = this.setDistanceMap();

    window.document.body.setAttribute('data-no-scroll', 'true');
    this.introAnimation();

    this.setDeviceHeight();
    this.attachEventListeners();
    // this.preventScrollInPortrait(this.breakpoint.isPortrait);

  }

  private attachEventListeners() : void {

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
      if (!this.IS_USER_SCROLLING) {
        this.CURRENT_SECTION = this.getCurrentSectionIndex();
      }
      this.manageActiveButtons(forwardButton, backButton);
    });


    window.addEventListener('resize', debounce(() => {
      const { innerHeight: height, innerWidth: width } = window;
      this.windowSize = { height, width };
      this.setDeviceHeight();
      this.DISTANCE_MAP = this.setDistanceMap();
      // this.preventScrollInPortrait(this.breakpoint.isPortrait);
    }, 400));
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

  private setDistanceMap() : number[] {
    const distances = this.PAGE_SECTIONS.map(item => {
      return this.offsetTop(item);
    });

    return distances;
  }

  private setDeviceHeight() : void {
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
  }

  private listenUserScroll() : void {
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

  private handleLinkHover() : void {

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

  private handleUserScroll() : void {
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

  private manageActiveButtons(f: Element, b: Element) : void {

    if (this.CURRENT_SECTION <= 0) {
      b.setAttribute('disabled', 'true');
    } else {
      b.removeAttribute('disabled');
    }

    if ( this.CURRENT_SECTION >= this.PAGE_SECTIONS.length - 1) {
      f.setAttribute('disabled', 'true');
    } else {
      f.removeAttribute('disabled');
    }

  }

  private getCurrentSectionIndex() : number {
    this.SCROLL_POSITION = (window.pageYOffset || this.SCROLL_ELEMENT.scrollTop) - (this.SCROLL_ELEMENT.clientTop || 0) + this.SCROLL_OFFSET;

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

    let newSectionIndex = sectionScrolled > 20 ? this.CURRENT_SECTION : this.CURRENT_SECTION - 1;

    if (newSectionIndex < 0) {
      return;
    }

    this.scrollToSection(newSectionIndex);
  }

  private fastForward = (e: any, forward: Element, back: Element) : void => {
    const newSectionIndex = this.CURRENT_SECTION + 1;

    if (newSectionIndex > this.PAGE_SECTIONS.length) {
      return;
    }

    this.scrollToSection(newSectionIndex);
  }

  private scrollToSection(newIndex: number) : void {

    this.IS_USER_SCROLLING = true;
    const nextSection = this.PAGE_SECTIONS[newIndex];
    let scrollTop = newIndex === 0 ? 0 : window.pageYOffset + nextSection.getBoundingClientRect().top - this.SCROLL_OFFSET + 50;
    console.log(scrollTop);

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
        this.IS_USER_SCROLLING = false;

        if (resumeScroll) {
          this.pageScroll();
          this.PAGE_SCROLLING_PAUSED = false;
        }
      }
    });

    this.CURRENT_SECTION = newIndex;
  }

  private runScrolling() : void {
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

  private introAnimation() : void {

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
      this.runScrolling();
      window.document.body.removeAttribute('data-no-scroll');
    });
  }

  private scrollFadeIn() : void {
    anime({
      targets: '#main_content',
      opacity: 1,
      duration: this.DEBUG ? 0 : 1000,
    });
  }

  private pageScroll() {
    const currentScroll = this.SCROLL_ELEMENT.scrollTop;

    this.SCROLL_ANIMATION = anime({
      targets: this.SCROLL_ELEMENT,
      scrollTop: this.PAGE_HEIGHT + 500,
      duration: (this.PAGE_HEIGHT - currentScroll) / .007
    });
  }

  private managePlayBtnState(state: string) : void {

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

  private manageScrollState(state: string = 'pause') : void {
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

  private scrollControls() : void {
    if (!this.PAGE_SCROLLING_PAUSED) {
      this.manageScrollState('pause');
    } else {
      this.manageScrollState('play');
    }
  }

  private navigationAnimation() : void {
    anime({
      targets: '#nav',
      opacity: 1,
      duration: 2000,
    })
  }
}