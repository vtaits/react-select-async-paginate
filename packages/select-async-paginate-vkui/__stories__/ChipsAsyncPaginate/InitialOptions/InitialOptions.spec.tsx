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
import { InitialOptions, loadOptions } from "./InitialOptions";

describe("InitialOptions", () => {
	test("InitialOptions", async () => {
		const loadOptionsProp = vi.fn(loadOptions);

		const screen = render(<InitialOptions loadOptions={loadOptionsProp} />);

		// Display drop-down options list
		await openMenu(screen);

		// Page 1 is displayed without loading
		expect(loadOptionsProp).toHaveBeenCalledTimes(0);

		expect(getMenuOption(screen, "Option 1")).toBeInTheDocument();
		expect(getMenuOption(screen, "Option 10")).toBeInTheDocument();

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

		// Select the specified option from the list
		await listbox.getByRole("option").click();
		await expect.element(listbox).not.toBeInTheDocument();

		await vi.waitFor(() => {
			expect(getMultipleValue(screen)).toEqual(["Option 40"]);
		});
	});
});
