import React, { Component } from "react";
import PropTypes from "prop-types";
import { ThemeProvider as Provider } from "styled-components";
import { Base, GreenCyan } from "../../themes/index";

class ThemeProvider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      theme: props.theme
    };
  }
  onClick = () => {
    const { theme } = this.state;
    theme === Base
      ? this.setState({ theme: GreenCyan })
      : this.setState({ theme: Base });
  };

  render() {
    //console.log("Theme provider render");

    const { theme } = this.state;
    const { children } = this.props;
    return (
      <Provider theme={theme}>
        {/*<button onClick={this.onClick}>Switch theme</button>*/}
        {children}
      </Provider>
    );
  }
}

ThemeProvider.propTypes = {
  children: PropTypes.any,
  theme: PropTypes.object
};

export default ThemeProvider;
