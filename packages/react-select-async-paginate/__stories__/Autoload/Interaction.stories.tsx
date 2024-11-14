import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, waitFor, within } from "@storybook/test";
import type { GroupBase } from "react-select";

import { getAllOptions, getCloseResultOption, scroll } from "../utils";

import type { AsyncPaginate, LoadOptions } from "../../src";

import { Autoload, loadOptions } from "./Autoload";

const meta: Meta<typeof Autoload> = {
	title: "react-select-async-paginate/Autoload",
	component: Autoload,
};
export default meta;
type Story = StoryObj<typeof AsyncPaginate>;
type TestLoadOptions = LoadOptions<unknown, GroupBase<unknown>, unknown>;

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

			await expect(canvas.getByRole("listbox")).toBeVisible();
		});

		await step("Scroll and load the 2 page of options", async () => {
			await scroll(canvas, 500);

			await waitFor(() => {
				expect(getAllOptions(canvas)).toHaveLength(20);
			}, waitOptions);
		});

		await step("Scroll and load the 3 page of options", async () => {
			await scroll(canvas, 500);

			await waitFor(() => {
				expect(getAllOptions(canvas)).toHaveLength(30);
			}, waitOptions);
		});

		await step("Type option label into the select", async () => {
			const label = "Option 40";
			const select = canvas.getByRole("combobox");
			const listbox = canvas.getByRole("listbox");

			await userEvent.type(select, label, { delay: delay.type });

			await expect(listbox).toBeVisible();
			await expect(select).toHaveValue(label);
		});

		await step("Select the specified option from the list", async () => {
			const listbox = canvas.getByRole("listbox");
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
