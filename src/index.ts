import 'core-js/stable';

import 'normalize.css';
import './global.scss';

import { FetchData } from './fetch';
import { DomBuilder } from './dombuilder';
import { MagicTime } from './scrollmagic';
import { Animations } from './animations';

const fetchData = new FetchData();
const domBuilder = new DomBuilder();
const scrollMagic = new MagicTime();
const animations = new Animations();

class Equity {
  private ENDPOINT = '';

  private MOUNT_POINT: HTMLElement;

  private BUILD_EVENT = new Event('domReallyReady');

  constructor(endpoint: string, mountpoint: HTMLElement) {
    this.ENDPOINT = endpoint;
    this.MOUNT_POINT = mountpoint;
  }

  init() {
    if (this.ENDPOINT === '') {
      throw new Error('Please provide an endpoint');
    }

    fetchData.fetch(this.ENDPOINT)
      .then((data) => {
        domBuilder.init(data, this.MOUNT_POINT);
      })
      .then(() => {
        const sections = Array.from(document.querySelectorAll('section[id^=section]'));
        scrollMagic.init(sections);
      })
      .then(() => {
        animations.init();
        window.dispatchEvent(this.BUILD_EVENT);
      });
  }
}

export default Equity;
