import React, { createElement } from 'react';
import DraftEditorBlock from 'draft-js/lib/DraftEditorBlock.react';

const Header = size => props =>
    createElement(`h${size}`, { className: `header-${size}` }, <DraftEditorBlock {...props} />);

export default {
  'header-1': Header(1),
  'header-2': Header(2),
  'header-3': Header(3),
  blockquote: props =>
    createElement('blockquote', { className: 'blockquote' }, <DraftEditorBlock {...props} />)
};
