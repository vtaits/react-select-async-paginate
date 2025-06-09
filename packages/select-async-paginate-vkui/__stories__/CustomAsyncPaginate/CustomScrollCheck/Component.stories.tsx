import type { Meta, StoryObj } from "@storybook/react-vite";
import { CustomScrollCheck } from "./CustomScrollCheck";

const meta: Meta<typeof CustomScrollCheck> = {
	title: "select-async-paginage-vkui/CustomAsyncPaginate",
	component: CustomScrollCheck,
};
export default meta;
type Story = StoryObj<typeof CustomScrollCheck>;

export const CustomScrollCheckStory: Story = {
	name: "Custom Scroll Check",
	render: (props) => <CustomScrollCheck {...props} />,
};
