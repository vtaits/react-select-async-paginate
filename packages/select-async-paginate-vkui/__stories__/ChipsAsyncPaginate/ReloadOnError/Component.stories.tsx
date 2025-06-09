import type { Meta, StoryObj } from "@storybook/react-vite";
import { ReloadOnError } from "./ReloadOnError";

const meta: Meta<typeof ReloadOnError> = {
	title: "select-async-paginage-vkui/ChipsAsyncPaginate",
	component: ReloadOnError,
};
export default meta;
type Story = StoryObj<typeof ReloadOnError>;

export const ReloadOnErrorStory: Story = {
	name: "Reload on Error",
	render: (props) => <ReloadOnError {...props} />,
};
