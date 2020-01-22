import Independents from './index';

console.log('hello');
const endpoint = process.env.ENDPOINT || 'https://cors-anywhere.herokuapp.com/https://upcoming9.shopify.com/independents.json';
const MOUNT_POINT: HTMLElement = document.getElementById('App')!;

const independents = new Independents(endpoint, MOUNT_POINT);
independents.init();
