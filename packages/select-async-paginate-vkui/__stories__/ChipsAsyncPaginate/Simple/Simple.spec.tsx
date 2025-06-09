import { describe, expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import {
	getAllOptions,
	getInput,
	getMenu,
	getMenuOption,
	getMultipleValue,
	openMenu,
	scroll,
	type,
} from "../testUtils";
import { Simple, loadOptions } from "./Simple";

describe("Simple", () => {
	test("Simple", async () => {
		const loadOptionsProp = vi.fn(loadOptions);

		const screen = render(<Simple loadOptions={loadOptionsProp} />);

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
		await scroll(screen, 600);

		await vi.waitFor(() => {
			expect(getAllOptions(screen).all()).toHaveLength(20);
		});

		// Scroll and load the 3 page of options
		await scroll(screen, 600);

		await vi.waitFor(() => {
			expect(getAllOptions(screen).all()).toHaveLength(30);
		});

		// Type option label into the select
		const label = "Option 40";
		const input = getInput(screen);
		const listbox = getMenu(screen);

		await type(screen, label);

		await expect.element(listbox).toBeInTheDocument();
		await expect.element(input).toHaveValue(label);

		// Select the specified options from the list
		await getAllOptions(screen).click();
		await expect.element(listbox).not.toBeInTheDocument();

		expect(getMultipleValue(screen)).toEqual(["Option 40"]);

		await openMenu(screen);

		await getMenuOption(screen, "Option 5").click();

		await vi.waitFor(() => {
			expect(getMultipleValue(screen)).toEqual(["Option 40", "Option 5"]);
		});
	});
});
