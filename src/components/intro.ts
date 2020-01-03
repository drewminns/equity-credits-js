import clsx from 'clsx';

import g from '../styles/_grid.scss';
import s from '../styles/components/_intro.scss';

export const intro = (() =>
  `
      <section class="${s.intro}">
        <div class="${clsx(g.row, s.intro_row)}">
          <div class="${clsx(g.col_md_8, g.col_md_offset_2)}">
            <p>Every product on our billboards, shout out on the radio, and set piece in our commercial is the result of someone pursuing independence.</p>
            <p>Helping people turn their ideas into a business is what we do at Shopify. Our thanks to those who let us share their story.</p>
          </div>
        </div>
      </section>
    `
)();