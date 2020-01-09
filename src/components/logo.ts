import clsx from 'clsx';

import g from '../styles/_grid.scss';
import s from '../styles/components/_logo.scss';

import shopify_logo from '../assets/shopify_logo.svg';

export const logo = (() => `
  <div class="${g.row}">
    <div class="${clsx(g.col_xs_12, g.col_md_6, g.col_md_offset_3)}">
      <div class="${clsx(s.logo)}">
        <div class="${clsx(s.logo_image)}">
          ${shopify_logo}
        </div>
        <p class="${clsx(s.logo_text)}">Copyright 2019, Shopify Inc. All rights reserved.</p>
      </div>
    </div>
  </div>
`)();