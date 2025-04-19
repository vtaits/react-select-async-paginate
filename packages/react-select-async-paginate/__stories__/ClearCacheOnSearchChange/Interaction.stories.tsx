import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, waitFor } from "@storybook/test";
import type { GroupBase } from "react-select";
import type { AsyncPaginate, LoadOptions } from "../../src";
import {
	clearText,
	getAllOptions,
	getMenuOption,
	openMenu,
	scroll,
	type,
} from "../utils";
import {
	ClearCacheOnSearchChange,
	loadOptions,
} from "./ClearCacheOnSearchChange";

const meta: Meta<typeof ClearCacheOnSearchChange> = {
	title: "react-select-async-paginate/Clear cache on search change",
	component: ClearCacheOnSearchChange,
};
export default meta;
type Story = StoryObj<typeof AsyncPaginate>;
type TestLoadOptions = LoadOptions<unknown, GroupBase<unknown>, unknown>;

export const DebounceInteraction: Story = {
	name: "Interaction",
	args: {
		loadOptions: fn(loadOptions as TestLoadOptions),
		debounceTimeout: 600,
	},
	play: async ({ canvasElement, step, args }) => {
		const { loadOptions, debounceTimeout = 500 } = args;

		const delay = {
			type: 300,
			click: 400,
		};
		const baseTimeout = 3000;
		const waitOptions = {
			timeout: baseTimeout + debounceTimeout,
		};

		await step("Display drop-down options list", async () => {
			await openMenu(canvasElement);
		});

		await step("Load the 1 page of options", async () => {
			const [firstOption, lastOption] = await waitFor(
				() => [
					getMenuOption(canvasElement, "Option 1"),
					getMenuOption(canvasElement, "Option 10"),
				],
				waitOptions,
			);

			await expect(firstOption).toBeInTheDocument();
			await expect(lastOption).toBeInTheDocument();

			expect(loadOptions).toHaveBeenCalledTimes(1);
		});

		await step("Scroll and load the 2 page of options", async () => {
			await scroll(canvasElement, 500);

			await waitFor(() => {
				expect(getAllOptions(canvasElement)).toHaveLength(20);
			}, waitOptions);

			expect(loadOptions).toHaveBeenCalledTimes(2);
		});

		await step("Type option label into the select", async () => {
			await type(canvasElement, "Option", 0);

			await waitFor(() => {
				expect(loadOptions).toHaveBeenCalledTimes(3);
			}, waitOptions);
		});

		await step("Request empty list again", async () => {
			await clearText(canvasElement);

			await waitFor(
				() => [
					getMenuOption(canvasElement, "Option 1"),
					getMenuOption(canvasElement, "Option 10"),
				],
				waitOptions,
			);

			expect(getAllOptions(canvasElement)).toHaveLength(10);

			expect(loadOptions).toHaveBeenCalledTimes(4);
		});
	},
};
