import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, waitFor, within } from "@storybook/test";
import type { GroupBase } from "react-select";
import type { AsyncPaginate, LoadOptions } from "../../src";
import { getInput, getMenu, getSingleValue, openMenu, type } from "../utils";
import { PreventLoadOnMenuOpen, loadOptions } from "./PreventLoadOnMenuOpen";

const meta: Meta<typeof PreventLoadOnMenuOpen> = {
	title: "react-select-async-paginate/Prevent load on menu open",
	component: PreventLoadOnMenuOpen,
};
export default meta;
type Story = StoryObj<typeof AsyncPaginate>;
type TestLoadOptions = LoadOptions<unknown, GroupBase<unknown>, unknown>;

export const PreventLoadOnMenuOpenInteraction: Story = {
	name: "Interaction",
	args: {
		loadOptions: fn(loadOptions as TestLoadOptions),
		loadOptionsOnMenuOpen: false,
		debounceTimeout: 300,
	},
	play: async ({ canvasElement, step, args }) => {
		const canvas = within(canvasElement);
		const { loadOptions } = args;

		const waitOptions = {
			timeout: 3000,
		};

		await step("Display drop-down options list", async () => {
			await openMenu(canvasElement);
		});

		await step("The list of options is empty", async () => {
			await expect(loadOptions).toHaveBeenCalledTimes(0);

			await expect(
				within(getMenu(canvasElement)).getByText("No options"),
			).toBeVisible();
		});

		await step("Type option label into the select", async () => {
			const label = "Option 40";
			const select = getInput(canvasElement);
			const listbox = getMenu(canvasElement);

			await type(canvasElement, label, 1);

			await expect(listbox).toBeVisible();
			await expect(select).toHaveValue(label);
		});

		await step("Select the specified option from the list", async () => {
			await waitFor(() => {
				expect(loadOptions).toHaveBeenCalledTimes(1);
			});

			const listbox = getMenu(canvasElement);
			const option = await waitFor(() => {
				return within(listbox).getByRole("option");
			}, waitOptions);

			await userEvent.click(option);
			await expect(listbox).not.toBeVisible();

			const resultOption = getSingleValue(canvasElement);
			await expect(resultOption).toHaveTextContent("Option 40");
		});
	},
};
