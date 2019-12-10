import React, { Component } from "react";
import PropTypes from "prop-types";
import styled, { css, withTheme } from "styled-components";
import { Icons } from "../icons";
import Text from "../text";

const ToggleButtonContainer = styled.label`
  position: relative;
  -webkit-appearance: none;
  display: flex;
  align-items: center;
  outline: none;

  user-select: none;
  -moz-user-select: none;
  -o-user-select: none;
  -webkit-user-select: none;

  ${props =>
    props.isDisabled
      ? css`
          cursor: default;
        `
      : css`
          cursor: pointer;
        `}

    ${props =>
      props.checked && !props.isDisabled
        ? css`
            svg {
              rect {
                fill: ${props.theme.backgroundColorON};
              }
            }
          `
        : props.checked && props.isDisabled
        ? css`
            svg {
              rect {
                fill: ${props.theme.backgroundColorONDisable};
              }
            }
          `
        : props.isDisabled
        ? css`
            svg {
              rect {
                fill: ${props.theme.backgroundColorOFF};
              }
            }
          `
        : css`
            svg {
              rect {
                fill: ${props.theme.backgroundColorOFFDisable};
              }
            }
          `}
    ${props =>
      props.isDisabled
        ? css`
            rect {
              fill: #eceff1;
            }
          `
        : ""}
  

  .toggleText {
    margin-left: 8px;
  }
`;

const HiddenInput = styled.input`
  opacity: 0.0001;
  position: absolute;
  right: 0;
  z-index: -1;
`;

const ToggleIcon = ({ isChecked }) => {
  const iconName = isChecked ? "ToggleButtonCheckedIcon" : "ToggleButtonIcon";
  return <>{React.createElement(Icons[iconName])}</>;
};

class ToggleButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      checked: props.isChecked
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.isChecked !== prevProps.isChecked) {
      this.setState({ checked: this.props.isChecked });
    }
  }

  render() {
    const {
      isDisabled,
      label,
      onChange,
      id,
      className,
      style,
      theme
    } = this.props;
    const { checked } = this.state;
    const colorProps = isDisabled
      ? { color: theme.disableColor }
      : { color: theme.color };

    //console.log("ToggleButton render");

    return (
      <ToggleButtonContainer
        id={id}
        className={className}
        style={style}
        isDisabled={isDisabled}
        checked={checked}
        theme={theme}
      >
        <HiddenInput
          type="checkbox"
          checked={checked}
          disabled={isDisabled}
          onChange={onChange}
        />
        <ToggleIcon isChecked={checked} />
        {label && (
          <Text className="toggleText" as="span" {...colorProps}>
            {label}
          </Text>
        )}
      </ToggleButtonContainer>
    );
  }
}

ToggleButton.propTypes = {
  isChecked: PropTypes.bool.isRequired,
  isDisabled: PropTypes.bool,
  onChange: PropTypes.func,
  label: PropTypes.string,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
};

ToggleIcon.propTypes = {
  isChecked: PropTypes.bool
};

export default withTheme(ToggleButton);
