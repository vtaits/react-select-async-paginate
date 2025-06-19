import { describe, expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import {
	getInput,
	getMenu,
	getSingleValue,
	openMenu,
	type,
} from "../testUtils";
import { loadOptions, PreventLoadOnMenuOpen } from "./PreventLoadOnMenuOpen";

describe("PreventLoadOnMenuOpen", () => {
	test("PreventLoadOnMenuOpen", async () => {
		const loadOptionsProp = vi.fn(loadOptions);

		const screen = render(
			<PreventLoadOnMenuOpen
				loadOptionsOnMenuOpen={false}
				loadOptions={loadOptionsProp}
			/>,
		);

		// Display drop-down options list
		await openMenu(screen);

		// The list of options is empty
		expect(loadOptionsProp).toHaveBeenCalledTimes(0);

		expect(getMenu(screen).getByText("No options")).toBeInTheDocument();

		// Type option label into the select
		const label = "Option 40";
		const select = getInput(screen);
		const listbox = getMenu(screen);

		await type(screen, label);

		await expect.element(listbox).toBeInTheDocument();
		await expect.element(select).toHaveValue(label);

		// Select the specified option from the list
		await vi.waitFor(() => {
			expect(loadOptionsProp).toHaveBeenCalledTimes(1);
		});

		await listbox.getByRole("option").click();
		await expect.element(listbox).not.toBeInTheDocument();

		const resultOption = getSingleValue(screen);
		await expect.element(resultOption).toHaveTextContent("Option 40");
	});
});
