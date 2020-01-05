import clsx from 'clsx';

import { SectionData, Section, GroupData } from './shared/interface';
import utils from './styles/_utils.scss';
import g from './styles/_grid.scss';
import s from './styles/components/_item.scss';

import { nav } from './components/nav';
import { intro } from './components/intro';

import arrow from './assets/arrow.svg';

export class DomBuilder {
  sections!: GroupData[];
  MARKUP: string;
  NAV_MARKUP: string;
  MOUNT_POINT!: HTMLElement;

  constructor() {
    this.MARKUP = '';
    this.NAV_MARKUP = '';
  }

  init(sections: GroupData[], MOUNT_POINT: HTMLElement) {
    this.sections = sections;
    this.MOUNT_POINT = MOUNT_POINT;
    this._createMarkup();
  }

  private _createMarkup = () => {
    this.MARKUP += `
      ${nav}
      <div class="${g.container_fluid}">
        ${intro}
        <ul>
          ${this.buildGroup()}
        </ul>
      </div>
    `;
    this.MOUNT_POINT.insertAdjacentHTML('afterbegin', this.MARKUP);
  }

  private buildSection(group: GroupData) {

    const { sections, title, group_name: name } = group;

    return sections.map((sec: Section, idx: Number) => {
      return `
        <div class="${g.row}">
          <section id="section-${name}-${sec.section_id}" class="" data-layout="${sec.layout}">
          <ul class="${s.section_list_group} ${
            clsx(g.col_md_4,
              s.section_list,
              {
                [g.col_md_offset_4]: sec.layout === 'center',
                [g.col_md_offset_8]: sec.layout === 'right',
              }
            )
            }">
              <li>${ idx === 0 ? `<h2 class="${s.title}">${title}</h2>` : '' }</li>
              ${sec.data.map((item: SectionData) => {

                if (item.hasOwnProperty('media')) {
                  const alignClass=`pinned_container--${sec.layout}`;
                  const media = item.media.map((img, i) => `
                    <div class="${clsx(s.pinned_container, s[alignClass])}${ sec.layout !== 'center' ? ' pin-me' : '' }">
                      <img id="image-${item.shop_id}" class="${s.image}" src="${img.url}" alt="${img.alt}">
                    </div>`).join('');

                  return `
                  <li class="${clsx(s.item)}" data-layout="${sec.layout}">
                    <p class="${clsx(s.item_content, s.item_has_image)}">
                      <span class="${s.item_text}">
                        ${item.product_desc}
                      </span>
                      <span class="${s.merchant_link}">
                        <a href="${item.store_url}">${item.merchant} <span class="${s.arrow}">${arrow}</span></a>
                      </span>
                    </p>
                   ${ media }
                  </li>`;
                }

                return `
                  <li class="${s.item}">
                    <p class="${s.item_content}">
                      <span class="${s.item_text}">
                        ${item.product_desc}
                      </span>
                      <span class="${s.merchant_link}">
                        <a href="${item.store_url}">${item.merchant} <span class="${s.arrow}">${arrow}</span></a>
                      </span>
                    </p>
                  </li>
                `;
              }).join('')}
            </ul>
        </section>
      </div>
      `;
    }).join('');
  }

  private buildGroup = () => {
    return this.sections.map((group: GroupData) => {
      const sections = this.buildSection(group);
      return `<li id="${group.group_name}">${sections}</li>`
    }).join('');
  }
}