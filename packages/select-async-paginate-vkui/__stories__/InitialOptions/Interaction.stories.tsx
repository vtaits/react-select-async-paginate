import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, waitFor, within } from "@storybook/test";
import { getAllOptions, getCloseResultOption, scroll } from "../utils";
import type { CustomAsyncPaginate } from "../../src";
import { LoadOptions } from "select-async-paginate-model";
import { InitialOptions, loadOptions } from "./InitialOptions";
import { CustomSelectOptionInterface } from "@vkontakte/vkui";

const meta: Meta<typeof InitialOptions> = {
	title: "select-async-paginage-vkui/Initial Options",
	component: InitialOptions,
};
export default meta;
type Story = StoryObj<typeof CustomAsyncPaginate>;
type TestLoadOptions = LoadOptions<CustomSelectOptionInterface, unknown>;

export const InitialOptionsInteraction: Story = {
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

		await step("Display drop-down options list", async () => {
			const select = canvas.getByRole("combobox");

			await userEvent.click(select, { delay: delay.click });

			await expect(canvas.getByRole("listbox")).toBeVisible();
		});

		await step("Page 1 is displayed without loading", async () => {
			await expect(loadOptions).toHaveBeenCalledTimes(0);
			await expect(canvas.getByText("Option 1")).toBeInTheDocument();
			await expect(canvas.getByText("Option 10")).toBeInTheDocument();
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
