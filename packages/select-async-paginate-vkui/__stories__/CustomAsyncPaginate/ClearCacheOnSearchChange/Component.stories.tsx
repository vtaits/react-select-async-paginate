import type { Meta, StoryObj } from "@storybook/react";
import { ClearCacheOnSearchChange } from "./ClearCacheOnSearchChange";

const meta: Meta<typeof ClearCacheOnSearchChange> = {
	title: "select-async-paginage-vkui/CustomAsyncPaginate",
	component: ClearCacheOnSearchChange,
};
export default meta;
type Story = StoryObj<typeof ClearCacheOnSearchChange>;

export const ClearCacheOnSearchChangeStory: Story = {
	name: "Clear cache on search change",
	render: (props) => <ClearCacheOnSearchChange {...props} />,
};
