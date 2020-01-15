import clsx from 'clsx';

import { SectionData, Section, GroupData } from './shared/interface';
import g from './styles/_grid.scss';
import s from './styles/components/_item.scss';

import { nav } from './components/nav';
import { intro } from './components/intro';
import { overlay } from './components/overlay';

import arrow from './assets/arrow.svg';

export class DomBuilder {
  sections!: GroupData[];

  MOUNT_POINT!: HTMLElement;

  constructor() {
  }

  init(sections: GroupData[], MOUNT_POINT: HTMLElement) {
    this.sections = sections;
    this.MOUNT_POINT = MOUNT_POINT;
    this._createMarkup();
  }

  private _createMarkup = () => {
    this.MOUNT_POINT.insertAdjacentHTML('afterbegin', `
    ${overlay}
    ${nav}
    ${intro}
    <div class="${clsx(g.container_fluid, g.wrap, s.site_wrapper)}">
      <main id="main_content" class="${s.main_content}">
        <h2 class="${clsx(s.title, s.credits_title)}">Credits</h2>
        <ul>
          ${this.buildGroup()}
        </ul>
      </main
    </div>
  `);
  }


  private buildSection(group: GroupData) {
    const { sections, title, groupname: name } = group;
    return sections.map((sec: Section, idx: number) => {
      let media = '';
      let sectionClass = 'section--no-media';
      const sectionHasMedia = sec.hasOwnProperty('media') && sec.media.hasOwnProperty('tablet_up') && sec.media.hasOwnProperty('mobile');

      if (sectionHasMedia) {
        media = this.createMediaItem(sec.media, sec.layout, sec.section_id);
        sectionClass = 'section--has-media';
      }


      return `
        <div data-${sec.layout} class="${clsx(g.row, s.section_minor, idx > 0 ? s.section_not_title : '')}">
          <section id="section-${sec.section_id}" class="${sectionClass}" data-layout="${sec.layout}">
          ${idx === 0 ? `<h2 class="${s.title}">${title}</h2>` : ''}
          <div class="${s.section_wrapper}" data-section-wrap>
            ${media}
            <ul class="${s.section_list_group} ${
  clsx(g.col_md_6,
    s.section_list,
    {
      [g.col_md_offset_3]: sec.layout === 'center',
      [g.col_md_offset_6]: sec.layout === 'right',
    })
}">
              ${sec.merchants.map((item: SectionData) => this.buildListItem(item, sec.layout, sectionHasMedia)).join('')}
            </ul>
          </div>
        </section>
      </div>
      `;
    }).join('');
  }

  private createMediaItem = (media: any, layout: string, id: number | string) => {
    const alignClass = `pinned_container--${layout}`;
    return `
        <div
          class="${clsx(s.pinned_container, s[alignClass])}${layout !== 'center' ? ' pin-me' : ''}"
          data-lg-width="${media.tablet_up.large.dimensions.width}"
          data-lg-height="${media.tablet_up.large.dimensions.height}"
          data-md-height="${media.tablet_up.small.dimensions.height}"
          data-md-width="${media.tablet_up.small.dimensions.width}"
          data-sm-width="${media.mobile.large.dimensions.width}"
          data-sm-height="${media.mobile.large.dimensions.height}"
          data-xs-height="${media.mobile.small.dimensions.height}"
          data-xs-width="${media.mobile.small.dimensions.width}"
        >
          <figure>
            <picture>
              <source srcset="${media.tablet_up.large.url}" media="(min-width: 996px)">
              <source srcset="${media.tablet_up.small.url}" media="(min-width: 768px)">
              <source srcset="${media.mobile.large.url}" media="(min-width: 544px)">
              <img
                id="image-${id}"
                class="${s.image}"
                src="${media.mobile.small.url}"
                alt="${media.alt_text}"
              >
            </picture>

          </figure>
        </div>`;
  }

  private buildListItem(item: SectionData, layout: string, sectionHasMedia: boolean) {
    if (!sectionHasMedia && item.hasOwnProperty('media') && Object.entries(item.media).length !== 0) {
      const media = this.createMediaItem(item.media, layout, item.shop_id);

      return `
      <li class="${clsx(s.item)}" data-layout="${layout}" data-media-section>
        <p class="${clsx(s.item_content, s.item_has_image)}">
          <span class="${s.merchant_products}">
            ${
  item.products.map((listItem) => `<span>${listItem}</span>`).join('')
}

          </span>
          <span class="${s.item_text}">
            <a
              target="_blank"
              class="product_link"
              rel="noopener noreferrer"
              data-ga-event='Independents'
              data-ga-action="${item.shop_url}"
              href="${item.shop_url}"
            >
              ${item.shop_name}
              <span class="${s.arrow}">${arrow}</span>
            </a>
          </span>
        </p>
        ${media}
      </li>`;
    }

    return `
      <li class="${s.item}">
        <p class="${s.item_content}">
          <span class="${s.merchant_products}">
            ${
  item.products.map((listItem) => `<span>${listItem}</span>`).join('')
}
          </span>
          <span class="${s.item_text}">
            <a
              target="_blank"
              class="product_link"
              rel="noopener noreferrer"
              data-ga-event='Independents'
              data-ga-action="${item.shop_url}"
              href="${item.shop_url}"
            >
              ${item.shop_name}
              <span class="${s.arrow}">${arrow}</span>
            </a>
          </span>
        </p>
      </li>
    `;
  }

  private buildGroup = () => this.sections.map((group: GroupData) => {
    const sections = this.buildSection(group);
    return `<li data-section-main id="${group.groupname}" class="${clsx(s.top_section_item, group.groupname === 'social' && s.top_section_item_social)}">${sections}</li>`;
  }).join('')
}
