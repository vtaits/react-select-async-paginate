import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, waitFor, within } from "@storybook/test";
import type { GroupBase } from "react-select";

import { click, scroll, type } from "../utils";

import type { AsyncPaginate } from "../../src";
import type { LoadOptions } from "../../src";

import { CustomScrollCheck, loadOptions } from "./CustomScrollCheck";

const meta: Meta<typeof CustomScrollCheck> = {
	title: "react-select-async-paginate/Custom Scroll Check",
	component: CustomScrollCheck,
};
export default meta;
type Story = StoryObj<typeof AsyncPaginate>;
type MockLoadOptions = LoadOptions<unknown, GroupBase<unknown>, unknown>;

export const CustomScrollCheckInteraction: Story = {
	name: "Interaction",
	args: {
		loadOptions: fn(loadOptions as MockLoadOptions),
	},
	play: async ({ canvasElement, step, args }) => {
		const canvas = within(canvasElement);
		const mockLoadOptions = args.loadOptions;

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
			});
		});

		await step("Load the 1 page of options", async () => {
			await waitFor(() => {
				expect(mockLoadOptions).toHaveBeenCalledTimes(1);
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

		await step(
			"Scroll to the half and load the 3 page of options",
			async () => {
				const listbox = canvas.getByRole("listbox");

				await scroll(listbox, 250);

				await waitFor(() => {
					const optionPage = canvas.getAllByText(/^Option/i);
					expect(optionPage.length).toBe(30);
				}, waitOptions);
			},
		);

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
			});

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
