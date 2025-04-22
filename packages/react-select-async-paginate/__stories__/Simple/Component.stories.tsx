import type { Meta, StoryObj } from "@storybook/react";
import { Simple } from "./Simple";

const meta: Meta<typeof Simple> = {
	title: "react-select-async-paginate",
	component: Simple,
};
export default meta;
type Story = StoryObj<typeof Simple>;

export const SimpleStory: Story = {
	name: "Simple",
	render: (props) => <Simple {...props} />,
};
