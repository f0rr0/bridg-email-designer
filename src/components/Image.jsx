import React, { Component, PropTypes } from 'react';
import styled, { css, injectGlobal } from 'styled-components';
import { DragSource } from 'react-dnd';
import ProgressiveImage from 'react-progressive-image';
import { ResizableBox } from 'react-resizable';
import equal from 'deep-equal';
import manifest from '../lib/manifest';
import { source, collect } from '../lib/generic-drag-source';
import placeholder from '../assets/image.svg';

/*eslint-disable */
injectGlobal`
  .react-resizable {
    position: relative;
    margin: 0 auto;
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
/*eslint-disable */

const ImageContainer = styled('div')`
  background: ${({ bg }) => css`url(${bg})`}
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  background-color: #bbbbbb;
  width: 100%;
  height: 100%;
  transition: all 0.2s ease-in-out;

  &:hover {
    opacity: 0.5;
  }
`;

class Image extends Component {
  constructor(props) {
    super(props);
    this.state = {
      src: placeholder,
      height: 150,
      width: 150
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !equal(this.props, nextProps) || nextState.src !== this.state.src;
  }

  handleResizeStop = (event, {element, size}) => {
    const { width, height } = size;
    this.setState({
      height,
      width
    });
  }

  handleClick = () => {
    const src = window.prompt('Enter the URI to the image', 'https://unsplash.it/200/?random');
    if (!!src) {
      this.setState({
        src
      });
    }
  }

  export = () => {
    const { src, width, height } = this.state;
    return `<img src="${src}" width=${width} height=${height} />`;
  }

  render() {
    const { type, inCanvas, isDragging, connectDragSource, connectDragPreview } = this.props;
    const { src } = this.state;
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
          cursor: inCanvas ? 'pointer' : 'move',
          transition: 'all 0.2s ease-in-out'
        }}
      >
        {
          inCanvas ?
            <ProgressiveImage
              src={src}
              placeholder={placeholder}
            >
              {
                img =>
                  <ResizableBox
                    height={150}
                    width={150}
                    lockAspectRatio
                    minConstraints={[100, 100]}
                    maxConstraints={[200, 200]}
                    handleSize={[30,30]}
                    onResizeStop={this.handleResizeStop}
                    onClick={this.handleClick}
                  >
                    <ImageContainer bg={img} />
                  </ResizableBox>
              }
            </ProgressiveImage>
          :
            <div>Image</div>
        }
      </div>,
      { dropEffect: 'copy' }
    ), { captureDraggingState: true });
  }
}

Image.propTypes = {
  type: PropTypes.string.isRequired,
  inCanvas: PropTypes.bool,
  isDragging: PropTypes.bool.isRequired,
  connectDragSource: PropTypes.func.isRequired,
  connectDragPreview: PropTypes.func.isRequired
};

Image.defaultProps = {
  inCanvas: false
};

export default DragSource(manifest.IMAGE, source, collect)(Image);
