import { FetchData } from './fetch';
import { DomBuilder } from './dombuilder';
import { AutoScroll } from './autoscroll';
import { MagicTime } from './scrollmagic';
import './global.scss';

const endpoint = process.env.ENDPOINT || 'https://upcoming9.shopify.com/independents.json';
const MOUNT_POINT: HTMLElement = document.getElementById('app')!;

const fetchData = new FetchData(endpoint);
const domBuilder = new DomBuilder();
const autoScroll = new AutoScroll();
const scrollMagic = new MagicTime();

// console.log(FetchData);
fetchData.fetch()
  .then((data) => {
    domBuilder.init(data, MOUNT_POINT);
  })
  .then(() => {
    const sections = Array.from(document.querySelectorAll('section[id]'));

    sections.forEach((section, index) => {
      scrollMagic.init(section);
    })
    console.log(sections);
    // sectionScene.init();
    autoScroll.init();
  })