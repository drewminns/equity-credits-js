import anime, { AnimeInstance, AnimeTimelineInstance } from 'animejs';
import { Window } from './window';

import pause from './assets/pause.svg';
import play from './assets/play.svg';

export class Animations extends Window {
  TIME_LINE: AnimeTimelineInstance;
  PAGE_HEIGHT: number;
  SCROLL_ELEMENT: Element;
  SCROLL_TOP: number;
  PAGE_SCROLLING_PAUSED: boolean;
  SCROLL_ANIMATION: AnimeInstance | null;
  SCROLL_POSITION: number;
  PAGE_SECTIONS: Array<Element>;
  CURRENT_SECTION: number;
  DISTANCE_MAP: Array<number>;
  SCROLL_OFFSET: number;
  HAS_VIEWED: boolean;

  constructor() {
    super();
    this.SCROLL_ANIMATION = null;
    this.SCROLL_TOP = 0;
    this.SCROLL_POSITION = 0;
    this.PAGE_HEIGHT = 0;
    this.PAGE_SCROLLING_PAUSED = false;
    this.SCROLL_ELEMENT = window.document.scrollingElement || window.document.body || window.document.documentElement;
    this.TIME_LINE = anime.timeline({
      easing: 'easeOutExpo',
      endDelay: 2000
    });
    this.PAGE_SECTIONS = [];
    this.DISTANCE_MAP = [];
    this.CURRENT_SECTION = 0;
    this.SCROLL_OFFSET = 120;
    this.HAS_VIEWED = false;
  }

  init = (SCROLL_TOP: number) : void => {
    this.SCROLL_TOP = SCROLL_TOP;
    this.PAGE_HEIGHT = document.body.scrollHeight;
    this.HAS_VIEWED = JSON.parse(window.localStorage.getItem('equity-viewed') as string);

    const intro = document.getElementById('intro')!;
    const sections = Array.from(document.querySelectorAll('[data-section-main]'));

    this.PAGE_SECTIONS = [ intro, ...sections];
    this.DISTANCE_MAP = this.PAGE_SECTIONS.map(item => {
      return item.getBoundingClientRect().top;
    });


    if (this.SCROLL_TOP === 0 && !this.HAS_VIEWED) {
      window.document.body.setAttribute('data-no-scroll', 'true');
      this.introAnimation();
    } else {
      this.runScrolling();
    }


    const button = document.getElementById('play')!;
    const buttonText = document.getElementById('play--text')!;
    const buttonIcon = document.getElementById('play--icon')!;
    // button.onclick = () =>
    button.addEventListener('click', () => {
      this.scrollControls(buttonText, buttonIcon);
    });

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

  }

  private listenUserScroll = () => {

    let isScrolling: any;

    window.addEventListener('wheel', (e) => {
      this.handleUserScroll(isScrolling);
    });

    window.addEventListener('touchmove', (e) => {
      this.handleUserScroll(isScrolling);
    });
  }

  private handleUserScroll = (isScrolling: any) => {
    let resumeScroll = false;

    // If the page is not paused, pause it and let default scroll take over
    if (!this.PAGE_SCROLLING_PAUSED) {
      this.SCROLL_ANIMATION?.pause();
      this.PAGE_SCROLLING_PAUSED = true;
      resumeScroll = true;
    }

    if (resumeScroll) {
      if (isScrolling) {
        window.clearTimeout(isScrolling);
      }

      isScrolling = setTimeout(() => {
        this.pageScroll();
        this.PAGE_SCROLLING_PAUSED = false;
      }, 100);
    }
  }

  private manageActiveButtons = (f: Element, b: Element) => {

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

  private getCurrentSectionIndex = () => {
    this.SCROLL_POSITION = (window.pageYOffset || this.SCROLL_ELEMENT.scrollTop) - (this.SCROLL_ELEMENT.clientTop || 0) + this.SCROLL_OFFSET;

    const index = this.DISTANCE_MAP.findIndex(item => {
      return this.SCROLL_POSITION < item;
    });

    return index === -1 ? this.PAGE_SECTIONS.length - 1 : (index === 0 ? 0 : index - 1);
  }

  private rewind = (e: any, forward: Element, back: Element) => {
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

  private fastForward = (e: any, forward: Element, back: Element) => {
    const newSectionIndex = this.CURRENT_SECTION + 1;

    if (newSectionIndex > this.PAGE_SECTIONS.length) {
      return;
    }

    this.scrollToSection(newSectionIndex);
  }

  private scrollToSection = (newIndex: number) => {
    const nextSection = this.PAGE_SECTIONS[newIndex];
    const scrollTop = window.pageYOffset + nextSection.getBoundingClientRect().top - this.SCROLL_OFFSET;
    let resumeScroll = false;

    if (!this.PAGE_SCROLLING_PAUSED) {
      this.SCROLL_ANIMATION?.pause();
      this.PAGE_SCROLLING_PAUSED = true;
      resumeScroll = true;
    }

    this.SCROLL_ANIMATION = anime({
      targets: this.SCROLL_ELEMENT,
      scrollTop: scrollTop,
      easing: 'linear',
      duration: 1000,
      complete: () => {
        if (resumeScroll) {
          this.pageScroll();
          this.PAGE_SCROLLING_PAUSED = false;
        }
      }
    });

    nextSection.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });

    this.CURRENT_SECTION = newIndex;
  }

  private runScrolling = () => {
    const intro = document.getElementById('intro')!;
    const introText1 = document.getElementById('intro-text1')!;
    const introText2 = document.getElementById('intro-text2')!;
    intro.style.opacity = '1';
    introText1.style.opacity = '1';
    introText2.style.opacity = '1';

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
        duration: 500
      })
      .add({
        targets: '#intro-text1',
        opacity: 1,
        duration: 1000
      })
      .add({
        targets: '#intro-text2',
        opacity: 1,
        duration: 1000
      })

    this.TIME_LINE.finished.then(() => {
      this.runScrolling();
      window.document.body.removeAttribute('data-no-scroll');
      window.localStorage.setItem('equity-viewed', 'true');
    });
  }

  private scrollFadeIn() {
    anime({
      targets: '#main_content',
      opacity: 1,
      duration: 1500,
    });
  }

  private pageScroll = () => {
    const currentScroll = this.SCROLL_ELEMENT.scrollTop;

    this.SCROLL_ANIMATION = anime({
      targets: this.SCROLL_ELEMENT,
      scrollTop: this.PAGE_HEIGHT + 500,
      duration: (this.PAGE_HEIGHT - currentScroll) / .009
    });
  }

  private scrollControls = (text: Element, icon: Element) => {
    if (!this.SCROLL_ANIMATION) return;

    if (!this.PAGE_SCROLLING_PAUSED) {
      this.SCROLL_ANIMATION.pause();
      this.PAGE_SCROLLING_PAUSED = true;
      text.innerHTML = 'Pause';
      icon.innerHTML = pause;
    } else {
      this.pageScroll();
      this.PAGE_SCROLLING_PAUSED = false;
      text.innerHTML = 'Play';
      icon.innerHTML = play;
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