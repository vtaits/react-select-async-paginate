import type { Meta, StoryObj } from "@storybook/react";
import { InitialOptions } from "./InitialOptions";

const meta: Meta<typeof InitialOptions> = {
	title: "react-select-fetch",
	component: InitialOptions,
};
export default meta;
type Story = StoryObj<typeof InitialOptions>;

export const InitialOptionsStory: Story = {
	name: "Initial Options",
	render: (props) => <InitialOptions {...props} />,
};
