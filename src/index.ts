import axios, {AxiosPromise} from 'axios';

const endpoint = process.env.ENDPOINT || 'https://upcoming9.shopify.com/independents.json';
const MOUNT_POINT: HTMLElement = document.getElementById('app')!;

const fetchData = async () => {
  try {
    const response  = await axios.get(endpoint, {
      auth: {
        username: 'Shopify',
        password: 'Independents',
      },
    });

    if (response.status !== 200) {
      console.error('Fetch Error');
      throw new Error();
    }

    buildDom(response.data);
  } catch (err) {
    console.log(err);
  }
}

interface SectionData {
  shop_id: number;
  merchant: string;
  store_url: string;
  product_desc: string;
  media: { type: string; url: string; alt: string }[]
}

interface Section {
  section_id: number;
  layout: string;
  data: SectionData[];
}

interface GroupData {
  title: string;
  group_name: string;
  sections: Section;
}

const buildSections = (section: Section) => {
  console.log(section);
  return section.data.map((sec: SectionData) => {
    return `<div>${sec.merchant}</div>`;
  })
}

const buildDom = (data: []) => {
  let MARKUP = '<ul>';
  MARKUP += data.map((group: GroupData) => {
    const sections = buildSections(group.sections);
    return `<li id="${group.group_name}">${group.title}${buildSections}</li>`;
  }).join('');
  MOUNT_POINT.insertAdjacentHTML('afterbegin', MARKUP);
}

fetchData();