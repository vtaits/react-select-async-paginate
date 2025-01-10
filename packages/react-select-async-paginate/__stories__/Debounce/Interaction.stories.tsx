import type { Meta, StoryObj } from "@storybook/react";
import {
	Mock,
	expect,
	fn,
	mocked,
	spyOn,
	userEvent,
	waitFor,
	within,
} from "@storybook/test";
import type { GroupBase } from "react-select";

import {
	calcDebounceCalls,
	getAllOptions,
	getCloseResultOption,
	scroll,
} from "../utils";

import type { AsyncPaginate, LoadOptions } from "../../src";

import { Debounce, loadOptions } from "./Debounce";

const meta: Meta<typeof Debounce> = {
	title: "react-select-async-paginate/Debounce",
	component: Debounce,
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
		const canvas = within(canvasElement);
		const { loadOptions, debounceTimeout = 500 } = args;
		const mockLoadOptions = mocked(loadOptions);
		let preDebounceCalls = 0;

		const delay = {
			type: 300,
			click: 400,
		};
		const baseTimeout = 3000;
		const waitOptions = {
			timeout: baseTimeout + debounceTimeout,
		};

		await step("Display drop-down options list", async () => {
			const select = canvas.getByRole("combobox");

			await userEvent.click(select, { delay: delay.click });

			await expect(canvas.getByRole("listbox")).toBeVisible();
		});

		await step("Load the 1 page of options", async () => {
			await waitFor(() => {
				expect(loadOptions).toHaveBeenCalledTimes(1);
			});

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

		await step("Scroll and load the 3 page of options", async () => {
			await scroll(canvas, 500);

			await waitFor(() => {
				expect(getAllOptions(canvas)).toHaveLength(30);
			}, waitOptions);

			preDebounceCalls = mockLoadOptions.mock.calls.length;
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

		await step(
			"Verify number of load options calls based on user input",
			async () => {
				const label = "Option 40";
				const inputLength = label.length;
				const inputDelay = delay.type;
				const expectedCalls = calcDebounceCalls(
					debounceTimeout,
					inputLength,
					inputDelay,
				);
				const resultCalls = expectedCalls + preDebounceCalls;

				await expect(mockLoadOptions).toHaveBeenCalledTimes(resultCalls);
			},
		);
	},
};
