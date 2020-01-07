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
  MOUNT_POINT!: HTMLElement;

  constructor() {}

  init(sections: GroupData[], MOUNT_POINT: HTMLElement) {
    this.sections = sections;
    this.MOUNT_POINT = MOUNT_POINT;
    this._createMarkup();
  }

  private _createMarkup = () => {
    this.MOUNT_POINT.insertAdjacentHTML('afterbegin', `
    ${nav}
    <div class="${g.container}">
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
      console.log(sec)
      return `
        <div class="${clsx(g.row, s.section_minor)}">
          <section id="section-${name}-${sec.section_id}" class="" data-layout="${sec.layout}">
          ${ idx === 0 ? `<h2 class="${s.title}">${title}</h2>` : '' }
          <div class="${s.section_wrapper}" data-section-wrap>
            <ul class="${s.section_list_group} ${
              clsx(g.col_md_4,
                s.section_list,
                {
                  [g.col_md_offset_4]: sec.layout === 'center',
                  [g.col_md_offset_8]: sec.layout === 'right',
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
    if (item.hasOwnProperty('image')) {
      const alignClass=`pinned_container--${layout}`;
      const media = `
        <div class="${clsx(s.pinned_container, s[alignClass])}${ layout !== 'center' ? ' pin-me' : '' }">
          <img id="image-${item.shop_id}" class="${s.image}" src="${item.image.url}" alt="${item.image.alt}">
        </div>`;

      return `
      <li class="${clsx(s.item)}" data-layout="${layout}">
        <p class="${clsx(s.item_content, s.item_has_image)}">
          <span class="${s.item_text}">
            ${item.shop_name}
          </span>
          <span class="${s.merchant_link}">
            ${
              item.products.map((listItem) => {
                if (listItem.url !== '') {
                  return `
                    <a href="${listItem.url}">${listItem.name} <span class="${s.arrow}">${arrow}</span></a>
                  `
                }

                return `<span>${listItem.name}</span>`

              }).join('')
            }

          </span>
        </p>
        ${ media }
      </li>`;
    }

    return `
      <li class="${s.item}">
        <p class="${s.item_content}">
          <span class="${s.item_text}">
            ${item.shop_name}
          </span>
          <span class="${s.merchant_link}">
            ${
              item.products.map((listItem) => {
                if (listItem.url !== '') {
                  return `
                    <a href="${listItem.url}">${listItem.name} <span class="${s.arrow}">${arrow}</span></a>
                  `
                }
                return `<span>${listItem.name}</span>`
              }).join('')
            }
          </span>
        </p>
      </li>
    `;
  }

  private buildGroup = () => {
    return this.sections.map((group: GroupData) => {
      const sections = this.buildSection(group);
      return `<li id="${group.group_name}" class="${s.top_section_item}">${sections}</li>`
    }).join('');
  }
}