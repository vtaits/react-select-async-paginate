import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, waitFor, within } from "@storybook/test";
import { fn } from "@storybook/test";
import type { GroupBase } from "react-select";
import type { AsyncPaginate, LoadOptions } from "../../src";
import {
	getAllOptions,
	getInput,
	getMenu,
	getSingleValue,
	openMenu,
	scroll,
	type,
} from "../utils";
import { Creatable, loadOptions } from "./Creatable";

const meta: Meta<typeof Creatable> = {
	title: "react-select-async-paginate/Creatable",
	component: Creatable,
};
export default meta;
type Story = StoryObj<typeof AsyncPaginate>;
type TestLoadOptions = LoadOptions<unknown, GroupBase<unknown>, unknown>;

export const CreatableInteraction: Story = {
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
		const label = "New Option";

		await step("Type custom option label into the select", async () => {
			const select = getInput(canvasElement);

			await type(canvasElement, label);

			await expect(select).toHaveValue(label);
			await expect(getMenu(canvasElement)).toBeVisible();
			await expect(loadOptions).toHaveBeenCalledTimes(label.length + 1);
		});

		await step("Create new custom option", async () => {
			const listbox = getMenu(canvasElement);

			const createOption = await waitFor(async () => {
				return canvas.getByText(`Create "${label}"`);
			}, waitOptions);

			await userEvent.click(createOption, { delay: delay.click });

			await expect(getSingleValue(canvasElement)).toHaveTextContent(label);
			await expect(listbox).not.toBeVisible();
		});

		await step("Display drop-down options list", async () => {
			await openMenu(canvasElement);
		});

		await step("Load the 1 page of options", async () => {
			const [firstOption, lastOption] = await waitFor(
				() => [canvas.getByText("Option 1"), canvas.getByText("Option 10")],
				waitOptions,
			);

			await expect(firstOption).toBeInTheDocument();
			await expect(lastOption).toBeInTheDocument();
		});

		await step("Scroll and load the 2 page of options", async () => {
			await scroll(canvasElement, 500);

			await expect(getSingleValue(canvasElement)).toHaveTextContent(label);
			await waitFor(() => {
				expect(getAllOptions(canvasElement)).toHaveLength(20);
			}, waitOptions);
		});

		await step("Scroll and load the 3 page of options", async () => {
			await scroll(canvasElement, 500);

			await expect(getSingleValue(canvasElement)).toHaveTextContent(label);
			await waitFor(() => {
				expect(getAllOptions(canvasElement)).toHaveLength(30);
			}, waitOptions);
		});

		await step("Type option label into the select", async () => {
			const label = "Option 40";
			const select = getInput(canvasElement);
			const listbox = getMenu(canvasElement);

			await type(canvasElement, label);

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
	},
};
