import type { Meta, StoryObj } from "@storybook/react";
import { MenuPlacement } from "./MenuPlacement";

const meta: Meta<typeof MenuPlacement> = {
	title: "react-select-async-paginate",
	component: MenuPlacement,
};
export default meta;
type Story = StoryObj<typeof MenuPlacement>;

export const MenuPlacementStory: Story = {
	name: "Menu placement",
	render: (props) => <MenuPlacement {...props} />,
};
