import type { Meta, StoryObj } from "@storybook/react";
import { Simple } from "./Simple";

const meta: Meta<typeof Simple> = {
	title: "select-async-paginage-vkui/Simple",
	component: Simple,
};
export default meta;
type Story = StoryObj<typeof Simple>;

export const SimpleStory: Story = {
	name: "Component",
	render: (props) => <Simple {...props} />,
};
