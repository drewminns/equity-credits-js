import { FetchData } from './fetch';
import { DomBuilder } from './dombuilder';
import { AutoScroll } from './autoscroll';
import { ScrollIt } from './scrollit';
import './global.scss';

const endpoint = process.env.ENDPOINT || 'https://upcoming9.shopify.com/independents.json';
const MOUNT_POINT: HTMLElement = document.getElementById('app')!;

const fetchData = new FetchData(endpoint);
const domBuilder = new DomBuilder();
const autoScroll = new ScrollIt(10000, 'easeOutQuad');

// console.log(FetchData);
fetchData.fetch()
  .then((data) => {
    domBuilder.init(data, MOUNT_POINT);
  })
  // .then(() => {
  //   autoScroll.init();
  // })