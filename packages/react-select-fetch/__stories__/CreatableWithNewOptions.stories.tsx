import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { SelectFetch } from "../src";
import { CreatableWithNewOptions } from "./CreatableWithNewOptions";

const meta: Meta<typeof CreatableWithNewOptions> = {
  title: "react-select-fetch/Creatable with New Options",
  component: CreatableWithNewOptions,
};
export default meta;
type Story = StoryObj<typeof CreatableWithNewOptions>;

export const CreatableWithNewOptionsStory: Story = {
  name: "Component",
  render: (props) => <CreatableWithNewOptions {...props} />,
};