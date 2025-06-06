import type { Meta, StoryObj } from "@storybook/react";
import { CreatableWithNewOptions } from "./CreatableWithNewOptions";

const meta: Meta<typeof CreatableWithNewOptions> = {
	title: "react-select-fetch",
	component: CreatableWithNewOptions,
};
export default meta;
type Story = StoryObj<typeof CreatableWithNewOptions>;

export const CreatableWithNewOptionsStory: Story = {
	name: "Creatable with New Options",
	render: (props) => <CreatableWithNewOptions {...props} />,
};
