import type { Meta, StoryObj } from "@storybook/react";
import { ClearCacheOnMenuClose } from "./ClearCacheOnMenuClose";

const meta: Meta<typeof ClearCacheOnMenuClose> = {
	title: "react-select-async-paginate/Clear cache on menu close",
	component: ClearCacheOnMenuClose,
};
export default meta;
type Story = StoryObj<typeof ClearCacheOnMenuClose>;

export const ClearCacheOnMenuCloseStory: Story = {
	name: "Component",
	render: (props) => <ClearCacheOnMenuClose {...props} />,
};
