import type { Meta, StoryObj } from "@storybook/react";
import { InitialOptions } from "./InitialOptions";

const meta: Meta<typeof InitialOptions> = {
  title: "react-select-async-paginate/Initial Options",
  component: InitialOptions,
};
export default meta;
type Story = StoryObj<typeof InitialOptions>;

export const InitialOptionsStory: Story = {
  name: "Component",
  render: (props) => <InitialOptions {...props} />,
};
