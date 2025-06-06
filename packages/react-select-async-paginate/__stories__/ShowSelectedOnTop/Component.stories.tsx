import type { Meta, StoryObj } from "@storybook/react";
import { ShowSelectedOnTop } from "./ShowSelectedOnTop";

const meta: Meta<typeof ShowSelectedOnTop> = {
	title: "react-select-async-paginate",
	component: ShowSelectedOnTop,
};
export default meta;
type Story = StoryObj<typeof ShowSelectedOnTop>;

export const ShowSelectedOnTopStory: Story = {
	name: "Show selected on top",
	args: {
		hideSelectedOptions: false,
	},
	render: (props) => <ShowSelectedOnTop {...props} />,
};
