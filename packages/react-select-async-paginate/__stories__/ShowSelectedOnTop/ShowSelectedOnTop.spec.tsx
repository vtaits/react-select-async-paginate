import { describe, expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import {
	getAllOptions,
	getInput,
	getMenu,
	getMenuOption,
	getSingleValue,
	openMenu,
	scroll,
} from "../testUtils";
import { loadOptions, ShowSelectedOnTop } from "./ShowSelectedOnTop";

describe("ShowSelectedOnTop", () => {
	test("Single", async () => {
		const loadOptionsProp = vi.fn(loadOptions);

		const screen = render(
			<ShowSelectedOnTop
				hideSelectedOptions={false}
				loadOptions={loadOptionsProp}
			/>,
		);

		// Display drop-down options list
		await openMenu(screen);

		// Load the 1 page of options
		await vi.waitFor(() => {
			expect(loadOptionsProp).toHaveBeenCalledTimes(1);
		});

		const firstOption = getMenuOption(screen, "Option 1");
		const lastOption = getMenuOption(screen, "Option 10");

		await expect.element(firstOption).toBeInTheDocument();
		await expect.element(lastOption).toBeInTheDocument();

		// Scroll and load the 2 page of options
		await scroll(screen, 500);

		await vi.waitFor(() => {
			expect(getAllOptions(screen).all()).toHaveLength(20);
		});

		// Select `Option 15` from the list
		const listbox = getMenu(screen);

		await listbox.getByText("Option 15").click();
		await expect.element(listbox).not.toBeInTheDocument();

		const resultOption = getSingleValue(screen);
		await expect.element(resultOption).toHaveTextContent("Option 15");

		// Check if `Option 15` is on top of the list
		const input = getInput(screen);

		await input.click();

		expect(listbox.getByRole("option").nth(0)).toHaveTextContent("Option 15");
	});

	test("Multiple", async () => {
		const loadOptionsProp = vi.fn(loadOptions);

		const screen = render(
			<ShowSelectedOnTop
				hideSelectedOptions={false}
				isMulti
				closeMenuOnSelect={false}
				loadOptions={loadOptionsProp}
			/>,
		);

		// Display drop-down options list
		const input = getInput(screen);

		await input.click();

		await expect.element(getMenu(screen)).toBeInTheDocument();

		// Load the 1 page of options
		await vi.waitFor(() => {
			expect(loadOptionsProp).toHaveBeenCalledTimes(1);
		});

		const firstOption = getMenuOption(screen, "Option 1");
		const lastOption = getMenuOption(screen, "Option 10");

		await expect.element(firstOption).toBeInTheDocument();
		await expect.element(lastOption).toBeInTheDocument();

		// Scroll and load the 2 page of options
		await scroll(screen, 500);

		await vi.waitFor(() => {
			expect(getAllOptions(screen).all()).toHaveLength(20);
		});

		// Select `Option 7` and `Option 15` from the list
		const listbox = getMenu(screen);

		await listbox.getByText("Option 7").click();
		await listbox.getByText("Option 15").click();

		// Check if `Option 7` and `Option 15` are on top of the list
		expect(listbox.getByRole("option").nth(0)).toHaveTextContent("Option 7");
		expect(listbox.getByRole("option").nth(1)).toHaveTextContent("Option 15");
	});
});
