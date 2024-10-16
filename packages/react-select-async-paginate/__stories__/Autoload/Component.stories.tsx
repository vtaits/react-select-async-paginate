import type { Meta, StoryObj } from "@storybook/react";

import { Autoload } from "./Autoload";

const meta: Meta<typeof Autoload> = {
	title: "react-select-async-paginate/Autoload",
	component: Autoload,
};
export default meta;
type Story = StoryObj<typeof Autoload>;

export const AutoloadStory: Story = {
	name: "Component",
	render: (props) => <Autoload {...props} />,
};
