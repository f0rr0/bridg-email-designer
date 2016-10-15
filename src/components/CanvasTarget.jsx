import React, { Component, PropTypes } from 'react';
import { DropTarget } from 'react-dnd';
import { target, collect } from '../lib/genericDropTarget';
import manifest from '../lib/manifest';

class CanvasTarget extends Component {
  render() {
    const { connectDropTarget, children } = this.props;
    return connectDropTarget(
      <div style={{ minHeight: '100%', paddingBottom: '5.5em' }}>
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
