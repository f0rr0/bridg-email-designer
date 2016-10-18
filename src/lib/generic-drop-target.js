export const target = {
  drop(props, monitor) {
    props.onDrop(monitor.getItem());
  }
};

export const collect = connect => ({
  connectDropTarget: connect.dropTarget()
});
