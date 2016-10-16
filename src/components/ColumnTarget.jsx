import React, { Component, PropTypes } from 'react';
import { DropTarget } from 'react-dnd';
import { target, collect } from '../lib/genericDropTarget';
import manifest from '../lib/manifest';

class ColumnTarget extends Component {
  render() {
    const { connectDropTarget, children } = this.props;
    return connectDropTarget(
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {children}
      </div>
    );
  }
}

ColumnTarget.propTypes = {
  connectDropTarget: PropTypes.func.isRequired,
  children: PropTypes.array
};

export default DropTarget(manifest.TEXT, target, collect)(ColumnTarget);
