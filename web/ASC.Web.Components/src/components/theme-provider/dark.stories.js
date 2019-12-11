import React from "react";
import { storiesOf } from "@storybook/react";
import Section from "../../../.storybook/decorators/section";
//import { BooleanValue } from "react-values";
import ThemeProvider from "../theme-provider";
import { Base, GreenCyan, Light, Dark } from "../../themes/index";
//import ToggleButton from "../toggle-button";
//import Checkbox from "../checkbox";
//import styled from "styled-components";
import Text from "../text";
import Button from "../button";

storiesOf("Components|ThemeComponents", module)
  .addParameters({ options: { showAddonPanel: false } })
  .add("dark", () => (
    <Section>
      <ThemeProvider theme={Dark}>
        <Text fontSize="16px">Hello</Text>
        <br />
        <Button size="big" primary label="Button" />
        <Button size="big" label="Button" />
      </ThemeProvider>
    </Section>
  ));
