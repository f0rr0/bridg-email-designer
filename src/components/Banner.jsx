import React, { Component, PropTypes } from 'react';
import styled from 'styled-components';
import { DragSource } from 'react-dnd';
import ProgressiveImage from 'react-progressive-image';
import equal from 'deep-equal';
import manifest from '../lib/manifest';
import { source, collect } from '../lib/generic-drag-source';
import placeholder from '../assets/image.svg';

const ImageContainer = styled('img')`
  background-color: #bbbbbb;
  width: 100%;
  min-height: 100%;
  max-height: 10em;
  height: ${({ src }) => src.includes(placeholder) ? '0em' /* hack */ : 'auto'}
  vertical-align: top;
  transition: all 0.2s ease-in-out;

  &:hover {
    opacity: 0.5;
  }
`;

class Image extends Component {
  constructor(props) {
    super(props);
    this.state = {
      src: placeholder
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !equal(this.props, nextProps) || !equal(nextState, this.state);
  }

  handleClick = () => {
    const src = window.prompt('Enter the URI to the image', 'https://unsplash.it/1000/300/?random'); // eslint-disable-line
    if (src) {
      this.setState({
        src
      });
    }
  }

  export = () => {
    const { src } = this.state;
    return `<img src="${src}" style="width: 100%;" />`;
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
          width: '100%',
          color: '#000000',
          cursor: inCanvas ? 'pointer' : 'move',
          transition: 'all 0.2s ease-in-out',
          display: 'flex',
          flex: '0 0 auto'
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
                  <ImageContainer src={img} onClick={this.handleClick} />
              }
            </ProgressiveImage>
          :
            <div style={{ padding: '10px', lineHeight: 1.125 }}>Banner Image</div>
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

export default DragSource(manifest.BANNER, source, collect)(Image);
