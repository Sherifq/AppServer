import React from "react";
import { storiesOf } from "@storybook/react";
import Section from "../../../.storybook/decorators/section";
import { BooleanValue } from "react-values";
import ThemeProvider from "../theme-provider";
import styled from "styled-components";
import { Light, Dark, Base, GreenCyan } from "../../themes/index";
import ToggleButton from "../toggle-button";

storiesOf("Components|ThemeComponents", module)
  .addParameters({ options: { showAddonPanel: false } })
  .add("themes", () => (
    <Section>
      <BooleanValue>
        {({ value, toggle }) => (
          <>
            <ThemeProvider theme={Base}>
              <ToggleButton
                label="text"
                onChange={event => toggle(event.target.value)}
                isChecked={value}
              />
            </ThemeProvider>
          </>
        )}
      </BooleanValue>
    </Section>
  ));
