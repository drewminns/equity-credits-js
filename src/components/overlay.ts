import clsx from 'clsx';

import s from '../styles/components/_overlay.scss';

import rotate from '../assets/rotate.svg';

export const overlay = (() => `
  <div class="${s.overlay}">
    <div class="${s.overlay_wrapper}">
      <div class="${s.overlay_image}">${rotate}</div>
      <p class="${s.overlay_text}">
        <span class="${s.overlay_text_1}">Rotate</span>
        <span class="${s.overlay_text_2}">Your Device</span>
      </p>
    </div>
  </div>
`)();