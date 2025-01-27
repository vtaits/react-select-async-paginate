import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, waitFor, within } from "@storybook/test";
import type { Get } from "select-async-paginate-fetch";
import {
	getAllOptions,
	getInput,
	getMenu,
	getSingleValue,
	openMenu,
	scroll,
	type,
} from "../utils";
import { InitialOptions, get } from "./InitialOptions";

const meta: Meta<typeof InitialOptions> = {
	title: "react-select-fetch/Initial Options",
	component: InitialOptions,
};
export default meta;
type Story = StoryObj<typeof InitialOptions>;

export const InitialOptionsInteraction: Story = {
	name: "Interaction",
	args: {
		get: fn(get) as Get,
	},
	play: async ({ canvasElement, step, args }) => {
		const canvas = within(canvasElement);
		const { get } = args;

		const waitOptions = {
			timeout: 3000,
		};

		await step("Display drop-down options list", async () => {
			await openMenu(canvasElement);
		});

		await step("Page 1 is displayed without loading", async () => {
			await expect(get).toHaveBeenCalledTimes(0);
			await expect(canvas.getByText("Option 1")).toBeInTheDocument();
			await expect(canvas.getByText("Option 10")).toBeInTheDocument();
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
