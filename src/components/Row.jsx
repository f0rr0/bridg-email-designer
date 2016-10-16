import React, { Component, PropTypes } from 'react';
import { DragSource } from 'react-dnd';
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
  render() {
    const { type, col, disableDrag, isDragging, connectDragSource } = this.props;
    return connectDragSource(
      <div
        id={type}
        style={{
          marginBottom: 10,
          opacity: isDragging ? 0.6 : 1,
          display: 'flex',
          flex: '0 0 auto',
          minHeight: '5em',
          background: '#454F4E',
          borderRadius: '4px',
          cursor: disableDrag ? 'default' : 'move',
          padding: '5px'
        }}
      >
        {
          [...Array(col).keys()].map(key =>
            <Column col={col} key={key} />
          )
        }
      </div>,
      { dropEffect: 'copy' }
    );
  }
}

Row.propTypes = {
  type: PropTypes.string.isRequired,
  col: PropTypes.number.isRequired,
  disableDrag: PropTypes.bool,
  isDragging: PropTypes.bool.isRequired,
  connectDragSource: PropTypes.func.isRequired
};

Row.defaultProps = {
  disableDrag: false
};

export default DragSource(manifest.ROW, rowSource, collect)(Row);
