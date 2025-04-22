import type { Meta, StoryObj } from "@storybook/react";
import { ReloadOnError } from "./ReloadOnError";

const meta: Meta<typeof ReloadOnError> = {
	title: "react-select-async-paginate",
	component: ReloadOnError,
};
export default meta;
type Story = StoryObj<typeof ReloadOnError>;

export const ReloadOnErrorStory: Story = {
	name: "Reload on Error",
	render: (props) => <ReloadOnError {...props} />,
};
