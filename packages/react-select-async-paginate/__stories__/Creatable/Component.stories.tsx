import type { Meta, StoryObj } from "@storybook/react";
import { Creatable } from "./Creatable";

const meta: Meta<typeof Creatable> = {
	title: "react-select-async-paginate",
	component: Creatable,
};
export default meta;
type Story = StoryObj<typeof Creatable>;

export const CreatableStory: Story = {
	name: "Creatable",
	render: (props) => <Creatable {...props} />,
};
