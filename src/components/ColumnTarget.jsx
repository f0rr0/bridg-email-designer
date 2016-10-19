import React, { Component, PropTypes, Children } from 'react';
import equal from 'deep-equal';
import { DropTarget } from 'react-dnd';
import { target } from '../lib/generic-drop-target';
import manifest from '../lib/manifest';

const contentTypes = Object.values(manifest).filter(type => type !== 'ROW');

const columnTarget = Object.assign({}, target, {
  canDrop(props) {
    return Children.toArray(props.children).length === 0;
  }
});

const collect = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
});

class ColumnTarget extends Component {

  shouldComponentUpdate(nextProps) {
    return !equal(this.props, nextProps);
  }

  render() {
    const { connectDropTarget, isOver, canDrop, children } = this.props;
    return connectDropTarget(
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: isOver && canDrop ? 'rgba(187, 187, 187, 0.5)' : 'transparent',
          transition: 'all 0.3s ease-in-out'
        }}
      >
        {children}
      </div>
    );
  }
}

ColumnTarget.propTypes = {
  connectDropTarget: PropTypes.func.isRequired,
  children: PropTypes.array.isRequired,
  isOver: PropTypes.bool.isRequired,
  canDrop: PropTypes.bool.isRequired
};

export default DropTarget(contentTypes, columnTarget, collect)(ColumnTarget);
