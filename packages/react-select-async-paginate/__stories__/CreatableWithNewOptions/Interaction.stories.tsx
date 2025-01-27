import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, waitFor, within } from "@storybook/test";
import type { GroupBase } from "react-select";
import type { AsyncPaginate, LoadOptions } from "../../src";
import {
	getAllOptions,
	getInput,
	getMenu,
	getMenuOption,
	getSingleValue,
	openMenu,
	scroll,
	type,
} from "../utils";
import {
	CreatableWithNewOptions,
	loadOptions,
} from "./CreatableWithNewOptions";

const meta: Meta<typeof CreatableWithNewOptions> = {
	title: "react-select-async-paginate/Creatable with New Options",
	component: CreatableWithNewOptions,
};
export default meta;
type Story = StoryObj<typeof AsyncPaginate>;
type TestLoadOptions = LoadOptions<unknown, GroupBase<unknown>, unknown>;

export const CreatableWithNewOptionsInteraction: Story = {
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

		await step("Create new custom option with custom value", async () => {
			const listbox = getMenu(canvasElement);
			const createOption = new RegExp(`^Create\\s*"${label}"$|^${label}$`, "i");
			const resultStr = `Current value is {"label":"${label}","value":"${label}"}`;

			const newOption = await canvas.findByText(createOption);
			await userEvent.click(newOption, { delay: delay.click });
			await expect(listbox).not.toBeVisible();

			await waitFor(() => {
				expect(canvas.getByText(label)).toHaveTextContent(label);
			}, waitOptions);

			await expect(canvas.getByText(resultStr)).toHaveTextContent(label);
		});

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
		});

		await step("Scroll and load the 2 page of options", async () => {
			await scroll(canvasElement, 500);

			await waitFor(() => {
				expect(getAllOptions(canvasElement)).toHaveLength(20);
			}, waitOptions);
		});

		await step("Scroll and load the 3 page of options", async () => {
			await scroll(canvasElement, 500);

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
			const label = "Option";
			const value = 40;
			const targetText = `${label} ${value}`;
			const strResult = `Current value is {"value":${value},"label":"${targetText}"}`;

			const listbox = getMenu(canvasElement);
			const option = await waitFor(() => {
				return within(listbox).getByRole("option");
			}, waitOptions);

			await userEvent.click(option);
			await expect(listbox).not.toBeVisible();

			const resultOption = getSingleValue(canvasElement);
			await expect(resultOption).toHaveTextContent("Option 40");

			await expect(canvas.getByText(strResult)).toHaveTextContent(targetText);
		});
	},
};
