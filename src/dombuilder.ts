import cx from 'classnames';

import { SectionData, Section, GroupData } from './shared/interface';
import s from './styles/components/_item.scss';
import g from './styles/_grid.scss';

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
      ${this.buildNav()}
      <div class="${g.container_fluid}">

          <ul>
            ${this.buildGroup()}
          </ul>
      </div>
    `;
    this.MOUNT_POINT.insertAdjacentHTML('afterbegin', this.MARKUP);
  }

  private buildNav = () => {
    return `
      <nav>
        <h1>Shopify</h1>
        <button>Play</button>
      </nav>
    `
  }

  private generateLayoutClass = (section: string) => {
    switch (section) {
      case 'center':
        return [g.col_md_4, g.offset_md_4];
      case 'left':
        return g.col_md_4;
      case 'right':
        return 'col-md-4 offset-md-8';
      default:
        return 'col-md-4 offset-md-4';
    }
  }

  private buildSection(sections: Section[], title: string) {
    return sections.map((sec: Section, idx: Number) => {
      console.log(sec.layout)
      return `
        <div class="${g.row}">
          <div class="${
            cx( g.col_md_4,
                s.section_list,
                {
                  [g.col_md_offset_4]: sec.layout === 'center',
                  [g.col_md_offset_8]: sec.layout === 'right',
                }
              )
          }">
            <h2 class="${s.title}">${idx === 0 ? title: ''}</h2>
            <ul class="${s.section_list_group}">
              ${sec.data.map((item: SectionData) => `
                <li>
                  <p class="${s.item_content}">
                    <span class="${s.item_text}">
                      ${item.product_desc}
                    </span>
                    <a class="${s.merchant_link}" href="${item.store_url}">${item.merchant}</a>
                    ${arrow}
                  </p>
                </li>
              `).join('')}
            </ul>
          </div>
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