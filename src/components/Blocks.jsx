import React, { createElement } from 'react';
import DraftEditorBlock from 'draft-js/lib/DraftEditorBlock.react';
import createBlockStyleButton from 'react-draft-js-inline-toolbar-plugin/lib/utils/createBlockStyleButton';
import styles from '!style-loader!css-loader?modules!../css/react-draft-js-inline-toolbar-plugin.css'; //eslint-disable-line

// const Header = size => props =>
//     createElement(`h${size}`, { className: `header-${size}` }, <DraftEditorBlock {...props} />);

const AlignLeft = createBlockStyleButton({
  blockType: 'align-left',
  theme: styles,
  children: (
    <svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 15H3v2h12v-2zm0-8H3v2h12V7zM3 13h18v-2H3v2zm0 8h18v-2H3v2zM3 3v2h18V3H3z" />
      <path d="M0 0h24v24H0z" fill="none" />
    </svg>
  )
});

const AlignCenter = createBlockStyleButton({
  blockType: 'align-center',
  theme: styles,
  children: (
    <svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 15v2h10v-2H7zm-4 6h18v-2H3v2zm0-8h18v-2H3v2zm4-6v2h10V7H7zM3 3v2h18V3H3z" />
      <path d="M0 0h24v24H0z" fill="none" />
    </svg>
  )
});

const AlignRight = createBlockStyleButton({
  blockType: 'align-right',
  theme: styles,
  children: (
    <svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 21h18v-2H3v2zm6-4h12v-2H9v2zm-6-4h18v-2H3v2zm6-4h12V7H9v2zM3 3v2h18V3H3z" />
      <path d="M0 0h24v24H0z" fill="none" />
    </svg>
  )
});

const Align = dir => props =>
  createElement('div', { className: `text-${dir}` }, <DraftEditorBlock {...props} />);

export default {
  // 'header-one': Header(1),
  // 'header-two': Header(2),
  // 'header-three': Header(3),
  'align-left': Align('left'),
  'align-right': Align('right'),
  'align-center': Align('center')
};

export { AlignLeft, AlignCenter, AlignRight };
