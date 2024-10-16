import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, waitFor, within } from "@storybook/test";

import { click, scroll, type } from "../utils";

import type { Get } from "../../src";

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
		const { get: mockGet } = args;

		const delay = {
			type: 200,
			click: 400,
		};
		const waitOptions = {
			timeout: 3000,
		};

		await step("Display drop-down options list", async () => {
			const select = canvas.getByRole("combobox");

			await click(select, { delay: delay.click });

			await waitFor(() => {
				expect(canvas.getByRole("listbox")).toBeVisible();
			}, waitOptions);
		});

		await step("Page 1 is displayed without loading", async () => {
			await waitFor(() => {
				expect(mockGet).toHaveBeenCalledTimes(0);
			});

			await waitFor(() => {
				expect(canvas.getByText("Option 1")).toBeInTheDocument();
			}, waitOptions);

			await waitFor(() => {
				expect(canvas.getByText("Option 10")).toBeInTheDocument();
			}, waitOptions);
		});

		await step("Scroll and load the 2 page of options", async () => {
			const listbox = canvas.getByRole("listbox");

			await scroll(listbox, 500);

			await waitFor(() => {
				const optionPage = canvas.getAllByText(/^Option/i);
				expect(optionPage.length).toBe(20);
			}, waitOptions);
		});

		await step("Scroll and load the 3 page of options", async () => {
			const listbox = canvas.getByRole("listbox");

			await scroll(listbox, 500);

			await waitFor(() => {
				const optionPage = canvas.getAllByText(/^Option/i);
				expect(optionPage.length).toBe(30);
			}, waitOptions);
		});

		await step("Type option label into the select", async () => {
			const label = "Option 40";
			const select = canvas.getByRole("combobox");
			const listbox = canvas.getByRole("listbox");

			await type(select, label, delay.type);

			await waitFor(() => {
				expect(listbox).toBeVisible();
			});

			await waitFor(() => {
				expect(select).toHaveValue(label);
			});
		});

		await step("Select the specified option from the list", async () => {
			const label = "Option 40";
			const listbox = canvas.getByRole("listbox");

			await waitFor(async () => {
				const option = within(listbox).getByRole("option");
				await click(option);
			}, waitOptions);

			await waitFor(async () => {
				expect(listbox).not.toBeVisible();
			});

			await waitFor(async () => {
				const option = canvas.getByText((content, el) => {
					return el !== null && /css-.*-singleValue/.test(el.className);
				});
				expect(option).toHaveTextContent(label);
			});
		});
	},
};
