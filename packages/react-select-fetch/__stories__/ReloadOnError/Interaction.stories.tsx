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
import { ReloadOnError, get } from "./ReloadOnError";

const meta: Meta<typeof ReloadOnError> = {
	title: "react-select-fetch/Reload on Error",
	component: ReloadOnError,
};
export default meta;
type Story = StoryObj<typeof ReloadOnError>;

export const ReloadOnErrorInteraction: Story = {
	name: "Interaction",
	args: {
		get: fn(get) as Get,
		reloadOnErrorTimeout: 1000,
	},
	play: async ({ canvasElement, step, args }) => {
		const canvas = within(canvasElement);
		const { get, reloadOnErrorTimeout = 2000 } = args;

		const baseTimeout = 3000;
		const waitOptions = {
			timeout: baseTimeout + reloadOnErrorTimeout,
			interval: 400,
		};

		await step("Display drop-down options list", async () => {
			await openMenu(canvasElement);
		});

		await step("Load the 1 page of options", async () => {
			await expect(get).toHaveBeenCalledTimes(1);

			const [firstOption, lastOption] = await waitFor(
				() => [canvas.getByText("Option 1"), canvas.getByText("Option 10")],
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
