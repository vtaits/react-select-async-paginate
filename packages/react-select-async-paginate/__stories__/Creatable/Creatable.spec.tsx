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
import { Creatable, loadOptions } from "./Creatable";

describe("Creatable", () => {
	test("Creatable", async () => {
		const loadOptionsProp = vi.fn(loadOptions);

		const screen = render(<Creatable loadOptions={loadOptionsProp} />);

		const label = "New Option";

		// Type custom option label into the select
		const input = getInput(screen);

		await type(screen, label);

		await expect.element(input).toHaveValue(label);
		await expect.element(getMenu(screen)).toBeInTheDocument();

		expect(loadOptionsProp).toHaveBeenCalledTimes(1);

		// Create new custom option
		const listbox = getMenu(screen);

		const createOption = screen.getByText(`Create "${label}"`);

		await createOption.click();

		await expect.element(getSingleValue(screen)).toHaveTextContent(label);
		await expect.element(listbox).not.toBeInTheDocument();

		// Display drop-down options list
		await openMenu(screen);

		// Load the 1 page of options
		const firstOption = getMenuOption(screen, "Option 1");
		const lastOption = getMenuOption(screen, "Option 10");

		await expect.element(firstOption).toBeInTheDocument();
		await expect.element(lastOption).toBeInTheDocument();

		// Scroll and load the 2 page of options
		await scroll(screen, 500);

		await expect.element(getSingleValue(screen)).toHaveTextContent(label);
		await vi.waitFor(() => {
			expect(getAllOptions(screen).all()).toHaveLength(20);
		});

		// Scroll and load the 3 page of options
		await scroll(screen, 500);

		await expect.element(getSingleValue(screen)).toHaveTextContent(label);
		await vi.waitFor(() => {
			expect(getAllOptions(screen).all()).toHaveLength(30);
		});

		// Type option label into the select
		const serchLabel = "Option 40";

		await type(screen, serchLabel);

		await expect.element(listbox).toBeVisible();
		await expect.element(input).toHaveValue(serchLabel);

		// Select the specified option from the list
		await listbox.getByRole("option").click();
		await expect.element(listbox).not.toBeInTheDocument();

		const resultOption = getSingleValue(screen);
		await expect.element(resultOption).toHaveTextContent("Option 40");
	});
});
