import React, { Component, PropTypes } from 'react';
import { DragSource } from 'react-dnd';
import { EditorState, DefaultDraftBlockRenderMap, convertToRaw, convertFromRaw } from 'draft-js';
import Editor, { createEditorStateWithText } from 'draft-js-plugins-editor';
import { stateToHTML } from 'draft-js-export-html';
import createInlineToolbar, {
  BoldButton,
  ItalicButton,
  UnderlineButton,
  BlockquoteButton,
  Separator
} from 'react-draft-js-inline-toolbar-plugin';
import createBlockBreakoutPlugin from 'draft-js-block-breakout-plugin';
import createEntityPropsPlugin from 'draft-js-entity-props-plugin';
import createCleanupEmptyPlugin from 'draft-js-cleanup-empty-plugin';
import createMentionPlugin, { defaultSuggestionsFilter } from 'draft-js-mention-plugin';
import 'react-draft-js-inline-toolbar-plugin/lib/plugin.css';
import 'draft-js-mention-plugin/lib/plugin.css';
import Blocks, { AlignLeft, AlignCenter, AlignRight } from './Blocks';
import mentions from '../lib/mentions';
import manifest from '../lib/manifest';
import { source, collect } from '../lib/generic-drag-source';

const toolbarPlugin = createInlineToolbar({
  structure: [
    BoldButton,
    ItalicButton,
    UnderlineButton,
    Separator,
    BlockquoteButton,
    AlignLeft,
    AlignCenter,
    AlignRight
  ]
});
const { InlineToolbar } = toolbarPlugin;


const Entry = ({
  mention,
  theme,
  searchValue, // eslint-disable-line
  ...parentProps
}) =>
  <div {...parentProps}>
    <div className={theme.mentionSuggestionsEntryContainer}>
      <div className={theme.mentionSuggestionsEntryContainerLeft}>
        <div className={theme.mentionSuggestionsEntryText}>
          {mention.get('title')}
        </div>
      </div>
    </div>
  </div>;

Entry.propTypes = {
  mention: PropTypes.object,
  theme: PropTypes.object
};

const mentionPlugin = createMentionPlugin();
const { MentionSuggestions } = mentionPlugin;

const plugins = [
  toolbarPlugin,
  mentionPlugin,
  createBlockBreakoutPlugin({
    breakoutBlocks: Object.keys(Blocks)
  }),
  createEntityPropsPlugin(),
  createCleanupEmptyPlugin({
    types: Object.keys(Blocks)
  })
];

class Text extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: props.state ? EditorState.createWithContent(convertFromRaw(props.state)) : createEditorStateWithText('Formatted Text'),
      suggestions: mentions
    };
    const renderMap = {};
    Object.keys(Blocks).forEach((type) => {
      renderMap[type] = {
        element: 'div'
      };
    });
    this.blockRenderMap = DefaultDraftBlockRenderMap.merge(renderMap);
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.editorState.getUndoStack().size !== this.state.editorState.getUndoStack().size
     && this.props.inCanvas) {
      this.props.pushToUndoStack();
    }
  }

  onChange = (editorState) => {
    this.setState({
      editorState
    });
  }

  onSearchChange = ({ value }) => {
    this.setState({
      suggestions: defaultSuggestionsFilter(value, mentions),
    });
  };

  clickHandler = () => {
    if (this.props.inCanvas) {
      const hasFocus = this.state.editorState.getSelection().getHasFocus();
      if (hasFocus) {
        this.editor.focus();
      } else {
        const editorState = EditorState.moveFocusToEnd(this.state.editorState);
        this.setState({
          editorState
        }, () => {
          this.editor.blur();
        });
      }
    }
  }

  blockRendererFn = (contentBlock) => {
    const type = contentBlock.getType();
    return Blocks && Blocks[type] ? {
      component: Blocks[type]
    } : undefined;
  }

  export = () => {
    const options = {
      blockStyleFn: (block) => {
        switch (block.getType()) {
          case 'align-left':
            return {
              attributes: {
                class: 'text-left'
              }
            };
          case 'align-right':
            return {
              attributes: {
                class: 'text-right'
              }
            };
          case 'align-center':
            return {
              attributes: {
                class: 'text-center'
              }
            };
          default: return {};
        }
      }
    };
    return stateToHTML(this.state.editorState.getCurrentContent(), options);
  }

  serialize = () => convertToRaw(this.state.editorState.getCurrentContent());

  render() {
    const { type, inCanvas, isDragging, connectDragSource, connectDragPreview } = this.props;
    return connectDragPreview(connectDragSource(
      <div
        id={type}
        style={{
          background: '#FFFFFF',
          opacity: isDragging ? 0.6 : 1,
          height: '100%',
          padding: '10px',
          color: '#000000',
          lineHeight: 1.125,
          cursor: inCanvas ? 'text' : 'move',
          transition: 'all 0.2s ease-in-out',
          flex: '1 0 auto'
        }}
        onClick={this.clickHandler}
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
        {
          inCanvas ?
            <MentionSuggestions
              onSearchChange={this.onSearchChange}
              suggestions={this.state.suggestions}
              entryComponent={Entry}
            />
          : null
        }
        {
          inCanvas ?
            <InlineToolbar />
          : null
        }
      </div>,
      { dropEffect: 'copy' }
    ), { captureDraggingState: true });
  }
}

Text.propTypes = {
  type: PropTypes.string.isRequired,
  state: PropTypes.object,
  inCanvas: PropTypes.bool,
  isDragging: PropTypes.bool.isRequired,
  pushToUndoStack: PropTypes.func,
  connectDragSource: PropTypes.func.isRequired,
  connectDragPreview: PropTypes.func.isRequired
};

Text.defaultProps = {
  inCanvas: false
};

export default DragSource(manifest.TEXT, source, collect)(Text);
