import React, { Component, PropTypes } from 'react';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import muiThemeable from 'material-ui/styles/muiThemeable';

class DropDown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.initialValue
    };
  }

  setVal = (event, index, value) => {
    this.setState({
      value
    }, () => {
      this.props.onChange(this.state.value);
    });
  }

  render() {
    const { palette } = this.props.muiTheme;
    const items = this.props.items.map(({ value, primaryText }, index) =>
      <MenuItem className="customization" key={index} value={value} primaryText={primaryText} />
    );
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
          <DropDownMenu
            value={this.state.value}
            onChange={this.setVal}
          >
            {items}
          </DropDownMenu>
        </div>
      </div>
    );
  }
}

export default muiThemeable()(DropDown);

DropDown.propTypes = {
  muiTheme: PropTypes.object,
  initialValue: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func
};

DropDown.defaultProps = {
  onChange: () => {}
};
