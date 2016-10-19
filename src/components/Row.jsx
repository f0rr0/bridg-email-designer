import React, { Component, PropTypes } from 'react';
import styled from 'styled-components';
import { DragSource, DropTarget } from 'react-dnd';
import equal from 'deep-equal';
import manifest from '../lib/manifest';
import { source, collect as collectSource } from '../lib/generic-drag-source';
import { target, collect as collectTarget } from '../lib/generic-drop-target';
import Column from './Column';
import close from '../assets/close.png';

const rowSource = Object.assign({}, source, {
  beginDrag(props, monitor, component) {
    if (props.inCanvas) {
      component.toggleClose(false)();
    }
    return {
      ...props,
      component
    };
  }
});

const rowTarget = Object.assign({}, target, {
  canDrop() {
    return false;
  },
  hover(props, monitor) {
    const { inCanvas: targetInCanvas, id: overId, reorderRows } = props;
    if (targetInCanvas) {
      const { id: draggedId, inCanvas: sourceInCanvas } = monitor.getItem();
      if (draggedId !== overId) {
        if (sourceInCanvas) {
          reorderRows(draggedId, overId);
        } else {
          reorderRows(null, overId, false); // TODO: Toolbox to canvas reorder.
        }
      }
    }
  }
});

const CloseButton = styled('div')`
  position: absolute;
  width: 20px;
  height: 20px;
  margin: -15px auto auto -15px;
  background-image: ${`url(${close})`};
  background-repeat: no-repeat;
  background-size: contain;
  cursor: pointer;
  opacity: ${({ showClose }) => showClose ? 0.8 : 0}
  transition: all 0.5s ease-in-out;
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

  toggleClose = (val, cb) => () => {
    this.setState({
      showClose: val
    }, () => {
      if (cb) {
        cb();
      }
    });
  }

  handleClick = this.toggleClose(false, this.props.onClick);

  render() {
    const {
      id,
      type,
      col,
      inCanvas,
      handleContent,
      disableDrag,
      isDragging,
      connectDragSource,
      connectDragPreview,
      connectDropTarget
    } = this.props;

    const { showClose } = this.state;

    return connectDropTarget(connectDragPreview(connectDragSource(
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
          opacity: isDragging ? inCanvas ? 0.4 : 0.4 : 1, // eslint-disable-line
          transition: 'opacity 0.2s ease-in-out'
        }}
        onMouseEnter={this.toggleClose(true)}
        onMouseOver={this.toggleClose(true)}
        onMouseLeave={this.toggleClose(false)}
      >
        {
          inCanvas ? <CloseButton showClose={showClose} onClick={this.handleClick} /> : null
        }
        {
          [...Array(col).keys()].map(key =>
            <Column
              rowId={id}
              columnIndex={key}
              col={col}
              key={key}
              handleContent={handleContent}
            />
          )
        }
      </div>,
      { dropEffect: 'copy' }
    ), { captureDraggingState: true }));
  }
}

Row.propTypes = {
  type: PropTypes.string.isRequired,
  col: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
  inCanvas: PropTypes.bool,
  onClick: PropTypes.func,
  handleContent: PropTypes.func,
  disableDrag: PropTypes.bool,
  isDragging: PropTypes.bool.isRequired,
  connectDragSource: PropTypes.func.isRequired,
  connectDragPreview: PropTypes.func.isRequired,
  connectDropTarget: PropTypes.func.isRequired
};

Row.defaultProps = {
  inCanvas: false,
  disableDrag: false
};

export default DropTarget(manifest.ROW, rowTarget, collectTarget)(DragSource(manifest.ROW, rowSource, collectSource)(Row)); // eslint-disable-line
