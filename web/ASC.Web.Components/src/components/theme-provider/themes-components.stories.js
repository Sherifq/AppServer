import React from "react";
import { storiesOf } from "@storybook/react";
import Section from "../../../.storybook/decorators/section";
import { BooleanValue } from "react-values";
import ThemeProvider from "../theme-provider";
import { Base, GreenCyan } from "../../themes/index";
import ToggleButton from "../toggle-button";
import Checkbox from "../checkbox";

storiesOf("Components|ThemeComponents", module)
  .addParameters({ options: { showAddonPanel: false } })
  .add("themes", () => (
    <Section>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: " repeat(auto-fill, 300px)"
        }}
      >
        <BooleanValue>
          {({ value, toggle }) => (
            <>
              <div>
                <h3>Base theme:</h3>
                <ThemeProvider theme={Base}>
                  <ToggleButton
                    label="text"
                    onChange={event => toggle(event.target.value)}
                    isChecked={value}
                  />
                  <Checkbox
                    id="base_theme"
                    name="name"
                    value="value"
                    label="label"
                    isChecked={value}
                    isIndeterminate={false}
                    isDisabled={false}
                    onChange={e => toggle(e.target.value)}
                  />
                </ThemeProvider>
              </div>
              <div>
                <h3>Green cyan theme:</h3>
                <ToggleButton
                  theme={GreenCyan}
                  label="text"
                  onChange={event => toggle(event.target.value)}
                  isChecked={value}
                />
                <Checkbox
                  theme={GreenCyan}
                  id="green-cyan_theme"
                  name="name2"
                  value="value2"
                  label="label2"
                  isChecked={value}
                  isIndeterminate={false}
                  isDisabled={false}
                  onChange={e => toggle(e.target.value)}
                />
              </div>
            </>
          )}
        </BooleanValue>
      </div>
    </Section>
  ));
