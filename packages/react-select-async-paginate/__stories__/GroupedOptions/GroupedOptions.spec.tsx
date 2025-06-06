import { describe, expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import {
	getAllGroups,
	getAllOptions,
	getInput,
	getMenu,
	getSingleValue,
	openMenu,
	scroll,
	type,
} from "../testUtils";
import {
	GroupedOptions,
	wrapperdLoadOptions as loadOptions,
} from "./GroupedOptions";

describe("GroupedOptions", () => {
	test("GroupedOptions", async () => {
		const loadOptionsProp = vi.fn(loadOptions);

		const screen = render(<GroupedOptions loadOptions={loadOptionsProp} />);

		// Display drop-down options list
		await openMenu(screen);

		// Load the 1 page of options
		await vi.waitFor(() => {
			expect(loadOptionsProp).toHaveBeenCalledTimes(1);
		});

		const groups = getAllGroups(screen);
		const options = getAllOptions(screen);

		await vi.waitFor(() => {
			expect(groups.all()).toHaveLength(1);
		});

		expect(options.all()).toHaveLength(10);

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
