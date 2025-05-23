import type { Meta, StoryObj } from "@storybook/react";
import { RequestByPageNumber } from "./RequestByPageNumber";

const meta: Meta<typeof RequestByPageNumber> = {
	title: "react-select-async-paginate",
	component: RequestByPageNumber,
};
export default meta;
type Story = StoryObj<typeof RequestByPageNumber>;

export const RequestByPageNumberStory: Story = {
	name: "Request by Page Number",
	render: (props) => <RequestByPageNumber {...props} />,
};
