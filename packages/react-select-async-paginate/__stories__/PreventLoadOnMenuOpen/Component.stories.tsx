import type { Meta, StoryObj } from "@storybook/react";
import { PreventLoadOnMenuOpen } from "./PreventLoadOnMenuOpen";

const meta: Meta<typeof PreventLoadOnMenuOpen> = {
	title: "react-select-async-paginate",
	component: PreventLoadOnMenuOpen,
};
export default meta;
type Story = StoryObj<typeof PreventLoadOnMenuOpen>;

export const PreventLoadOnMenuOpenStory: Story = {
	name: "Prevent load on menu open",
	args: {
		loadOptionsOnMenuOpen: false,
	},
	render: (props) => <PreventLoadOnMenuOpen {...props} />,
};
