import type { Meta, StoryObj } from "@storybook/react";
import { GroupedOptions } from "./GroupedOptions";

const meta: Meta<typeof GroupedOptions> = {
	title: "react-select-async-paginate",
	component: GroupedOptions,
};
export default meta;
type Story = StoryObj<typeof GroupedOptions>;

export const GroupedOptionsStory: Story = {
	name: "Grouped Options",
	render: (props) => <GroupedOptions {...props} />,
};
