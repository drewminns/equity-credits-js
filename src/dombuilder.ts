import cx from 'classnames';

import { SectionData, Section, GroupData } from './shared/interface';
import utils from './styles/_utils.scss';
import g from './styles/_grid.scss';
import s from './styles/components/_item.scss';
import n from './styles/components/_nav.scss';
import i from './styles/components/_intro.scss';

import arrow from './assets/arrow.svg';
import shoppingBag from './assets/shopping-bag.svg';
import fastForward from './assets/fast-forward.svg';
import rewind from './assets/rewind.svg';
import pause from './assets/pause.svg';

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
        ${this.buildIntro()}
        <ul>
          ${this.buildGroup()}
        </ul>
      </div>
    `;
    this.MOUNT_POINT.insertAdjacentHTML('afterbegin', this.MARKUP);
  }

  private buildIntro() {
    return `
      <section class="${i.intro}">
        <div class="${cx(g.row, i.intro_row)}">
          <div class="${cx(g.col_md_8, g.col_md_offset_2)}">
            <p>Every product on our billboards, shout out on the radio, and set piece in our commercial is the result of someone pursuing independence.</p>
            <p>Helping people turn their ideas into a business is what we do at Shopify. Our thanks to those who let us share their story.</p>
          </div>
        </div>
      </section>
    `
  }

  private buildNav = () => {
    return `
      <nav class="${cx(n.nav)}">
        <div class="${g.container_fluid}">
          <div class="${cx(g.row, n.nav_row)}">
            <div class="${cx(g.col_md_3, n.logo)}">
              <h1>
                <span class="${n.logo}">${shoppingBag}</span>
                <span class="${utils.hidden}">Shopify</span>
              </h1>
            </div>
            <div class="${cx(g.col_md_6, n.nav_headline)}">
              <p>Supporting Independents</p>
            </div>
            <div class="${cx(g.col_md_3, n.nav_controls)}">
              <button aria-label="Back" id="back" class="${n.button}">
                <span class="${utils.hidden}">Back</span>
                <span class="${n.icon}">${rewind}</span>
              </button>
              <button aria-label="Play" id="play" class="${n.button}">
                <span class="${utils.hidden}">Pause</span>
                <span class="${n.icon}">${pause}</span>
              </button>
              <button aria-label="Forward" id="forward" class="${n.button}">
                <span class="${utils.hidden}">Shopify</span>
                <span class="${n.icon}">${fastForward}</span>
              </button>
            </div>
          </div>
        </div>
      </nav>
    `
  }

  private buildSection(group: GroupData) {

    const { sections, title, group_name: name } = group;

    return sections.map((sec: Section, idx: Number) => {
      return `
        <div class="${g.row}">
        <section id="section-${name}-${sec.section_id}" class="" data-layout="${sec.layout}">
            <ul class="${s.section_list_group} ${
              cx(g.col_md_4,
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
                    <div class="${cx(s.pinned_container, s[alignClass])}">
                      <img id="image-${item.shop_id}" class="${s.image}" src="${img.url}" alt="${img.alt}">
                    </div>`).join('');

                  return `
                  <li class="${cx(s.item)}" data-layout="${sec.layout}">
                    <p class="${cx(s.item_content, s.item_has_image)}">
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