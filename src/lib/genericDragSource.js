export const source = {
  canDrag(props) {
    return !props.disableDrag;
  },
  beginDrag(props, monitor, component) {
    return {
      type: props.type,
      component
    };
  }
};

// These are passed as props
export const collect = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  connectDragPreview: connect.dragPreview(),
  isDragging: monitor.isDragging()
});
