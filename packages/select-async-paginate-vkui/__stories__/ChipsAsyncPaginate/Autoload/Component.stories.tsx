import type { Meta, StoryObj } from "@storybook/react-vite";
import { Autoload } from "./Autoload";

const meta: Meta<typeof Autoload> = {
	title: "select-async-paginage-vkui/ChipsAsyncPaginate",
	component: Autoload,
};
export default meta;
type Story = StoryObj<typeof Autoload>;

export const AutoloadStory: Story = {
	name: "Autoload",
	render: (props) => <Autoload {...props} />,
};
