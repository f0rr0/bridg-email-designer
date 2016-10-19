import React, { Component, PropTypes } from 'react';
import { DropTarget } from 'react-dnd';
import { target, collect } from '../lib/generic-drop-target';
import manifest from '../lib/manifest';

class CanvasTarget extends Component {
  render() {
    const { connectDropTarget, children } = this.props;
    return connectDropTarget(
      <div
        style={{
          width: '100%',
          padding: '10px 10px 10em',
          overflowY: 'scroll',
          display: 'flex',
          flexDirection: 'column'
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

export default DropTarget(manifest.ROW, target, collect)(CanvasTarget);
