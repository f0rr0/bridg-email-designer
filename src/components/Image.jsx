import React, { Component, PropTypes } from 'react';
import styled, { injectGlobal } from 'styled-components';
import { DragSource } from 'react-dnd';
import ProgressiveImage from 'react-progressive-image';
import { ResizableBox } from 'react-resizable';
import ClickOutside from 'react-click-outside';
import equal from 'deep-equal';
import uniqueid from 'lodash.uniqueid';
import ImageIcon from 'material-ui/svg-icons/image/image';
import LinkIcon from 'material-ui/svg-icons/content/link';
import PlusMinus from './PlusMinus';
import ColorPicker from './ColorPicker';
import DialogInput from './DialogInput';
import manifest from '../lib/manifest';
import { source, collect } from '../lib/generic-drag-source';
import placeholder from '../assets/image.svg';

/*eslint-disable */
injectGlobal`
  .react-resizable {
    position: relative;
    margin: auto;
  }

  .react-resizable-handle {
    position: absolute;
    width: 20px;
    height: 20px;
    bottom: 0;
    right: 0;
    background: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pg08IS0tIEdlbmVyYXRvcjogQWRvYmUgRmlyZXdvcmtzIENTNiwgRXhwb3J0IFNWRyBFeHRlbnNpb24gYnkgQWFyb24gQmVhbGwgKGh0dHA6Ly9maXJld29ya3MuYWJlYWxsLmNvbSkgLiBWZXJzaW9uOiAwLjYuMSAgLS0+DTwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DTxzdmcgaWQ9IlVudGl0bGVkLVBhZ2UlMjAxIiB2aWV3Qm94PSIwIDAgNiA2IiBzdHlsZT0iYmFja2dyb3VuZC1jb2xvcjojZmZmZmZmMDAiIHZlcnNpb249IjEuMSINCXhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbDpzcGFjZT0icHJlc2VydmUiDQl4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjZweCIgaGVpZ2h0PSI2cHgiDT4NCTxnIG9wYWNpdHk9IjAuMzAyIj4NCQk8cGF0aCBkPSJNIDYgNiBMIDAgNiBMIDAgNC4yIEwgNCA0LjIgTCA0LjIgNC4yIEwgNC4yIDAgTCA2IDAgTCA2IDYgTCA2IDYgWiIgZmlsbD0iIzAwMDAwMCIvPg0JPC9nPg08L3N2Zz4=');
    background-position: bottom right;
    padding: 0 3px 3px 0;
    background-repeat: no-repeat;
    background-origin: content-box;
    box-sizing: border-box;
    cursor: se-resize;
  }
`;
/*eslint-enable */

const Control = styled('div')`
  margin-bottom: 10px;
  &:last-child {
    margin-bottom: 0;
  }
`;

class Image extends Component {
  constructor(props) {
    super(props);
    this.state = props.state || {
      src: placeholder,
      href: '',
      padding: 0,
      background: 'rgba(255, 255, 255, 1)',
      height: 80,
      width: (80 / 3) * 4
    };
    this.state.highlight = false;
    this.state.editing = false;
    this.uniqueid = uniqueid();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !equal(this.props, nextProps) || !equal(nextState, this.state);
  }

  componentWillUnmount() {
    this.props.setCustom(null);
  }

  getCustom = (e) => {
    e.stopPropagation();
    this.props.setCustom(
      <div style={{ padding: 20 }} key={this.uniqueid}>
        <Control>
          <DialogInput
            icon={<ImageIcon />}
            label="Image Source"
            floatingLabelText="Enter link to image"
            initialValue={this.state.src === placeholder ? 'https://unsplash.it/200/200/?random' : this.state.src}
            onChange={this.customDispatch('src')}
          />
        </Control>
        <Control>
          <DialogInput
            icon={<LinkIcon />}
            label="Hyperlink"
            floatingLabelText="Enter hyperlink address"
            initialValue={this.state.href}
            onChange={this.customDispatch('href')}
          />
        </Control>
        <Control>
          <ColorPicker
            label="Background Color"
            initialValue={this.state.background}
            onChange={this.customDispatch('background')}
          />
        </Control>
        <Control>
          <PlusMinus
            label="Padding"
            initialValue={this.state.padding}
            onChange={this.customDispatch('padding')}
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
      case 'src':
        this.props.pushToUndoStack();
        this.setState({
          src: val
        });
        break;
      case 'href':
        this.props.pushToUndoStack();
        this.setState({
          href: val
        });
        break;
      case 'background':
        this.props.pushToUndoStack();
        this.setState({
          background: val
        });
        break;
      default:
    }
  }

  handleResize = (event, { size }) => {
    const { width, height } = size;
    this.setState({
      height,
      width
    });
  }

  stopEvent = (event) => {
    event.stopPropagation();
    event.preventDefault();
  }

  handleResizeStart = () => {
    this.props.pushToUndoStack();
  }

  handleClick = (e) => {
    this.setState({
      editing: true
    });
    this.getCustom(e);
  }

  handleClickOutside = (e) => {
    if (![...document.querySelectorAll('.customization')].some(node => node.contains(e.target))) {
      this.props.setCustom(null);
      this.setState({
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

  export = () => {
    const {
      src,
      background,
      padding,
      href,
      height
    } = this.state;
    if (href === '') {
      return `<center style="box-sizing: border-box; padding: ${padding}px; background-color: ${background}"><img src=${src} align="center" class="float-center" style="width: auto; height: ${height}px" /></center>`;
    }
    return `<center style="box-sizing: border-box; padding: ${padding}px; background-color: ${background}"><a class="float-center" align="center" href=${href} target="__blank" rel="noopener noreferrer"><img src=${src} style="display: inline-block !important; width: auto; height: ${height}px"/></a></center>`;
  }

  serialize = () => this.state;

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
      highlight,
      src,
      padding,
      background,
      height,
      width
    } = this.state;

    const content = (() => {
      if (inCanvas) {
        if (editing) {
          return (
            <ClickOutside
              onClickOutside={this.handleClickOutside}
              style={{
                margin: '0 auto'
              }}
            >
              <ProgressiveImage
                src={src}
                placeholder={placeholder}
                style={{
                  cursor: 'pointer'
                }}
              >
                {
                  img =>
                    <ResizableBox
                      height={height}
                      width={width}
                      minConstraints={[10, 10]}
                      maxConstraints={[552 - (2 * padding), 1000]}
                      onResize={this.handleResize}
                      onResizeStart={this.handleResizeStart}
                      draggableOpts={{
                        onMouseDown: this.stopEvent
                      }}
                    >
                      <img
                        height={height}
                        width={width}
                        src={img}
                        alt={img}
                        style={{
                          display: 'block',
                          margin: '0 auto',
                          transition: 'background 0.2s ease-in-out',
                          cursor: 'pointer'
                        }}
                      />
                    </ResizableBox>
                }
              </ProgressiveImage>
            </ClickOutside>
          );
        }
        return (
          <ProgressiveImage
            src={src}
            placeholder={placeholder}
          >
            {
              img =>
                <img
                  height={height}
                  width={width}
                  src={img}
                  alt={img}
                  style={{
                    display: 'block',
                    margin: '0 auto',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={this.toggleHighlight}
                  onMouseLeave={this.toggleHighlight}
                  onClick={this.handleClick}
                />
            }
          </ProgressiveImage>
        );
      }
      return (
        <div
          style={{
            color: '#000000',
          }}
        >
          Resizable Image
        </div>
      );
    })();

    return connectDragPreview(connectDragSource(
      <div
        id={type}
        style={{
          background: inCanvas ? background : '#FFFFFF',
          opacity: isDragging ? 0.6 : 1,
          height: '100%',
          width: '100%',
          padding: inCanvas ? padding : '10px',
          position: inCanvas && highlight ? 'relative' : 'static',
          zIndex: inCanvas && highlight ? 1499 : 0,
          outline: highlight ? '2px solid blue' : 'none',
          lineHeight: 1.3,
          cursor: 'move',
          display: 'flex',
          flex: '1 0 auto'
        }}
      >
        {content}
      </div>,
      { dropEffect: 'copy' }
    ), { captureDraggingState: true });
  }
}

Image.propTypes = {
  type: PropTypes.string.isRequired,
  state: PropTypes.object,
  inCanvas: PropTypes.bool,
  isDragging: PropTypes.bool.isRequired,
  setCustom: PropTypes.func,
  pushToUndoStack: PropTypes.func,
  connectDragSource: PropTypes.func.isRequired,
  connectDragPreview: PropTypes.func.isRequired
};

Image.defaultProps = {
  inCanvas: false
};

export default DragSource(manifest.IMAGE, source, collect)(Image);
