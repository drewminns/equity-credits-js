import clsx from 'clsx';

import utils from '../styles/_utils.scss';
import g from '../styles/_grid.scss';
import s from '../styles/components/_nav.scss';

import shoppingBag from '../assets/shopping-bag.svg';
import fastForward from '../assets/fast-forward.svg';
import rewind from '../assets/rewind.svg';
import pause from '../assets/pause.svg';

export const nav = (() => `
      <nav class="${clsx(s.nav)}" id="nav">
        <div class="${g.container}">
          <div class="${clsx(g.row, s.nav_row)}">
            <div class="${clsx(g.col_md_3, s.logo)}">
              <h1>
                <a href="https://shopify.com">
                <span class="${s.logo}">${shoppingBag}</span>
                <span class="${utils.hidden}">Shopify</span>
                </a>
              </h1>
            </div>
            <div class="${clsx(g.col_md_6, s.nav_headline)}">
              <p>Supporting Independents</p>
            </div>
            <div class="${clsx(g.col_md_3, s.nav_controls)}">
              <button disabled aria-label="Back" id="back" class="${s.button}">
                <span class="${utils.hidden}">Back</span>
                <span class="${s.icon}">${rewind}</span>
              </button>
              <button aria-label="Play" id="play" class="${s.button}">
                <span class="${utils.hidden}">Pause</span>
                <span class="${s.icon}">${pause}</span>
              </button>
              <button aria-label="Forward" id="forward" class="${s.button}">
                <span class="${utils.hidden}">Shopify</span>
                <span class="${s.icon}">${fastForward}</span>
              </button>
            </div>
          </div>
        </div>
      </nav>
    `
)()