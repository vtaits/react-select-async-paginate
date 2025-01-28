import type { Meta, StoryObj } from "@storybook/react";
import { RequestByPageNumber } from "./RequestByPageNumber";

const meta: Meta<typeof RequestByPageNumber> = {
	title: "select-async-paginage-vkui/ChipsAsyncPaginate/Request by Page Number",
	component: RequestByPageNumber,
};
export default meta;
type Story = StoryObj<typeof RequestByPageNumber>;

export const RequestByPageNumberStory: Story = {
	name: "Component",
	render: (props) => <RequestByPageNumber {...props} />,
};
