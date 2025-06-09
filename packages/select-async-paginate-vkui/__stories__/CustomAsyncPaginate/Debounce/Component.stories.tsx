import type { Meta, StoryObj } from "@storybook/react-vite";
import { Debounce } from "./Debounce";

const meta: Meta<typeof Debounce> = {
	title: "select-async-paginage-vkui/CustomAsyncPaginate",
	component: Debounce,
};
export default meta;
type Story = StoryObj<typeof Debounce>;

export const DebounceStory: Story = {
	name: "Debounce",
	render: (props) => <Debounce {...props} />,
};
