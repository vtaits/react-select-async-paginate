import type { Meta, StoryObj } from "@storybook/react-vite";
import { ValueWithLabel } from "./ValueWithLabel";

const meta: Meta<typeof ValueWithLabel> = {
	title: "select-async-paginage-vkui/CustomAsyncPaginate",
	component: ValueWithLabel,
};
export default meta;
type Story = StoryObj<typeof ValueWithLabel>;

export const ValueWithLabelStory: Story = {
	name: "Value with label",
	render: (props) => <ValueWithLabel {...props} />,
};
