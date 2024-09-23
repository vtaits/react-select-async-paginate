import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Manual } from "./Manual";

const meta: Meta<typeof Manual> = {
  title: "react-select-async-paginate/Manual",
  component: Manual,
};
export default meta;
type Story = StoryObj<typeof Manual>;

export const ManualStory: Story = {
  name: "Component",
  render: (props) => <Manual {...props} />,
};
