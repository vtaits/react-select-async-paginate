import type { Meta, StoryObj } from "@storybook/react";
import { GroupedOptions } from "./GroupedOptions";

const meta: Meta<typeof GroupedOptions> = {
  title: "react-select-async-paginate/Grouped Options",
  component: GroupedOptions,
};
export default meta;
type Story = StoryObj<typeof GroupedOptions>;

export const GroupedOptionsStory: Story = {
  name: "Component",
  render: (props) => <GroupedOptions {...props} />,
};
