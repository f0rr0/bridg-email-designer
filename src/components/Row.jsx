import React, { Component, PropTypes } from 'react';
import styled from 'styled-components';
import { DragSource } from 'react-dnd';
import manifest from '../lib/manifest';
import { source, collect } from '../lib/genericDragSource';

const Container = styled('div')`
  display: flex;
  min-height: 5em;
  background: pink;
  border-radius: 4px;
  cursor: ${props => props.disableDrag ? 'default' : 'move'};
`;

const Column = styled('div')`
  background: red;
  flex-grow: 1;
  margin: 5px 0 5px 5px;
  border-radius: 3px;

  &:last-child {
    margin-right: 5px;
  }
`;

const rowSource = Object.assign({}, source, {
  beginDrag(props, monitor, component) {
    const { type, cols } = props;
    return {
      type,
      cols,
      component
    };
  }
});

class Row extends Component {
  render() {
    const { cols, disableDrag, isDragging, connectDragSource } = this.props;
    return connectDragSource(
      <div style={{ marginBottom: 10, opacity: isDragging ? 0.6 : 1 }}>
        <Container disableDrag={disableDrag}>
          {
            [...Array(cols).keys()].map(key => <Column key={key} />)
          }
        </Container>
      </div>,
      { dropEffect: 'copy' }
    );
  }
}

Row.propTypes = {
  cols: PropTypes.number.isRequired,
  disableDrag: PropTypes.bool,
  isDragging: PropTypes.bool.isRequired,
  connectDragSource: PropTypes.func.isRequired,
};

Row.defaultProps = {
  type: manifest.ROW,
  cols: 1,
  disableDrag: false
};

export default DragSource(manifest.ROW, rowSource, collect)(Row);
