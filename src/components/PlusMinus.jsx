import React, { Component, PropTypes } from 'react';
import IconButton from 'material-ui/IconButton';
import Add from 'material-ui/svg-icons/content/add';
import Remove from 'material-ui/svg-icons/content/remove';
import muiThemeable from 'material-ui/styles/muiThemeable';

class PlusMinus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.initialValue
    };
  }

  dispatch = type => () => {
    if (type === 'increment') {
      this.setState(({ value }) => ({
        value: value + 1
      }), () => {
        this.props.onChange(this.state.value);
      });
    } else {
      this.setState(({ value }) => ({
        value: value - 1
      }), () => {
        this.props.onChange(this.state.value);
      });
    }
  }

  render() {
    const { palette } = this.props.muiTheme;
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between'
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            fontSize: 16,
            color: palette.textColor,
          }}
        >
          {this.props.label}
        </span>
        <div>
          <IconButton
            style={{
              backgroundColor: palette.canvasColor,
              borderRadius: '3px 0 0 3px'
            }}
            onTouchTap={this.dispatch('increment')}
            disabled={this.state.value === this.props.maxValue}
          >
            <Add />
          </IconButton>
          <span
            style={{
              display: 'inline-flex',
              verticalAlign: 'top',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: palette.canvasColor,
              color: palette.textColor,
              fontSize: 18,
              padding: 12,
              height: 48,
              width: 48
            }}
          >
            {this.state.value}
          </span>
          <IconButton
            style={{
              backgroundColor: palette.canvasColor,
              borderRadius: '0 3px 3px 0'
            }}
            onTouchTap={this.dispatch('decrement')}
            disabled={this.state.value === this.props.minValue}
          >
            <Remove />
          </IconButton>
        </div>
      </div>
    );
  }
}

export default muiThemeable()(PlusMinus);

PlusMinus.propTypes = {
  muiTheme: PropTypes.object,
  initialValue: PropTypes.number,
  maxValue: PropTypes.number,
  minValue: PropTypes.number,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func
};

PlusMinus.defaultProps = {
  initialValue: 0,
  maxValue: 50,
  minValue: 0,
  onChange: () => {}
};
