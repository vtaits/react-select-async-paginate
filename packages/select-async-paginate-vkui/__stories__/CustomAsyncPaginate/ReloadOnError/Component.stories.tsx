import type { Meta, StoryObj } from "@storybook/react";
import { ReloadOnError } from "./ReloadOnError";

const meta: Meta<typeof ReloadOnError> = {
	title: "select-async-paginage-vkui/CustomAsyncPaginate/Reload on Error",
	component: ReloadOnError,
};
export default meta;
type Story = StoryObj<typeof ReloadOnError>;

export const ReloadOnErrorStory: Story = {
	name: "Component",
	render: (props) => <ReloadOnError {...props} />,
};
