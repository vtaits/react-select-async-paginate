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
	type,
} from "../testUtils";
import { InitialOptions, get } from "./InitialOptions";

describe("InitialOptions", () => {
	test("InitialOptions", async () => {
		const getProp = vi.fn(get) as typeof get;

		const screen = render(<InitialOptions get={getProp} />);

		// Display drop-down options list
		await openMenu(screen);

		// Page 1 is displayed without loading
		const firstOption = getMenuOption(screen, "Option 1");
		const lastOption = getMenuOption(screen, "Option 10");

		await expect.element(firstOption).toBeInTheDocument();
		await expect.element(lastOption).toBeInTheDocument();

		expect(getProp).toHaveBeenCalledTimes(0);

		// Scroll and load the 2 page of options
		await scroll(screen, 500);

		await vi.waitFor(() => {
			expect(getAllOptions(screen).all()).toHaveLength(20);
		});

		// Scroll and load the 3 page of options
		await scroll(screen, 500);

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

		const resultOption = getSingleValue(screen);
		await expect.element(resultOption).toHaveTextContent("Option 40");
	});
});
