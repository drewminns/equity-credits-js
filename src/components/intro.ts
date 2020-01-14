import clsx from 'clsx';

import utils from '../styles/_utils.scss';
import g from '../styles/_grid.scss';
import s from '../styles/components/_intro.scss';

import shoppingBag from '../assets/shopping-bag.svg';

export const intro = (() =>
  `
      <section class="${s.intro}" id="intro">
        <div class="${clsx(s.intro_bg)}">
          <div class="${clsx(g.container_fluid, g.wrap)}">
            <div class="${clsx(g.row)}">
              <div class="${clsx(g.col_lg_12, g.col_xs_12)}">
                <h1 class="${clsx(s.intro_logo)}">
                  <a href="https://shopify.com" data-ga-event='Independents' data-ga-action='Hero link' ga-value='1'>
                    <span class="${s.logo}">${shoppingBag}</span>
                    <span class="${utils.hidden}">Supporting Independents</span>
                  </a>
                </h1>
              </div>
            </div>
            <div class="${clsx(g.row)}">
              <div class="${clsx(g.col_xs_12, g.col_md_10, g.col_md_offset_1, g.col_lg_8, g.col_lg_offset_2)}">
                <div class="${clsx(s.intro_content)}">
                  <h2>Supporting independent businesses is at the heart of <span class="${clsx(s.tag)}">everything</span> we do.</h2>
                  <p id="intro-text1">Every product on our billboards, shout out on the radio, and set piece in our commercial is the result of someone pursuing independence.</p>
                  <p id="intro-text2">Helping people turn their ideas into a business is what we do at Shopify. Our thanks to those who let us share their story.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `
)();