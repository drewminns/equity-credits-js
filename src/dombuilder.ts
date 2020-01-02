import { SectionData, Section, GroupData } from './shared/interface';
import s from './styles/components/_item.scss';

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
      <ul>
        ${this.buildGroup()}
      </ul>
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

  private buildSection(sections: Section[], title: string) {
    return sections.map((sec: Section, idx: Number) => {
      return `
        <div class="${sec.layout}">
          <p>${idx === 0 ? title: ''}</p>
          <ul>
            ${sec.data.map((item: SectionData) => `
              <li>
                <a class="${s.item}" href="${item.store_url}">${item.merchant}</a>
              </li>
            `)}
          </ul>
        </div>
      `;
    })
  }

  private buildGroup = () => {
    return this.sections.map((group: GroupData) => {
      const sections = this.buildSection(group.sections, group.title);
      return `<li id="${group.group_name}">${sections}</li>`
    }).join('');

  }
}