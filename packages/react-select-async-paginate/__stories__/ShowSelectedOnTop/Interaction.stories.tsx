import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, waitFor, within } from "@storybook/test";
import type { GroupBase } from "react-select";

import { getAllOptions, getCloseResultOption, scroll } from "../utils";

import type { AsyncPaginate, LoadOptions } from "../../src";

import { ShowSelectedOnTop, loadOptions } from "./ShowSelectedOnTop";

const meta: Meta<typeof ShowSelectedOnTop> = {
	title: "react-select-async-paginate/Show selected on top",
	args: {
		hideSelectedOptions: false,
	},
	component: ShowSelectedOnTop,
};
export default meta;
type Story = StoryObj<typeof AsyncPaginate>;
type TestLoadOptions = LoadOptions<unknown, GroupBase<unknown>, unknown>;

export const ShowSingleSelectedOnTopInteraction: Story = {
	name: "Interaction for single",
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

		await step("Display drop-down options list", async () => {
			const select = canvas.getByRole("combobox");

			await userEvent.click(select, { delay: delay.click });

			await expect(canvas.getByRole("listbox")).toBeVisible();
		});

		await step("Load the 1 page of options", async () => {
			await expect(loadOptions).toHaveBeenCalledTimes(1);

			const [firstOption, lastOption] = await waitFor(
				() => [canvas.getByText("Option 1"), canvas.getByText("Option 10")],
				waitOptions,
			);

			await expect(firstOption).toBeInTheDocument();
			await expect(lastOption).toBeInTheDocument();
		});

		await step("Scroll and load the 2 page of options", async () => {
			await scroll(canvas, 500);

			await waitFor(() => {
				expect(getAllOptions(canvas)).toHaveLength(20);
			}, waitOptions);
		});

		await step("Select `Option 15` from the list", async () => {
			const listbox = canvas.getByRole("listbox");

			await userEvent.click(within(listbox).getByText("Option 15"));
			await expect(listbox).not.toBeVisible();

			const resultOption = getCloseResultOption(canvas);
			await expect(resultOption).toHaveTextContent("Option 15");
		});

		await step("Check if `Option 15` is on top of the list", async () => {
			const select = canvas.getByRole("combobox");

			await userEvent.click(select, { delay: delay.click });

			const listbox = await canvas.findByRole("listbox");

			const options = within(listbox).getAllByRole("option");

			expect(options[0]).toHaveTextContent('Option 15');
		});
	},
};

export const ShowMultipleSelectedOnTopInteraction: Story = {
	name: "Interaction for multiple",
	args: {
		isMulti: true,
		closeMenuOnSelect: false,
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

		await step("Display drop-down options list", async () => {
			const select = canvas.getByRole("combobox");

			await userEvent.click(select, { delay: delay.click });

			await expect(canvas.getByRole("listbox")).toBeVisible();
		});

		await step("Load the 1 page of options", async () => {
			await expect(loadOptions).toHaveBeenCalledTimes(1);

			const [firstOption, lastOption] = await waitFor(
				() => [canvas.getByText("Option 1"), canvas.getByText("Option 10")],
				waitOptions,
			);

			await expect(firstOption).toBeInTheDocument();
			await expect(lastOption).toBeInTheDocument();
		});

		await step("Scroll and load the 2 page of options", async () => {
			await scroll(canvas, 500);

			await waitFor(() => {
				expect(getAllOptions(canvas)).toHaveLength(20);
			}, waitOptions);
		});

		await step("Select `Option 7` and `Option 15` from the list", async () => {
			const listbox = canvas.getByRole("listbox");

			await userEvent.click(within(listbox).getByText("Option 7"));
			await userEvent.click(within(listbox).getByText("Option 15"));
		});

		await step("Check if `Option 7` and `Option 15` are on top of the list", async () => {
			const listbox = canvas.getByRole("listbox");

			const options = within(listbox).getAllByRole("option");

			expect(options[0]).toHaveTextContent('Option 7');
			expect(options[1]).toHaveTextContent('Option 15');
		});
	},
};