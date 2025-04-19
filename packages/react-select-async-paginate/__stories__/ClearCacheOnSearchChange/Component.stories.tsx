import type { Meta, StoryObj } from "@storybook/react";
import { ClearCacheOnSearchChange } from "./ClearCacheOnSearchChange";

const meta: Meta<typeof ClearCacheOnSearchChange> = {
	title: "react-select-async-paginate/Clear cache on search change",
	component: ClearCacheOnSearchChange,
};
export default meta;
type Story = StoryObj<typeof ClearCacheOnSearchChange>;

export const ClearCacheOnSearchChangeStory: Story = {
	name: "Component",
	render: (props) => <ClearCacheOnSearchChange {...props} />,
};
