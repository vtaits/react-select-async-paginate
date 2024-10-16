import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, waitFor, within } from "@storybook/test";

import { click, scroll, type } from "../utils";

import type { Get } from "../../src";

import { CreatableWithNewOptions, get } from "./CreatableWithNewOptions";

const meta: Meta<typeof CreatableWithNewOptions> = {
	title: "react-select-fetch/Creatable with New Options",
	component: CreatableWithNewOptions,
};
export default meta;
type Story = StoryObj<typeof CreatableWithNewOptions>;

export const CreatableWithNewOptionsTest: Story = {
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

		const label = "New Option";

		await step("Type custom option label into the select", async () => {
			const select = canvas.getByRole("combobox");

			await type(select, label, delay.type);

			await waitFor(() => {
				const listbox = canvas.getByRole("listbox");
				expect(listbox).toBeVisible();
			});

			await waitFor(() => {
				expect(select).toHaveValue(label);
			});

			await waitFor(() => {
				expect(mockGet).toHaveBeenCalledTimes(label.length + 1);
			});
		});

		await step("Create new custom option with custom value", async () => {
			const listbox = canvas.getByRole("listbox");

			await waitFor(async () => {
				const createTemplate = new RegExp(
					`^Create\\s*"${label}"$|^${label}$`,
					"i",
				);
				const createdOption = await canvas.findByText(createTemplate);
				await click(createdOption);
			});

			await waitFor(() => {
				expect(listbox).not.toBeVisible();
			});

			await waitFor(() => {
				const createdOption = canvas.getByText(label);
				expect(createdOption).toHaveTextContent(label);
			}, waitOptions);

			await waitFor(() => {
				const strResult = `Current value is {"label":"${label}","value":"${label}"}`;
				const currentValue = canvas.getByText(strResult);
				expect(currentValue).toHaveTextContent(label);
			});
		});

		await step("Display drop-down options list", async () => {
			const select = canvas.getByRole("combobox");

			await click(select, { delay: delay.click });

			await waitFor(() => {
				expect(canvas.getByRole("listbox")).toBeVisible();
			});
		});

		await step("Load the 1 page of options", async () => {
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
			const label = "Option";
			const value = 40;
			const targetText = `${label} ${value}`;
			const strResult = `Current value is {"value":${value},"label":"${targetText}"}`;
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

			await waitFor(async () => {
				const currentOption = canvas.getByText(strResult);
				expect(currentOption).toHaveTextContent(targetText);
			});
		});
	},
};
