import React, { Component, PropTypes } from 'react';
import { EditorState, RichUtils, DefaultDraftBlockRenderMap } from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import createToolbarPlugin from 'draft-js-toolbar-plugin';
import createFocusPlugin from 'draft-js-focus-plugin';
import 'draft-js-focus-plugin/lib/plugin.css';
import 'draft-js-toolbar-plugin/lib/plugin.css';
import blockTypes from './Blocks';

const toolbarPlugin = createToolbarPlugin({
  textActions: [{
    button: <span>H1</span>,
    key: 'H1',
    label: 'Header 1',
    active: block => block.get('type') === 'header-1',
    toggle: (block, action, editorState, setEditorState) =>
      setEditorState(RichUtils.toggleBlockType(
        editorState,
        'header-1'
      ))
  }, {
    button: <span>H2</span>,
    key: 'H2',
    label: 'Header 2',
    active: block => block.get('type') === 'header-2',
    toggle: (block, action, editorState, setEditorState) =>
      setEditorState(RichUtils.toggleBlockType(
        editorState,
        'header-2'
      ))
  }, {
    button: <span>H3</span>,
    key: 'H3',
    label: 'Header 3',
    active: block => block.get('type') === 'header-3',
    toggle: (block, action, editorState, setEditorState) =>
      setEditorState(RichUtils.toggleBlockType(
        editorState,
        'header-3'
      ))
  }]
});
const focusPlugin = createFocusPlugin();

const plugins = [
  toolbarPlugin,
  focusPlugin
];

export default class Text extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
    };

    const renderMap = {};
    Object.keys(blockTypes).forEach((type) => {
      renderMap[type] = {
        element: 'div'
      };
    });

    this.blockRenderMap = DefaultDraftBlockRenderMap.merge(renderMap);
    this.onChange = this.onChange.bind(this);
    this.focus = this.focus.bind(this);
    this.blockRendererFn = this.blockRendererFn.bind(this);
  }

  onChange(editorState) {
    this.setState({
      editorState
    });
  }

  focus() {
    if (!this.props.readOnly) {
      this.editor.focus();
    }
  }

  blockRendererFn(contentBlock) {
    const type = contentBlock.getType();
    return blockTypes && blockTypes[type] ? {
      component: blockTypes[type]
    } : undefined;
  }

  render() {
    const { readOnly } = this.props;
    return (
      <div
        style={{
          background: '#636363',
          marginBottom: 10,
          height: '100%',
          padding: '10px',
          cursor: readOnly ? 'move' : 'text'
        }}
        onClick={this.focus}
      >
        <Editor
          editorState={this.state.editorState}
          onChange={this.onChange}
          plugins={plugins}
          blockRenderMap={this.blockRenderMap}
          blockRendererFn={this.blockRendererFn}
          ref={(c) => { this.editor = c; }}
          {...this.props}
        />
      </div>
    );
  }
}

Text.propTypes = {
  readOnly: PropTypes.bool
};

Text.defaultProps = {
  readOnly: false
};
