import React, { Component, PropTypes } from 'react';
import styled from 'styled-components';
import { DragSource } from 'react-dnd';
import ClickOutside from 'react-click-outside';
import ProgressiveImage from 'react-progressive-image';
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

const ImageContainer = styled('img')`
  width: 100%;
  vertical-align: top;
  padding: ${({ padding }) => `${padding}px`}
  background-color: ${({ background }) => background}
  transition: all 0.2s ease-in-out;
`;

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
      background: 'rgba(255, 255, 255, 1)'
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

  getCustom = () => {
    this.props.setCustom(
      <div style={{ padding: 20 }} key={this.uniqueid}>
        <Control>
          <DialogInput
            icon={<ImageIcon />}
            label="Image Source"
            floatingLabelText="Enter link to image"
            initialValue={this.state.src === placeholder ? 'https://unsplash.it/552/80/?random' : this.state.src}
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

  handleClickOutside = (e) => {
    if (![...document.querySelectorAll('.customization')].some(node => node.contains(e.target))) {
      this.props.setCustom(null);
      this.setState({
        editing: false,
        highlight: false
      });
    }
  }

  handleClick = () => {
    this.getCustom();
    this.setState({
      editing: true
    });
  }

  toggleHighlight = () => {
    this.setState({
      highlight: !this.state.highlight
    });
  }

  export = () => {
    const {
      src,
      href,
      padding,
      background
    } = this.state;
    if (href === '') {
      return `<div style="width: 100%;"><img src="${src}" style="box-sizing: border-box; width: 100%; padding: ${padding}px; background-color: ${background}" /></div>`;
    }
    return `<div style="width: 100%;"><a href=${href} target='__blank' rel='noopener noreferrer'><img src="${src}" style="box-sizing: border-box; width: 100%; padding: ${padding}px; background-color: ${background}" /></a></div>`;
  }

  serialize = () => {
    const {
      src,
      href,
      padding,
      background
    } = this.state;
    return {
      src,
      href,
      padding,
      background
    };
  }

  render() {
    const {
      type,
      inCanvas,
      isDragging,
      connectDragSource,
      connectDragPreview
    } = this.props;
    const {
      src,
      padding,
      background,
      highlight,
      editing
    } = this.state;

    const content = (() => {
      if (inCanvas) {
        if (editing) {
          return (
            <ClickOutside
              onClickOutside={this.handleClickOutside}
              style={{
                width: '100%'
              }}
            >
              <ProgressiveImage
                src={src}
                placeholder={placeholder}
              >
                {
                  img =>
                    <ImageContainer
                      src={img}
                      padding={padding}
                      background={background}
                    />
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
                <div style={{ width: '100%' }}>
                  <ImageContainer
                    src={img}
                    padding={padding}
                    background={background}
                    onMouseEnter={this.toggleHighlight}
                    onMouseLeave={this.toggleHighlight}
                    onClick={this.handleClick}
                  />
                </div>
            }
          </ProgressiveImage>
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
        >
          Banner Image
        </div>
      );
    })();

    return connectDragPreview(connectDragSource(
      <div
        id={type}
        style={{
          background: inCanvas ? 'rgba(0, 0, 0, 0)' : '#FFFFFF',
          opacity: isDragging ? 0.6 : 1,
          width: '100%',
          height: inCanvas ? '100%' : 100,
          color: '#000000',
          cursor: inCanvas ? 'pointer' : 'move',
          display: 'flex',
          flex: '1 0 auto',
          position: highlight || editing ? 'relative' : 'static',
          zIndex: highlight || editing ? 1499 : 0,
          outline: editing || highlight ? '2px solid #4CB9EA' : 'none'
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

export default DragSource(manifest.BANNER, source, collect)(Image);
