import 'core-js/stable';

import 'normalize.css';
import './global.scss';

import { FetchData } from './fetch';
import { DomBuilder } from './dombuilder';
import { MagicTime } from './scrollmagic';
import { Animations } from './animations';

const endpoint = process.env.ENDPOINT || 'https://upcoming9.shopify.com/independents.json';
const MOUNT_POINT: HTMLElement = document.getElementById('App')!;

const fetchData = new FetchData(endpoint);
const domBuilder = new DomBuilder();
const scrollMagic = new MagicTime();
const animations = new Animations(true);

// console.log(FetchData);
fetchData.fetch()
  .then((data) => {
    domBuilder.init(data, MOUNT_POINT);
  })
  .then(() => {
    const sections = Array.from(document.querySelectorAll('section[id^=section]'));
    scrollMagic.init(sections);
  })
  .then(() => {
    animations.init();
  })