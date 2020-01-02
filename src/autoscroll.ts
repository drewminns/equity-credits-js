export class AutoScroll {
  DOC_HEIGHT!: number;
  WINDOW_HEIGHT!: number;
  CALC_HEIGHT!: number;
  SCROLL_TOP!: number;

  init =() => {
    console.log(this);
    this.DOC_HEIGHT = document.documentElement.scrollHeight;
    this.WINDOW_HEIGHT = window.innerHeight;
    this.CALC_HEIGHT = this.DOC_HEIGHT - this.WINDOW_HEIGHT;
    this.SCROLL_TOP = window.scrollY - document.documentElement.scrollTop;
  }
}