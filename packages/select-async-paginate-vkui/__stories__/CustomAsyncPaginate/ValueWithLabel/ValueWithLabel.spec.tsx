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
import { loadOptions, ValueWithLabel } from "./ValueWithLabel";

describe("ValueWithLabel", () => {
	test("ValueWithLabel", async () => {
		const loadOptionsProp = vi.fn(loadOptions);

		const screen = render(<ValueWithLabel loadOptions={loadOptionsProp} />);

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
		await expect
			.element(getMenuOption(screen, "Option 23"))
			.toBeInTheDocument();

		// Scroll and load the 2 page of options
		await scroll(screen, 600);

		await vi.waitFor(() => {
			expect(getAllOptions(screen).all()).toHaveLength(21);
		});

		await expect
			.element(getMenuOption(screen, "Option 23"))
			.toBeInTheDocument();

		// Scroll and load the 3 page of options
		await scroll(screen, 600);

		await vi.waitFor(() => {
			expect(getAllOptions(screen).all()).toHaveLength(30);
		});

		// Type option label into the select
		const label = "Option 40";
		const select = getInput(screen);
		const listbox = getMenu(screen);

		await type(screen, label);

		await expect.element(listbox).toBeInTheDocument();
		await expect.element(select).toHaveValue(label);

		// Select the specified option from the list
		const option = await vi.waitFor(() => {
			return getMenuOption(screen, "Option 40");
		});

		await option.click();
		await expect.element(listbox).not.toBeInTheDocument();

		const resultOption = getSingleValue(screen);
		await expect.element(resultOption).toHaveTextContent("Option 40");
	});
});
