import React, { Component, PropTypes } from 'react';
import { DragSource } from 'react-dnd';
import equal from 'deep-equal';
import manifest from '../lib/manifest';
import { source, collect } from '../lib/genericDragSource';
import Column from './Column';

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

class Row extends Component {
  shouldComponentUpdate(nextProps) {
    return !equal(this.props, nextProps);
  }

  render() {
    const {
      rowIndex,
      type,
      col,
      handleContent,
      disableDrag,
      isDragging,
      connectDragSource,
      connectDragPreview
    } = this.props;

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
          cursor: disableDrag ? 'default' : 'move',
          opacity: isDragging ? 0.6 : 1,
          transition: 'all 0.2s ease-in-out'
        }}
      >
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
  handleContent: PropTypes.func,
  disableDrag: PropTypes.bool,
  isDragging: PropTypes.bool.isRequired,
  connectDragSource: PropTypes.func.isRequired,
  connectDragPreview: PropTypes.func.isRequired
};

Row.defaultProps = {
  disableDrag: false
};

export default DragSource(manifest.ROW, rowSource, collect)(Row);
