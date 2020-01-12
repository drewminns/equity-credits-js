import clsx from 'clsx';

import g from '../styles/_grid.scss';
import s from '../styles/components/_intro.scss';

export const intro = (() =>
  `
      <section class="${s.intro}" id="intro">
        <div class="${s.intro_bg_wrap}">
          <div class="${clsx(g.container_fluid, g.wrap)}">
            <div class="${s.intro_bg}"></div>
          </div>
        </div>
        <div class="${clsx(g.container_fluid, g.wrap)}">
          <div class="${s.intro_inner}">
            <div class="${clsx(g.row, s.intro_row)}">
              <div class="${clsx(g.col_lg_8, g.col_lg_offset_2, g.col_md_10, g.col_md_offset_1, g.col_xs_10, g.col_xs_offset_1)}">
                <p id="intro-text1">Every product on our billboards, shout out on the radio, and set piece in our commercial is the result of someone pursuing independence.</p>
                <p id="intro-text2">Helping people turn their ideas into a business is what we do at Shopify. Our thanks to those who let us share their story.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    `
)();