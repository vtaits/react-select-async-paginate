import type { Meta, StoryObj } from "@storybook/react";
import { MenuPlacement } from "./MenuPlacement";

const meta: Meta<typeof MenuPlacement> = {
	title: "react-select-async-paginate/MenuPlacement",
	component: MenuPlacement,
};
export default meta;
type Story = StoryObj<typeof MenuPlacement>;

export const SimpleStory: Story = {
	name: "Component",
	render: (props) => <MenuPlacement {...props} />,
};
