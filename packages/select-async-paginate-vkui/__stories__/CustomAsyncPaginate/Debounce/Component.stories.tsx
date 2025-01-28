import type { Meta, StoryObj } from "@storybook/react";
import { Debounce } from "./Debounce";

const meta: Meta<typeof Debounce> = {
	title: "select-async-paginage-vkui/CustomAsyncPaginate/Debounce",
	component: Debounce,
};
export default meta;
type Story = StoryObj<typeof Debounce>;

export const DebounceStory: Story = {
	name: "Component",
	render: (props) => <Debounce {...props} />,
};
