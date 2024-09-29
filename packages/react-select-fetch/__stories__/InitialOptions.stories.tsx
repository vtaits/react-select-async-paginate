import type { Meta, StoryObj } from "@storybook/react";

import { SelectFetch } from "../src";
import { InitialOptions } from "./InitialOptions";

const meta: Meta<typeof InitialOptions> = {
  title: "react-select-fetch/Initial Options",
  component: InitialOptions,
};
export default meta;
type Story = StoryObj<typeof SelectFetch>;

export const InitialOptionsStory: Story = {
  name: "Component",
  render: (props) => <InitialOptions {...props} />,
};