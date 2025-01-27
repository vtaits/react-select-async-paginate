import type { Meta, StoryObj } from "@storybook/react";
import {
	expect,
	fn,
	mocked,
	userEvent,
	waitFor,
	within,
} from "@storybook/test";
import type { CustomSelectOptionInterface } from "@vkontakte/vkui";
import type { LoadOptions } from "select-async-paginate-model";
import type { CustomAsyncPaginate } from "../../src";
import {
	calcDebounceCalls,
	getAllOptions,
	getInput,
	getMenu,
	getMenuOption,
	getSingleValue,
	openMenu,
	scroll,
	type,
} from "../utils";
import { Debounce, loadOptions } from "./Debounce";

const meta: Meta<typeof Debounce> = {
	title: "select-async-paginage-vkui/Debounce",
	component: Debounce,
};
export default meta;
type Story = StoryObj<typeof CustomAsyncPaginate>;
type TestLoadOptions = LoadOptions<CustomSelectOptionInterface, unknown>;

export const DebounceInteraction: Story = {
	name: "Interaction",
	args: {
		loadOptions: fn(loadOptions as TestLoadOptions),
		debounceTimeout: 600,
	},
	play: async ({ canvasElement, step, args }) => {
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
			await openMenu(canvasElement);
		});

		await step("Load the 1 page of options", async () => {
			await waitFor(() => {
				expect(loadOptions).toHaveBeenCalledTimes(1);
			});

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

			preDebounceCalls = mockLoadOptions.mock.calls.length;
		});

		await step("Type option label into the select", async () => {
			const label = "Option 40";
			const select = getInput(canvasElement);
			const listbox = getMenu(canvasElement);

			await type(canvasElement, label, delay.type);

			await expect(listbox).toBeVisible();
			await expect(select).toHaveValue(label);
		});

		await step("Select the specified option from the list", async () => {
			const listbox = getMenu(canvasElement);
			const option = await waitFor(() => {
				return within(listbox).getByRole("option");
			}, waitOptions);

			await userEvent.click(option);
			await expect(listbox).not.toBeVisible();

			const resultOption = getSingleValue(canvasElement);
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
