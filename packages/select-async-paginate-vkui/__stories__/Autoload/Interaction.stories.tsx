import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, waitFor, within } from "@storybook/test";
import { getAllOptions, getCloseResultOption, getScrollView, scroll } from "../utils";
import type { CustomAsyncPaginate } from "../../src";
import { LoadOptions } from "select-async-paginate-model";
import { Autoload, loadOptions } from "./Autoload";
import { CustomSelectOptionInterface } from "@vkontakte/vkui";

const meta: Meta<typeof Autoload> = {
	title: "select-async-paginage-vkui/Autoload",
	component: Autoload,
};
export default meta;
type Story = StoryObj<typeof CustomAsyncPaginate>;
type TestLoadOptions = LoadOptions<CustomSelectOptionInterface, unknown>;

export const AutoloadInteraction: Story = {
	name: "Interaction",
	args: {
		loadOptions: fn(loadOptions as TestLoadOptions),
	},
	play: async ({ canvasElement, step, args }) => {
		const canvas = within(canvasElement);
		const { loadOptions } = args;

		const delay = {
			type: 200,
			click: 400,
		};
		const waitOptions = {
			timeout: 3000,
		};

		await step("Autoload the 1 page of options", async () => {
			await waitFor(() => {
				expect(loadOptions).toHaveBeenCalledTimes(1);
			});
		});

		await step("Display drop-down options list", async () => {
			const select = canvas.getByRole("combobox");

			await userEvent.click(select, { delay: delay.click });

			await expect(getScrollView(canvasElement)).toBeVisible();
		});

		await step("Scroll and load the 2 page of options", async () => {
			await scroll(canvasElement, 500);

			await waitFor(() => {
				expect(getAllOptions(canvas)).toHaveLength(20);
			}, waitOptions);
		});

		await step("Scroll and load the 3 page of options", async () => {
			await scroll(canvasElement, 500);

			await waitFor(() => {
				expect(getAllOptions(canvas)).toHaveLength(30);
			}, waitOptions);
		});

		await step("Type option label into the select", async () => {
			const label = "Option 40";
			const select = canvas.getByRole("combobox");
			const listbox = getScrollView(canvasElement);

			await userEvent.type(select, label, { delay: delay.type });

			await expect(listbox).toBeVisible();
			await expect(select).toHaveValue(label);
		});

		await step("Select the specified option from the list", async () => {
			const listbox = getScrollView(canvasElement);
			const option = await waitFor(() => {
				return within(listbox).getByRole("option");
			}, waitOptions);

			await userEvent.click(option);
			await expect(listbox).not.toBeVisible();

			const resultOption = getCloseResultOption(canvas);
			await expect(resultOption).toHaveTextContent("Option 40");
		});
	},
};
