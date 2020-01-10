import clsx from 'clsx';

import { SectionData, Section, GroupData } from './shared/interface';
import g from './styles/_grid.scss';
import s from './styles/components/_item.scss';

import { nav } from './components/nav';
import { intro } from './components/intro';
import { overlay } from './components/overlay';
import { logo } from './components/logo';

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
    <div class="${clsx(g.container_fluid, g.wrap)}">
      ${intro}
      <main id="main_content" class="${s.main_content}">
        <ul>
          ${this.buildGroup()}
        </ul>
      </main
    </div>
  `);
  }


  private buildSection(group: GroupData) {

    const { sections, title, group_name: name } = group;
    return sections.map((sec: Section, idx: Number) => {
      return `
        <div data-${sec.layout} class="${clsx(g.row, s.section_minor)}">
          <section id="section-${name}-${sec.section_id}" class="" data-layout="${sec.layout}">
          ${ idx === 0 ? `<h2 class="${s.title}">${title}</h2>` : '' }
          <div class="${s.section_wrapper}" data-section-wrap>
            <ul class="${s.section_list_group} ${
              clsx(g.col_md_6,
                s.section_list,
                {
                  [g.col_md_offset_3]: sec.layout === 'center',
                  [g.col_md_offset_6]: sec.layout === 'right',
                }
              )
            }">
              ${sec.merchants.map((item: SectionData) => {

                return this.buildListItem(item, sec.layout);

              }).join('')}
            </ul>
          </div>
        </section>
      </div>
      `;
    }).join('');
  }

  private buildListItem(item: SectionData, layout: string) {
    if (Object.entries(item.media).length !== 0) {
      const alignClass=`pinned_container--${layout}`;
      const media = `
        <div
          class="${clsx(s.pinned_container, s[alignClass])}${ layout !== 'center' ? ' pin-me' : '' }"
          data-tablet-large-width="${item.media.tablet_up.large.dimensions.width}"
          data-tablet-large-height="${item.media.tablet_up.large.dimensions.height}"
          data-tablet-small-height="${item.media.tablet_up.small.dimensions.height}"
          data-tablet-small-width="${item.media.tablet_up.small.dimensions.width}"
          data-mobile-large-width="${item.media.mobile.large.dimensions.width}"
          data-mobile-large-height="${item.media.mobile.large.dimensions.height}"
          data-mobile-small-height="${item.media.mobile.small.dimensions.height}"
          data-mobile-small-width="${item.media.mobile.small.dimensions.width}"
        >
          <figure>
            <picture>
              <source srcset="${item.media.tablet_up.large.url}" media="(min-width: 996px)">
              <source srcset="${item.media.tablet_up.small.url}" media="(min-width: 768px)">
              <source srcset="${item.media.mobile.large.url}" media="(min-width: 544px)">
              <img
                id="image-${item.shop_id}"
                class="${s.image}"
                src="${item.media.mobile.small.url}"
                alt="${item.media.alt_text}"
              >
            </picture>
            <figcaption class="${s[`caption--${ layout }`]}">This is an image caption</figcaption>
          </figure>
        </div>`;
      return `
      <li class="${clsx(s.item)}" data-layout="${layout}">
        <p class="${clsx(s.item_content, s.item_has_image)}">
          <span class="${s.merchant_products}">
            ${
              item.products.map((listItem) => {
                return `<span>${listItem}</span>`
              }).join('')
            }

          </span>
          <span class="${s.item_text}">
            <a target="_blank" class="product_link" rel="noopener noreferrer" href="${item.shop_url}">${item.shop_name} <span class="${s.arrow}">${arrow}</span></a>
          </span>
        </p>
        ${ media }
      </li>`;
    }

    return `
      <li class="${s.item}">
        <p class="${s.item_content}">
          <span class="${s.merchant_products}">
            ${
              item.products.map((listItem) => {
                return `<span>${listItem}</span>`
              }).join('')
            }
          </span>
          <span class="${s.item_text}">
            <a target="_blank" class="product_link" rel="noopener noreferrer" href="${item.shop_url}">${item.shop_name} <span class="${s.arrow}">${arrow}</span></a>
          </span>
        </p>
      </li>
    `;
  }

  private buildGroup = () => {
    return this.sections.map((group: GroupData) => {
      const sections = this.buildSection(group);
      return `<li data-section-main id="${group.group_name}" class="${s.top_section_item}">${sections}</li>`
    }).join('');
  }
}