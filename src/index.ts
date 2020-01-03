import { FetchData } from './fetch';
import { DomBuilder } from './dombuilder';
import { AutoScroll } from './autoscroll';
import './global.scss';

const endpoint = process.env.ENDPOINT || 'https://upcoming9.shopify.com/independents.json';
const MOUNT_POINT: HTMLElement = document.getElementById('app')!;

const fetchData = new FetchData(endpoint);
const domBuilder = new DomBuilder();
const autoScroll = new AutoScroll();

// console.log(FetchData);
fetchData.fetch()
  .then((data) => {
    domBuilder.init(data, MOUNT_POINT);
  })