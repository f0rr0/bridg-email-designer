import React, { createElement } from 'react';
import DraftEditorBlock from 'draft-js/lib/DraftEditorBlock.react';
import { RichUtils } from 'draft-js';

const Header = size => props =>
    createElement(`h${size}`, { className: `header-${size}` }, <DraftEditorBlock {...props} />);

const Align = dir => props =>
    createElement('div', { className: `text-${dir}` }, <DraftEditorBlock {...props} />);

export default {
  'header-one': Header(1),
  'header-two': Header(2),
  'header-three': Header(3),
  'left-align': Align('left'),
  'center-align': Align('center'),
  'right-align': Align('right'),
  blockquote: props =>
    createElement('blockquote', { className: 'blockquote' }, <DraftEditorBlock {...props} />)
};

export const textActions = [{
  button: <span>H1</span>,
  key: 'H1',
  label: 'Header 1',
  active: block => block.get('type') === 'header-one',
  toggle: (block, action, editorState, setEditorState) =>
    setEditorState(RichUtils.toggleBlockType(
      editorState,
      'header-one'
    ))
}, {
  button: <span>H2</span>,
  key: 'H2',
  label: 'Header 2',
  active: block => block.get('type') === 'header-two',
  toggle: (block, action, editorState, setEditorState) =>
    setEditorState(RichUtils.toggleBlockType(
      editorState,
      'header-two'
    ))
}, {
  button: <span>H3</span>,
  key: 'H3',
  label: 'Header 3',
  active: block => block.get('type') === 'header-three',
  toggle: (block, action, editorState, setEditorState) =>
    setEditorState(RichUtils.toggleBlockType(
      editorState,
      'header-three'
    ))
}, {
  button: <span>Quote</span>,
  key: 'BLOCKQUOTE',
  label: 'Blockquote',
  active: block => block.get('type') === 'blockquote',
  toggle: (block, action, editorState, setEditorState) =>
    setEditorState(RichUtils.toggleBlockType(
      editorState,
      'blockquote'
    ))
}, {
  button: <span>Left</span>,
  key: 'LEFT',
  label: 'Left Align',
  active: block => block.get('type') === 'left-align',
  toggle: (block, action, editorState, setEditorState) =>
    setEditorState(RichUtils.toggleBlockType(
      editorState,
      'left-align'
    ))
}, {
  button: <span>Center</span>,
  key: 'CENTER',
  label: 'Center Align',
  active: block => block.get('type') === 'center-align',
  toggle: (block, action, editorState, setEditorState) =>
    setEditorState(RichUtils.toggleBlockType(
      editorState,
      'center-align'
    ))
}, {
  button: <span>Right</span>,
  key: 'RIGHT',
  label: 'Right Align',
  active: block => block.get('type') === 'right-align',
  toggle: (block, action, editorState, setEditorState) =>
    setEditorState(RichUtils.toggleBlockType(
      editorState,
      'right-align'
    ))
}];
