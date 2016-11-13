import React, { Component, PropTypes } from 'react';
import styled from 'styled-components';
import { DragSource } from 'react-dnd';
import ClickOutside from 'react-click-outside';
import { EditorState, DefaultDraftBlockRenderMap, convertToRaw, convertFromRaw } from 'draft-js';
import Editor, { createEditorStateWithText } from 'draft-js-plugins-editor';
import { stateToHTML } from 'draft-js-export-html';
import createToolbarPlugin from 'draft-js-toolbar-plugin';
import createBlockBreakoutPlugin from 'draft-js-block-breakout-plugin';
import createEntityPropsPlugin from 'draft-js-entity-props-plugin';
import createCleanupEmptyPlugin from 'draft-js-cleanup-empty-plugin';
import createMentionPlugin, { defaultSuggestionsFilter } from 'draft-js-mention-plugin';
import 'draft-js-toolbar-plugin/lib/plugin.css';
import 'draft-js-mention-plugin/lib/plugin.css';
import TextColorIcon from 'material-ui/svg-icons/editor/format-color-text';
import BorderColorIcon from 'material-ui/svg-icons/editor/border-color';
import uniqueid from 'lodash.uniqueid';
import DropDown from './DropDown';
import PlusMinus from './PlusMinus';
import ColorPicker from './ColorPicker';
import Blocks, { textActions } from './Blocks';
import mentions from '../lib/mentions';
import manifest from '../lib/manifest';
import { source, collect } from '../lib/generic-drag-source';

const Entry = ({
  mention,
  theme,
  searchValue, // eslint-disable-line
  ...parentProps
}) =>
  <div {...parentProps} style={{ color: '#000' }}>
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
  createToolbarPlugin({
    textActions
  }),
  mentionPlugin,
  createBlockBreakoutPlugin({
    breakoutBlocks: Object.keys(Blocks)
  }),
  createEntityPropsPlugin(),
  createCleanupEmptyPlugin({
    types: Object.keys(Blocks)
  })
];

const Control = styled('div')`
  margin-bottom: 10px;
  &:last-child {
    margin-bottom: 0;
  }
`;

class Text extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: props.state ? EditorState.createWithContent(convertFromRaw(props.state.editorState)) : createEditorStateWithText('Formatted Text'),
      background: props.state ? props.state.background : 'rgba(255, 255, 255, 0)',
      textColor: props.state ? props.state.textColor : 'rgba(0, 0, 0, 1)',
      padding: props.state ? props.state.padding : 0,
      borderSize: props.state ? props.state.borderSize : 0,
      borderStyle: props.state ? props.state.borderStyle : 'solid',
      borderColor: props.state ? props.state.borderColor : 'rgba(0, 0, 0, 1)',
      suggestions: mentions,
      editing: false,
      highlight: false
    };
    const renderMap = {};
    Object.keys(Blocks).forEach((type) => {
      renderMap[type] = {
        element: 'div'
      };
    });
    this.blockRenderMap = DefaultDraftBlockRenderMap.merge(renderMap);
    this.uniqueid = uniqueid();
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.editorState.getUndoStack().size !== this.state.editorState.getUndoStack().size
     && this.props.inCanvas) {
      this.props.pushToUndoStack();
    }
  }

  componentWillUnmount() {
    this.props.setCustom(null);
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

  getCustom = () => {
    this.props.setCustom(
      <div style={{ padding: 20 }} key={this.uniqueid}>
        <Control>
          <ColorPicker
            label="Background Color"
            initialValue={this.state.background}
            onChange={this.customDispatch('background')}
          />
        </Control>
        <Control>
          <ColorPicker
            label="Text Color"
            icon={TextColorIcon}
            initialValue={this.state.textColor}
            onChange={this.customDispatch('textColor')}
          />
        </Control>
        <Control>
          <PlusMinus
            label="Padding"
            initialValue={this.state.padding}
            onChange={this.customDispatch('padding')}
          />
        </Control>
        <Control>
          <ColorPicker
            label="Border Color"
            icon={BorderColorIcon}
            initialValue={this.state.borderColor}
            onChange={this.customDispatch('borderColor')}
          />
        </Control>
        <Control>
          <PlusMinus
            label="Border"
            initialValue={this.state.borderSize}
            onChange={this.customDispatch('borderSize')}
          />
        </Control>
        <Control>
          <DropDown
            initialValue={this.state.borderStyle}
            label="Border Style"
            onChange={this.customDispatch('borderStyle')}
            items={[
              {
                value: 'solid',
                primaryText: 'Solid'
              },
              {
                value: 'dotted',
                primaryText: 'Dotted'
              },
              {
                value: 'dashed',
                primaryText: 'Dashed'
              },
              {
                value: 'double',
                primaryText: 'Double'
              }
            ]}
          />
        </Control>
      </div>
    );
  }

  customDispatch = type => (val) => {
    switch (type) {
      case 'padding':
        this.props.pushToUndoStack();
        this.setState({
          padding: val
        });
        break;
      case 'background':
        this.props.pushToUndoStack();
        this.setState({
          background: val
        });
        break;
      case 'textColor':
        this.props.pushToUndoStack();
        this.setState({
          textColor: val
        });
        break;
      case 'borderColor':
        this.props.pushToUndoStack();
        this.setState({
          borderColor: val
        });
        break;
      case 'borderSize':
        this.props.pushToUndoStack();
        this.setState({
          borderSize: val
        });
        break;
      case 'borderStyle':
        this.props.pushToUndoStack();
        this.setState({
          borderStyle: val
        });
        break;
      default:
    }
  }

  handleClick = (e) => {
    e.stopPropagation();
    if (this.props.inCanvas) {
      this.setState({
        editing: true
      }, () => {
        this.editor.focus();
        this.getCustom();
      });
    }
  }

  handleClickOutside = (e) => {
    if (![...document.querySelectorAll('.customization')].some(node => node.contains(e.target))) {
      this.props.setCustom(null);
      const editorState = EditorState.moveFocusToEnd(this.state.editorState);
      this.setState({
        editorState,
        editing: false,
        highlight: false
      });
    }
  }

  toggleHighlight = () => {
    this.setState({
      highlight: !this.state.highlight
    });
  }

  blockRendererFn = (contentBlock) => {
    const type = contentBlock.getType();
    return Blocks && Blocks[type] ? {
      component: Blocks[type]
    } : undefined;
  }

  export = () => {
    const {
      background,
      borderSize,
      borderColor,
      borderStyle,
      textColor,
      padding
    } = this.state;
    const options = {
      blockStyleFn: (block) => {
        switch (block.getType()) {
          case 'left-align':
            return {
              attributes: {
                class: 'text-left'
              }
            };
          case 'right-align':
            return {
              attributes: {
                class: 'text-right'
              }
            };
          case 'center-align':
            return {
              attributes: {
                class: 'text-center'
              }
            };
          default: return {};
        }
      }
    };

    return `<div style="box-sizing: border-box; color: ${textColor}; background-color: ${background}; padding: ${padding}px; border: ${borderSize}px ${borderStyle} ${borderColor}; width: 100%; height: 100%;">${stateToHTML(this.state.editorState.getCurrentContent(), options)}</div>`;
  }

  serialize = () => ({
    background: this.state.background,
    textColor: this.state.textColor,
    padding: this.state.padding,
    borderColor: this.state.borderColor,
    borderSize: this.state.borderSize,
    borderStyle: this.state.borderStyle,
    editorState: convertToRaw(this.state.editorState.getCurrentContent())
  });

  render() {
    const {
      type,
      inCanvas,
      isDragging,
      connectDragSource,
      connectDragPreview
    } = this.props;

    const {
      editing,
      padding,
      background,
      textColor,
      borderSize,
      borderStyle,
      borderColor,
      highlight
    } = this.state;

    const content = (() => {
      if (inCanvas) {
        if (editing) {
          return (
            <ClickOutside
              style={{
                width: '100%',
                background,
                padding,
                color: textColor,
                position: highlight ? 'relative' : 'static',
                zIndex: highlight ? 1499 : 0,
                outline: '2px solid blue',
                border: `${borderSize}px ${borderStyle} ${borderColor}`,
              }}
              onClickOutside={this.handleClickOutside}
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
              <MentionSuggestions
                onSearchChange={this.onSearchChange}
                suggestions={this.state.suggestions}
                entryComponent={Entry}
              />
            </ClickOutside>
          );
        }
        return (
          <div
            style={{
              width: '100%',
              position: highlight ? 'relative' : 'static',
              zIndex: highlight ? 1499 : 0,
              outline: highlight ? '2px solid blue' : 'none',
            }}
            onMouseEnter={this.toggleHighlight}
            onMouseLeave={this.toggleHighlight}
            dangerouslySetInnerHTML={{ __html: this.export() }} // eslint-disable-line
          />
        );
      }
      return (
        <div
          style={{
            height: '100%',
            width: '100%',
            color: '#000000',
            background: '#FFFFFF',
            padding: 10
          }}
        >
          Formatted Text
        </div>
      );
    })();

    return connectDragPreview(connectDragSource(
      <div
        id={type}
        style={{
          opacity: isDragging ? 0.6 : 1,
          height: '100%',
          lineHeight: 1.3,
          cursor: inCanvas ? 'text' : 'move',
          transition: 'all 0.2s ease-in-out'
        }}
        onClick={this.handleClick}
      >
        {content}
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
  setCustom: PropTypes.func,
  pushToUndoStack: PropTypes.func,
  connectDragSource: PropTypes.func.isRequired,
  connectDragPreview: PropTypes.func.isRequired
};

Text.defaultProps = {
  inCanvas: false
};

export default DragSource(manifest.TEXT, source, collect)(Text);
