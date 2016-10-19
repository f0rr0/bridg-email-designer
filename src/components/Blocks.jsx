import React, { createElement } from 'react';
import DraftEditorBlock from 'draft-js/lib/DraftEditorBlock.react';

const Header = size => props =>
    createElement(`h${size}`, { className: `header-${size}` }, <DraftEditorBlock {...props} />);

export default {
  'header-one': Header(1),
  'header-two': Header(2),
  'header-three': Header(3),
  blockquote: props =>
    createElement('blockquote', { className: 'blockquote' }, <DraftEditorBlock {...props} />)
};
