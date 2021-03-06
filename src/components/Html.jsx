import React, { Component, PropTypes } from 'react';
import { injectGlobal } from 'styled-components';
import { DragSource } from 'react-dnd';
import equal from 'deep-equal';
import Codemirror from 'react-codemirror';
import ClickOutside from 'react-click-outside';
import { Pass, innerMode } from 'codemirror';
import 'codemirror/mode/xml/xml';
import 'codemirror/mode/htmlmixed/htmlmixed.js';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/addon/scroll/simplescrollbars.js';
import 'codemirror/addon/scroll/simplescrollbars.css';
import 'codemirror/addon/edit/closetag.js';
import 'codemirror/addon/edit/matchtags.js';
import 'codemirror/addon/hint/show-hint.js';
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/hint/html-hint.js';
import 'codemirror/addon/edit/trailingspace.js';

import manifest from '../lib/manifest';
import { source, collect } from '../lib/generic-drag-source';

/* These styles might be overridden by global styles elsewhere.
** Use with caution.
*/

/*eslint-disable */
injectGlobal`
  .CodeMirror {
    font-size: 14px;
  }

  .CodeMirror, .ReactCodeMirror {
    box-sizing: border-box !important;
    max-height: 20em !important;
    height: 100% !important;
  }

  .CodeMirror-scroll {
    font-family: 'Menlo', 'Monaco', monospace;
    max-height: 20em !important;
  }

  .CodeMirror-hints {
    font-family: 'Menlo', 'Monaco', monospace !important;
    font-size: 12px !important;
  }

  .CodeMirror-matchingtag {
    background: rgba(255, 255, 255, 0.20) !important;
  }

  .CodeMirror-scrollbar-filler {
    background: transparent !important;
  }

  .cm-trailingspace {
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAACCAYAAAB/qH1jAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3QUXCToH00Y1UgAAACFJREFUCNdjPMDBUc/AwNDAAAFMTAwMDA0OP34wQgX/AQBYgwYEx4f9lQAAAABJRU5ErkJggg==);
    background-position: bottom left;
    background-repeat: repeat-x;
  }
`;
/*eslint-enable */

const completeAfter = (cm, pred) => {
  if (!pred || pred()) {
    setTimeout(() => {
      if (!cm.state.completionActive) {
        cm.showHint({
          completeSingle: false
        });
      }
    }, 100);
  }
  return Pass;
};

const completeIfInTag = cm => completeAfter(cm, () => {
  const tok = cm.getTokenAt(cm.getCursor());
  if (tok.type === 'string' && (!/['"]/.test(tok.string.charAt(tok.string.length - 1)) || tok.string.length === 1)) {
    return false;
  }
  const inner = innerMode(cm.getMode(), tok.state).state;
  return inner.tagName;
});

const options = {
  mode: 'text/html',
  scrollbarStyle: 'overlay',
  autoCloseTags: true,
  extraKeys: {
    "'<'": completeAfter,
    "' '": completeIfInTag,
    "'='": completeIfInTag
  },
  matchTags: {
    bothTags: true
  },
  showTrailingSpace: true,
  theme: 'material'
};

const defaultMarkup =
`<h1>
  HTML Markup
</h1>`;

class Html extends Component {
  constructor(props) {
    super(props);
    this.state = props.state || {
      markup: defaultMarkup
    };
    this.state.editing = false;
    this.state.highlight = false;
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !equal(this.props, nextProps) || !equal(nextState, this.state);
  }

  // componentWillUpdate(prevProps, prevState) {
  //   if (this.props.inCanvas && this.editor) {
  //     console.log(this.editor.getCodeMirror().doc.getHistory().done.filter(obj => obj.hasOwnProperty('changes')));
  //     console.log(.editor.getCodeMirror().doc.getHistory().done.filter(obj => obj.hasOwnProperty('changes')));
  //   }
  // }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.editing && this.state.editing) {
      this.editor.getCodeMirror().focus();
    }
  }

  handleChange = (newMarkup) => {
    this.setState({
      markup: newMarkup
    });
  }

  handleBlur = () => {
    this.setState({
      markup: this.state.markup === '' ? defaultMarkup : this.state.markup,
      editing: false,
      highlight: false
    });
    this.props.setCustom(null);
  }

  handleClick = () => {
    if (this.props.inCanvas) {
      this.setState({
        editing: true,
        highlight: false
      });
      this.props.setCustom(
        <div
          style={{
            padding: 20,
            textAlign: 'center'
          }}
        >
          Use &lsquo;style&rsquo; attribute in your markup to customize this component.
        </div>
      );
    }
  }

  toggleHighlight = () => {
    this.setState({
      highlight: !this.state.highlight
    });
  }

  export = () => this.state.markup;

  serialize = () => ({
    markup: this.state.markup
  });

  render() {
    const { type, inCanvas, isDragging, connectDragSource, connectDragPreview } = this.props;
    const { markup, editing, highlight } = this.state;
    return connectDragPreview(connectDragSource(
      <div
        type={type}
        style={{
          opacity: isDragging ? 0.6 : 1,
          height: '100%',
          width: '100%',
          cursor: inCanvas ? 'text' : 'move',
          display: 'flex',
          position: inCanvas && highlight ? 'relative' : 'static',
          zIndex: inCanvas && highlight ? 1499 : 0,
          outline: inCanvas && highlight ? '2px solid #4CB9EA' : 'none'
        }}
      >
        {
          (() => {
            if (inCanvas) {
              if (editing) {
                return (
                  <ClickOutside
                    style={{ height: '100%', width: '100%' }}
                    onClickOutside={this.handleBlur}
                  >
                    <Codemirror
                      value={markup}
                      onChange={this.handleChange}
                      options={options}
                      ref={(c) => { this.editor = c; }}
                    />
                  </ClickOutside>
                );
              }

              return (
                <div
                  style={{
                    height: '100%',
                    width: '100%',
                    color: '#000000',
                    background: '#FFFFFF',
                  }}
                  onClick={this.handleClick}
                  onMouseEnter={this.toggleHighlight}
                  onMouseLeave={this.toggleHighlight}
                  dangerouslySetInnerHTML={{ __html: markup }} // eslint-disable-line
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
                  border: '1px solid #eee',
                  padding: 10,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
                onClick={this.handleClick}
                onMouseEnter={this.toggleHighlight}
                onMouseLeave={this.toggleHighlight}
              >
                <strong>&lt;</strong>HTML Markup<strong>&gt;</strong>
              </div>
            );
          })()
        }
      </div>,
      { dropEffect: 'copy' }
    ), { captureDraggingState: true });
  }
}

Html.propTypes = {
  type: PropTypes.string.isRequired,
  state: PropTypes.object,
  inCanvas: PropTypes.bool,
  isDragging: PropTypes.bool.isRequired,
  setCustom: PropTypes.func,
  pushToUndoStack: PropTypes.func,
  connectDragSource: PropTypes.func.isRequired,
  connectDragPreview: PropTypes.func.isRequired
};

Html.defaultProps = {
  inCanvas: false
};

export default DragSource(manifest.HTML, source, collect)(Html);
