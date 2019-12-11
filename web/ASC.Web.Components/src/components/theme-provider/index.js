import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  createGlobalStyle,
  ThemeProvider as Provider
} from "styled-components";
import { Dark, Light } from "../../themes/index";

const GlobalStyle = createGlobalStyle`
  text-align: "left";
  
*, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

html, body {
    height: 100vh;
    max-width: 100%;
    /*font-size: 62.5%;*/
    background-color: ${props => props.theme.backgroundColor};
    color: ${props => props.theme.color};
    font-family: ${props => props.theme.fontFamily};
}
`;

const ThemeProvider = props => {
  const { theme, children } = props;

  const [thema, setTheme] = useState(theme);
  return (
    <>
      <button
        onClick={() => (thema === Dark ? setTheme(Light) : setTheme(Dark))}
      >
        Switch theme
      </button>
      <Provider theme={thema}>
        <GlobalStyle />
        {children}
      </Provider>
    </>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.any,
  theme: PropTypes.object
};

export default ThemeProvider;
