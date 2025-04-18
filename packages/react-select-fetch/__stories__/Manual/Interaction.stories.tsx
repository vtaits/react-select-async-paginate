import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, waitFor, within } from "@storybook/test";
import type { Get } from "../../src";
import {
	getAllOptions,
	getInput,
	getMenu,
	getMenuOption,
	getSingleValue,
	scroll,
	type,
} from "../utils";
import { Manual, get } from "./Manual";

function getCloseOpenMenuButton(root: HTMLElement) {
	return within(root).getByRole("button", { name: /Open menu/i });
}

function getCloseCloseMenuButton(root: HTMLElement) {
	return within(root).getByRole("button", { name: /Close menu/i });
}

const meta: Meta<typeof Manual> = {
	title: "react-select-fetch/Manual",
	component: Manual,
};
export default meta;
type Story = StoryObj<typeof Manual>;

export const ManualInteraction: Story = {
	name: "Interaction",
	args: {
		get: fn(get) as Get,
	},
	play: async ({ canvasElement, step, args }) => {
		const canvas = within(canvasElement);
		const { get } = args;

		const delay = {
			type: 200,
			click: 400,
		};
		const waitOptions = {
			timeout: 3000,
		};

		await step("Manual display drop-down options list", async () => {
			const button = getCloseOpenMenuButton(canvasElement);

			await userEvent.click(button, { delay: delay.click });

			await expect(getMenu(canvasElement)).toBeVisible();
		});

		await step("Manual close drop-down options list", async () => {
			const listbox = getMenu(canvasElement);
			const button = getCloseCloseMenuButton(canvasElement);

			await userEvent.click(button, { delay: delay.click });

			await expect(listbox).not.toBeVisible();
		});

		await step("Display drop-down options list", async () => {
			const select = getInput(canvasElement);

			await userEvent.click(select, { delay: delay.click });

			await expect(getMenu(canvasElement)).toBeVisible();
		});

		await step("Load the 1 page of options", async () => {
			await expect(get).toHaveBeenCalledTimes(1);

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
