import React, { Component, PropTypes } from 'react';
import { DropTarget } from 'react-dnd';
import { target, collect } from '../lib/generic-drop-target';
import manifest from '../lib/manifest';

const canvasTarget = Object.assign({}, target, {
  canDrop(props, monitor) {
    return !monitor.getItem().component.props.inCanvas;
  }
});

class CanvasTarget extends Component {
  render() {
    const { connectDropTarget, children } = this.props;
    return connectDropTarget(
      <div
        style={{
          display: 'block',
          flex: '1 1 100%',
          paddingBottom: '10em',
          overflowY: 'scroll',
        }}
      >
        {children}
      </div>
    );
  }
}

CanvasTarget.propTypes = {
  connectDropTarget: PropTypes.func.isRequired,
  children: PropTypes.array
};

export default DropTarget(manifest.ROW, canvasTarget, collect)(CanvasTarget);
