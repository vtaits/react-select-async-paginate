import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, waitFor, within } from "@storybook/test";
import type { ChipOption } from "@vkontakte/vkui";
import type { LoadOptions } from "select-async-paginate-model";
import type { ChipsAsyncPaginate } from "../../../src";
import {
	getAllOptions,
	getInput,
	getMenu,
	getMenuOption,
	getMultipleValue,
	openMenu,
	scroll,
	type,
} from "../utils";
import { ReloadOnError, loadOptions } from "./ReloadOnError";

const meta: Meta<typeof ReloadOnError> = {
	title: "select-async-paginage-vkui/ChipsAsyncPaginate/Reload on Error",
	component: ReloadOnError,
};
export default meta;
type Story = StoryObj<typeof ChipsAsyncPaginate>;
type TestLoadOptions = LoadOptions<ChipOption, unknown>;

export const ReloadOnErrorInteraction: Story = {
	name: "Interaction",
	args: {
		loadOptions: fn(loadOptions as TestLoadOptions),
		reloadOnErrorTimeout: 1000,
	},
	play: async ({ canvasElement, step, args }) => {
		const { loadOptions, reloadOnErrorTimeout = 2000 } = args;

		const baseTimeout = 3000;
		const waitOptions = {
			timeout: baseTimeout + reloadOnErrorTimeout,
			interval: 400,
		};

		await step("Display drop-down options list", async () => {
			await openMenu(canvasElement);
		});

		await step("Load the 1 page of options", async () => {
			await expect(loadOptions).toHaveBeenCalledTimes(1);

			const [firstOption, lastOption] = await waitFor(
				() => [
					getMenuOption(canvasElement, "Option 1"),
					getMenuOption(canvasElement, "Option 10"),
				],
				waitOptions,
			);

			await expect(firstOption).toBeInTheDocument();
			await expect(lastOption).toBeInTheDocument();
		});

		await step("Scroll and load the 2 page of options", async () => {
			await scroll(canvasElement, 600);

			await waitFor(() => {
				expect(getAllOptions(canvasElement)).toHaveLength(20);
			}, waitOptions);
		});

		await step("Scroll and load the 3 page of options", async () => {
			await scroll(canvasElement, 600);

			await waitFor(() => {
				expect(getAllOptions(canvasElement)).toHaveLength(30);
			}, waitOptions);
		});

		await step("Type option label into the select", async () => {
			const label = "Option 40";
			const select = getInput(canvasElement);

			await type(canvasElement, label);

			await expect(getMenu(canvasElement)).toBeVisible();
			await expect(select).toHaveValue(label);
		});

		await step("Select the specified option from the list", async () => {
			const listbox = getMenu(canvasElement);
			const option = await waitFor(() => {
				return within(listbox).getByRole("option");
			}, waitOptions);

			await userEvent.click(option);
			await expect(listbox).not.toBeVisible();

			await expect(getMultipleValue(canvasElement)).toEqual(["Option 40"]);
		});
	},
};
