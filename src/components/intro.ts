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
              <div class="${clsx(g.col_xs_12, g.col_md_12, g.col_lg_10, g.col_lg_offset_1)}">
                <div class="${clsx(s.intro_content)}">
                  <h2>Supporting independent businesses is at the heart of <span class="${clsx(s.tag)}"><span>everything</span></span> we do.</h2>
                  <div class="${s.intro_video_container}">
                    <div class="${s.intro_video_widget}">
                      <img src="https://cdn.shopify.com/static/images/brand-equity/hero-video-thumb@2x.jpg" alt="">
                      <button type="button" class="js-wistia-modal" data-wistia-id="b7g57f7mn4" data-video-btn><span class="${clsx(utils.hidden)}">Watch video</span>
                      </button>
                    </div>
                  </div>
                  <p id="intro-text">Every product on our billboards, shout out on the radio, and set piece in our videos is the result of someone pursuing independence. Our thanks to those who let us share their story.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `
)();