import React, { Component, PropTypes } from 'react';
import Toggle from 'material-ui/Toggle';
import muiThemeable from 'material-ui/styles/muiThemeable';

class SwitchInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.initialValue
    };
  }

  setVal = (event, val) => {
    this.setState({
      value: val
    }, () => {
      this.props.onChange(this.state.value);
    });
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
          <Toggle
            defaultToggled={this.props.initialValue}
            onToggle={this.setVal}
          />
        </div>
      </div>
    );
  }
}

export default muiThemeable()(SwitchInput);

SwitchInput.propTypes = {
  muiTheme: PropTypes.object,
  initialValue: PropTypes.bool,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func
};

SwitchInput.defaultProps = {
  initialValue: false,
  onChange: () => {}
};
