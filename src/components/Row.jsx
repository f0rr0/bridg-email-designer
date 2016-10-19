import React, { Component, PropTypes } from 'react';
import styled from 'styled-components';
import { DragSource } from 'react-dnd';
import equal from 'deep-equal';
import manifest from '../lib/manifest';
import { source, collect } from '../lib/generic-drag-source';
import Column from './Column';
import close from '../assets/close.svg';

const rowSource = Object.assign({}, source, {
  beginDrag(props, monitor, component) {
    const { type, col } = props;
    return {
      type,
      col,
      component
    };
  }
});

const CloseButton = styled('div')`
  position: absolute;
  right: 0;
  width: 16px;
  height: 16px;
  margin: -10px -5px 0 0;
  background-image: ${`url(${close})`};
  background-repeat: no-repeat;
  background-size: contain;
  filter: invert(100%) brightness(10%);
  cursor: pointer;
`;

class Row extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showClose: false
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !equal(this.props, nextProps) || !equal(this.state, nextState);
  }

  toggleClose = val => () => {
    this.setState({
      showClose: val
    });
  }

  handleClick = () => {
    this.toggleClose(false);
    this.props.onClick();
  }

  render() {
    const {
      rowIndex,
      type,
      col,
      inCanvas,
      handleContent,
      disableDrag,
      isDragging,
      connectDragSource,
      connectDragPreview
    } = this.props;

    const { showClose } = this.state;

    return connectDragPreview(connectDragSource(
      <div
        id={type}
        style={{
          display: 'flex',
          flex: '0 0 auto',
          minHeight: '5em',
          marginBottom: 10,
          padding: '5px',
          borderRadius: '4px',
          background: '#454F4E',
          overflowY: 'auto',
          cursor: disableDrag ? 'default' : 'move',
          opacity: isDragging ? 0.6 : 1,
          transition: 'opacity 0.2s ease-in-out'
        }}
        onMouseEnter={this.toggleClose(true)}
        onMouseOver={this.toggleClose(true)}
        onMouseLeave={this.toggleClose(false)}
      >
        { inCanvas && showClose ? <CloseButton onClick={this.handleClick} />
          : null
        }
        {
          [...Array(col).keys()].map(key =>
            <Column
              rowIndex={rowIndex}
              columnIndex={key}
              col={col}
              key={key}
              handleContent={handleContent}
            />
          )
        }
      </div>,
      { dropEffect: 'copy' }
    ), { captureDraggingState: true });
  }
}

Row.propTypes = {
  type: PropTypes.string.isRequired,
  col: PropTypes.number.isRequired,
  rowIndex: PropTypes.number.isRequired,
  inCanvas: PropTypes.bool,
  onClick: PropTypes.func,
  handleContent: PropTypes.func,
  disableDrag: PropTypes.bool,
  isDragging: PropTypes.bool.isRequired,
  connectDragSource: PropTypes.func.isRequired,
  connectDragPreview: PropTypes.func.isRequired
};

Row.defaultProps = {
  inCanvas: false,
  disableDrag: false
};

export default DragSource(manifest.ROW, rowSource, collect)(Row);
