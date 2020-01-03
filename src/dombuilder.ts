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

  private buildSection(sections: Section[], title: string) {
    return sections.map((sec: Section, idx: Number) => {
      return `
        <div class="${g.row}">
        <section id="section-${sec.section_id}" class="${
          clsx( g.col_md_4,
            s.section_list,
            {
              [g.col_md_offset_4]: sec.layout === 'center',
              [g.col_md_offset_8]: sec.layout === 'right',
            }
          )
        }" data-layout="${sec.layout}">
          ${ idx === 0 ? `<h2 class="${s.title}">${title}</h2>` : '' }
            <ul class="${s.section_list_group}">
              ${sec.data.map((item: SectionData) => {

                if (item.hasOwnProperty('media')) {
                  const media = item.media.map((img, i) => `<img id="image-${item.shop_id}" class="${s.image}" src="${img.url}" alt="${img.alt}">`).join('');

                  return `
                  <li class="${clsx(s.item, s.item_has_image)}" data-layout="${sec.layout}">
                    <p class="${s.item_content}">
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
      const sections = this.buildSection(group.sections, group.title);
      return `<li id="${group.group_name}">${sections}</li>`
    }).join('');
  }
}