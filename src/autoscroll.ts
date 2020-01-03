export class AutoScroll {
  DOC_HEIGHT!: number;
  WINDOW_HEIGHT!: number;
  CALC_HEIGHT!: number;
  SCROLL_TOP!: number;
  isPlaying: boolean;
  scrollInterval!: NodeJS.Timer;
  timing: number;

  constructor(timing: number) {
    this.isPlaying = false;
    this.timing = timing
  }

  init =() => {
    this.DOC_HEIGHT = document.documentElement.scrollHeight;
    this.WINDOW_HEIGHT = window.innerHeight;
    this.CALC_HEIGHT = this.DOC_HEIGHT - this.WINDOW_HEIGHT;
    this.SCROLL_TOP = window.scrollY - document.documentElement.scrollTop;
    this.isPlaying = true;
    this.scrollInterval = setInterval(
      function () {
        window.requestAnimationFrame(function () {
          window.scrollBy(0, 1);
        });
      }, this.timing);
  }

}