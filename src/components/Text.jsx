import React, { Component, PropTypes } from 'react';
import { DragSource } from 'react-dnd';
import { RichUtils, DefaultDraftBlockRenderMap } from 'draft-js';
import Editor, { createEditorStateWithText } from 'draft-js-plugins-editor';
import { stateToHTML } from 'draft-js-export-html';
import createToolbarPlugin, { ToolbarDecorator } from 'draft-js-toolbar-plugin';
import createBlockBreakoutPlugin from 'draft-js-block-breakout-plugin';
// import createFocusPlugin, { FocusDecorator } from 'draft-js-focus-plugin';
// import createDndPlugin, { DraggableDecorator } from 'draft-js-dnd-plugin';
// import createAlignmentPlugin, { AlignmentDecorator } from 'draft-js-alignment-plugin';
// import createResizeablePlugin, { ResizeableDecorator } from 'draft-js-resizeable-plugin';
// import createImagePlugin, { imageCreator, imageStyles } from 'draft-js-image-plugin';
// import 'draft-js-alignment-plugin/lib/plugin.css';
// import 'draft-js-focus-plugin/lib/plugin.css';
// import 'draft-js-image-plugin/lib/plugin.css';
import 'draft-js-toolbar-plugin/lib/plugin.css';
import Blocks from './Blocks';
import manifest from '../lib/manifest';
import { source, collect } from '../lib/genericDragSource';

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
  }]
});

// const dndPlugin = createDndPlugin({
//   allowDrop: true,
//   handleUpload(data, success, failed, progress) {
//     console.log(data);
//     alert('Thiis does not implement a backend.');
//   },
//   handleDefaultData(blockType) {
//     if (blockType === 'block-image') {
//       return {
//         url: '/whoa.jpg'
//       };
//     }
//     return {};
//   },
//   handlePlaceholder: (state, selection, data) => {
//     const { type } = data;
//     if (type.indexOf('image/') === 0) {
//       return 'block-image';
//     }
//     return undefined;
//   },
//   handleBlock: (state, selection, data) => {
//     const { type } = data;
//     if (type.indexOf('image/') === 0) {
//       return 'block-image';
//     }
//     return undefined;
//   },
//   handleDrop() {
//     console.log('wtf');
//   }
// });
//
// const image = ResizeableDecorator({
//   resizeSteps: 10,
//   handles: true,
//   vertical: 'auto'
// })(
//   DraggableDecorator(
//     FocusDecorator(
//       AlignmentDecorator(
//         ToolbarDecorator()(
//           imageCreator({ theme: imageStyles })
//         )
//       )
//     )
//   )
// );

const plugins = [
  toolbarPlugin,
  createBlockBreakoutPlugin({
    breakoutBlocks: Object.keys(Blocks)
  })
  // dndPlugin,
  // createFocusPlugin(),
  // createResizeablePlugin(),
  // createImagePlugin({ component: image }),
  // createAlignmentPlugin()
];

class Text extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: createEditorStateWithText('Custom text content...'),
    };
    const renderMap = {};
    Object.keys(Blocks).forEach((type) => {
      renderMap[type] = {
        element: 'div'
      };
    });
    this.blockRenderMap = DefaultDraftBlockRenderMap.merge(renderMap);
  }

  onChange = (editorState) => {
    this.setState({
      editorState
    });
  }

  focus = () => {
    if (this.props.disableDrag) {
      this.editor.focus();
    }
  }

  blockRendererFn = (contentBlock) => {
    const type = contentBlock.getType();
    return Blocks && Blocks[type] ? {
      component: Blocks[type]
    } : undefined;
  }

  export = () => stateToHTML(this.state.editorState.getCurrentContent())

  render() {
    const { type, disableDrag, isDragging, connectDragSource, connectDragPreview } = this.props;
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
          cursor: disableDrag ? 'text' : 'move',
          transition: 'all 0.2s ease-in-out'
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
          readOnly={!disableDrag}
          {...this.props}
        />
      </div>,
      { dropEffect: 'copy' }
    ), { captureDraggingState: true });
  }
}

Text.propTypes = {
  type: PropTypes.string.isRequired,
  disableDrag: PropTypes.bool,
  isDragging: PropTypes.bool.isRequired,
  connectDragSource: PropTypes.func.isRequired,
  connectDragPreview: PropTypes.func.isRequired
};

Text.defaultProps = {
  disableDrag: false
};

export default DragSource(manifest.TEXT, source, collect)(Text);
