import type { Meta, StoryObj } from "@storybook/react";
import { CustomScrollCheck } from "./CustomScrollCheck";

const meta: Meta<typeof CustomScrollCheck> = {
	title: "react-select-async-paginate/Custom Scroll Check",
	component: CustomScrollCheck,
};
export default meta;
type Story = StoryObj<typeof CustomScrollCheck>;

export const CustomScrollCheckStory: Story = {
	name: "Component",
	render: (props) => <CustomScrollCheck {...props} />,
};
