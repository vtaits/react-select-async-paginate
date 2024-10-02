import type { Meta, StoryObj } from "@storybook/react";
import { Creatable } from "./Creatable";

const meta: Meta<typeof Creatable> = {
  title: "react-select-async-paginate/Creatable",
  component: Creatable,
};
export default meta;
type Story = StoryObj<typeof Creatable>;

export const CreatableStory: Story = {
  name: "Component",
  render: (props) => <Creatable {...props} />,
};
