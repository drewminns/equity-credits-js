import anime, { AnimeInstance, AnimeTimelineInstance } from 'animejs';

export class Animations {
  TIME_LINE: AnimeTimelineInstance;
  PAGE_HEIGHT: number;
  SCROLL_ELEMENT: Element;
  SCROLL_TOP: number;
  PAGE_SCROLLING_PAUSED: boolean;
  SCROLL_ANIMATION: AnimeInstance | null;
  SCROLL_POSITION: number;
  PAGE_SECTIONS: Array<Element>;
  CURRENT_SECTION: number;


  constructor() {
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
    this.CURRENT_SECTION = 0;
  }

  init = (SCROLL_TOP: number) : void => {
    this.SCROLL_TOP = SCROLL_TOP;
    this.PAGE_HEIGHT = document.body.scrollHeight;

    const intro = document.getElementById('intro')!;
    const sections = Array.from(document.querySelectorAll('[data-section-main]'));

    this.PAGE_SECTIONS = [ intro, ...sections];


    if (this.SCROLL_TOP === 0) {
      this.introAnimation();
    } else {
      this.runScrolling()
    }

    const button = document.getElementById('play')!;
    button.onclick = () => this.scrollControls();

    const backButton = document.getElementById('back')!;
    const forwardButton = document.getElementById('forward')!;
    backButton.onclick = () => this.rewind();
    forwardButton.onclick = () => this.fastForward();
  }

  private rewind = () => {
    console.log('back');
  }

  private fastForward = () => {
    console.log('forward');
    const newSectionIndex = this.CURRENT_SECTION + 1;
    const nextSection = this.PAGE_SECTIONS[newSectionIndex];
    const scrollTop = nextSection.getBoundingClientRect().top;
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

    this.CURRENT_SECTION = newSectionIndex;

    console.log(nextSection);

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
    this.SCROLL_ANIMATION = anime({
      targets: this.SCROLL_ELEMENT,
      scrollTop: this.PAGE_HEIGHT + 500,
      duration: this.PAGE_HEIGHT / .009
    });

  }

  private scrollControls = () => {
    if (!this.SCROLL_ANIMATION) return;

    if (!this.PAGE_SCROLLING_PAUSED) {
      this.SCROLL_ANIMATION.pause();
      this.PAGE_SCROLLING_PAUSED = true;
    } else {
      this.pageScroll();
      this.PAGE_SCROLLING_PAUSED = false;
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