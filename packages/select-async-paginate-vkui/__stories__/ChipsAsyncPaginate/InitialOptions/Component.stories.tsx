import type { Meta, StoryObj } from "@storybook/react-vite";
import { InitialOptions } from "./InitialOptions";

const meta: Meta<typeof InitialOptions> = {
	title: "select-async-paginage-vkui/ChipsAsyncPaginate",
	component: InitialOptions,
};
export default meta;
type Story = StoryObj<typeof InitialOptions>;

export const InitialOptionsStory: Story = {
	name: "Initial Options",
	render: (props) => <InitialOptions {...props} />,
};
