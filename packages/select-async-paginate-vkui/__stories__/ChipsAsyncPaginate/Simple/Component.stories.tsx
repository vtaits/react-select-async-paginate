import type { Meta, StoryObj } from "@storybook/react-vite";
import { Simple } from "./Simple";

const meta: Meta<typeof Simple> = {
	title: "select-async-paginage-vkui/ChipsAsyncPaginate",
	component: Simple,
};
export default meta;
type Story = StoryObj<typeof Simple>;

export const SimpleStory: Story = {
	name: "Simple",
	render: (props) => <Simple {...props} />,
};
