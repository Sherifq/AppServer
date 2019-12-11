import React from "react";
import PropTypes from "prop-types";
import styled, { css, withTheme } from "styled-components";
import { Icons } from "../icons";
import Text from "../text";
import { Base } from "../../themes/index";

const disableColor = "#A3A9AE";

const Label = styled.label`
  display: flex;
  align-items: center;
  position: relative;
  margin: 0;
  user-select: none;
  -o-user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;

  .checkbox {
    margin-right: 8px;
  }

  svg {
    rect {
      fill: ${props => props.theme.cBoxColor};
      stroke: ${props => props.theme.cBoxBorder};
    }
    path {
      fill: ${props => props.theme.cBoxArrow};
    }
  }



  ${props =>
    props.isDisabled
      ? css`
          cursor: not-allowed;

          svg {
            rect {
              stroke: ${props.theme.disablecBoxBorder};
              fill: ${props.theme.disablecBoxBorder};
            }
            path {
              fill: ${props.theme.disablecBoxArrow};
            }
          }
        `
      : css`
          cursor: pointer;

          &:hover {
            svg {
              rect:first-child {
                stroke: ${props => props.theme.cBoxHoverBordrer};
              }
            }
          }
        `}
        ${props =>
    props.isIndeterminate
      ? css`
          svg {
            rect:first-child {
              fill: ${props.theme.cBoxColor};
              /*stroke: ${props.theme.cBoxColor};*/
            }
            rect:last-child {
              fill: ${props.theme.cBoxArrow};
              stroke: ${props.theme.cBoxColor};
            }
          }
        `
      : ""}
`;

const HiddenInput = styled.input`
  opacity: 0.0001;
  position: absolute;
  right: 0;
  z-index: -1;
`;

// eslint-disable-next-line react/prop-types
const CheckboxIcon = ({ isChecked, isDisabled, isIndeterminate }) => {
  const iconName = isIndeterminate
    ? "CheckboxIndeterminateIcon"
    : isChecked
    ? "CheckboxCheckedIcon"
    : "CheckboxIcon";

  let newProps = {
    size: "medium",
    className: "checkbox"
  };

  if (isDisabled) {
    newProps.isfill = true;
    //newProps.color = "#F8F9F9";

    if (isIndeterminate || isChecked) {
      newProps.isStroke = true;
      //newProps.stroke = "#ECEEF1";
    }
  }

  return <>{React.createElement(Icons[iconName], { ...newProps })}</>;
};

class Checkbox extends React.Component {
  constructor(props) {
    super(props);

    this.ref = React.createRef();

    this.state = {
      checked: props.isChecked
    };

    this.onInputChange = this.onInputChange.bind(this);
  }

  componentDidMount() {
    this.ref.current.indeterminate = this.props.isIndeterminate;
  }

  componentDidUpdate(prevProps) {
    if (this.props.isIndeterminate !== prevProps.isIndeterminate) {
      this.ref.current.indeterminate = this.props.isIndeterminate;
    }
    if (this.props.isChecked !== prevProps.isChecked) {
      this.setState({ checked: this.props.isChecked });
    }
  }

  onInputChange(e) {
    this.setState({ checked: e.target.checked });
    this.props.onChange && this.props.onChange(e);
  }

  render() {
    //console.log("Checkbox render");
    const {
      isDisabled,
      id,
      className,
      label,
      style,
      value,
      theme,
      isIndeterminate
    } = this.props;
    const colorProps = isDisabled ? { color: disableColor } : {};

    return (
      <Label
        id={id}
        style={style}
        isDisabled={isDisabled}
        className={className}
        isIndeterminate={isIndeterminate}
        theme={theme}
      >
        <HiddenInput
          type="checkbox"
          checked={this.state.checked}
          disabled={isDisabled}
          ref={this.ref}
          value={value}
          onChange={this.onInputChange}
        />
        <CheckboxIcon {...this.props} />
        {this.props.label && (
          <Text as="span" {...colorProps}>
            {label}
          </Text>
        )}
      </Label>
    );
  }
}

Checkbox.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  label: PropTypes.string,

  isChecked: PropTypes.bool,
  isIndeterminate: PropTypes.bool,
  isDisabled: PropTypes.bool,

  onChange: PropTypes.func,
  className: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  theme: PropTypes.object
};

Checkbox.defaultProps = {
  isChecked: false,
  theme: Base
};

export default withTheme(Checkbox);
