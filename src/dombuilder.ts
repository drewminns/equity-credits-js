import clsx from 'clsx';

import { SectionData, Section, GroupData } from './shared/interface';
import g from './styles/_grid.scss';
import s from './styles/components/_item.scss';

import { nav } from './components/nav';
import { intro } from './components/intro';

import arrow from './assets/arrow.svg';

/**
 *
 * Constructs the DOM based on data returned from the endpoint
 *
 */
export class DomBuilder {
  sections!: GroupData[];

  MOUNT_POINT!: HTMLElement;

  /**
   * Initializes the DomBuilder class
   *
   * @param sections - The data which to build the DOM.
   * @param MOUNT_POINT - The element to render the HTML to
   * @returns void
   */
  init(sections: GroupData[], MOUNT_POINT: HTMLElement): void {
    this.sections = sections;
    this.MOUNT_POINT = MOUNT_POINT;
    this.createMarkup();
  }

  /**
   * Creates the base markup and inserts in the DOM at the MOUNT_POINT
   *
   * @returns void
   */
  private createMarkup = (): void => {
    this.MOUNT_POINT.insertAdjacentHTML('afterbegin', `
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

  private buildAudioSection(audioSections: any): string {
    const audio = audioSections.sections.map((
      sec: {
        layout: string;
        section_id: string;
        label: string;
        merchants: any;
      }, idx: number,
    ) => {
      const html = `
        <div data-${sec.layout} class="${clsx(g.row, s.section_minor, s.section_audio, idx > 0 ? s.section_not_title : '')}">
          <article id="article-${sec.section_id}" data-layout="${sec.layout}">
            ${idx === 0 ? `<h2 class="${s.title}">${audioSections.title}</h2>` : ''}
            <ul class="${s.section_list_group} ${clsx(g.col_md_6, g.col_md_offset_3, s.section_list)}">
              ${sec.merchants.map((item: SectionData, index: number) => this.buildAudioListItem(item, sec.layout, index, sec.label)).join('')}
            </ul>
          </article>
        </div>
      `;
      return html;
    }).join('');
    return `
      <section id="section--audio" class="${s.audio_section}">
        <div data-section-highlight class="${s.section_audio_highlight}"></div>
        ${audio}
      </section>
    `;
  }

  /**
  * Builds an individual section
  *
  * @param  {GroupData} group
  * @returns string
  */
  private buildSection(group: GroupData): string {
    const { sections, title, groupname } = group;

    return sections.map((sec: Section, idx: number) => {
      let media = '';
      let sectionClass = 'section--no-media';
      // eslint-disable-next-line no-prototype-builtins
      const sectionHasMedia = sec.hasOwnProperty('media') && sec.media.hasOwnProperty('tablet_up') && sec.media.hasOwnProperty('mobile');
      let cluster = false;

      if (sectionHasMedia) {
        media = this.createMediaItem(sec.media, sec.layout, sec.section_id);
        sectionClass = 'section--has-media';
      } else {
        // check if section has a cluster
        const numMedia = sec.merchants.reduce((total, merchant) => {
          return merchant.media && Object.keys(merchant.media).length ? total + 1 : total;
        }, 0);

        if (numMedia > 1) {
          cluster = true;
        }
      }

      return `
        <div data-${sec.layout} class="${clsx(g.row, s.section_minor, idx > 0 ? s.section_not_title : '', groupname === 'audio' ? s.section_audio : '')}">
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
              ${sec.merchants.map((item: SectionData) => this.buildListItem(item, sec.layout, sectionHasMedia, cluster)).join('')}
            </ul>
          </div>
        </section>
      </div>
      `;
    }).join('');
  }

  /**
   * Generates an image item
   *
   * @param  {any} media
   * @param  {string} layout
   * @param  {number|string} id
   * @param  {boolean} cluster=false
   * @returns string
   */
  private createMediaItem = (
    media: any,
    layout: string,
    id: number | string,
    cluster = false,
  ): string => {
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
          data-media-container
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
                ${cluster ? 'data-cluster' : 'data-single'}
              >
            </picture>

          </figure>
        </div>`;
  }

/* eslint-disable */
  private buildAudioListItem(
    item: SectionData,
    layout: string,
    index: number,
    label: string,
  ): string {
    return `
      <li class="${s.item}">
        <p class="${s.item_content}">
          ${
  index === 0 && label ? `
              <span class="${s.merchant_products}">
                ${label}
              </span>
            ` : `
              <span class="${s.merchant_products}"></span>
            `
}

          <span class="${s.item_text}">
            <a
              data-audio-link
              target="_blank"
              class="${s.audio_link}"
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
  /* eslint-enable */


  /**
   * Builds an individual list image
   *
   * @param  {SectionData} item
   * @param  {string} layout
   * @param  {boolean} sectionHasMedia
   * @param  {} sectionHasCluster=false
   * @returns string
   */

  private buildListItem(
    item: SectionData,
    layout: string,
    sectionHasMedia: boolean,
    sectionHasCluster = false,
  ): string {

    if (!sectionHasMedia && Object.prototype.hasOwnProperty.call(item, 'media') && Object.entries(item.media).length !== 0) {
      const media = this.createMediaItem(item.media, layout, item.shop_id, sectionHasCluster);

      return `
      <li class="${clsx(s.item)}" data-layout="${layout}" data-media-section ${sectionHasCluster ? 'data-cluster' : ''}>
        <p class="${clsx(s.item_content, s.item_has_image)}">
        ${
  item.products.length > 0
    ? `
  <span class="${s.merchant_products}">
    ${
  item.products.map((listItem) => {
    return `<span><span>${listItem}</span></span>`;
  }).join('')
}
  </span>
  ` : ''
}
          <span class="${s.item_text}">
            <a
              target="_blank"
              class="product_link ${clsx(s.product_link_media_item)}"
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
            ${item.products.map((listItem) => `<span>${listItem}</span>`).join('')}
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

  /**
   * Constructs a top level list item
   *
   * @param  {GroupData} =>this.sections.map((group
   * @returns string
   */
  private buildGroup = () => this.sections.map((group: GroupData) => {

    let sections;

    if (group.groupname === 'audio') {
      sections = this.buildAudioSection(group);
    } else {
      sections = this.buildSection(group);
    }

    return `<li data-section-main id="${group.groupname}" class="${clsx(s.top_section_item, group.groupname === 'social' && s.top_section_item_social)}">${sections}</li>`;
  }).join('')
}
