import { describe, expect, test, vi } from "vitest";
import { type RenderResult, render } from "vitest-browser-react";
import {
	getAllOptions,
	getInput,
	getMenu,
	getMenuOption,
	getSingleValue,
	scroll,
	type,
} from "../testUtils";
import { Manual, get } from "./Manual";

function getCloseOpenMenuButton(screen: RenderResult) {
	return screen.getByRole("button", { name: /Open menu/i });
}

function getCloseCloseMenuButton(screen: RenderResult) {
	return screen.getByRole("button", { name: /Close menu/i });
}

describe("Manual", () => {
	test("Manual", async () => {
		const getProp = vi.fn(get) as typeof get;

		const screen = render(<Manual get={getProp} />);

		// Manual display drop-down options list
		const openButton = getCloseOpenMenuButton(screen);

		await openButton.click();

		await expect.element(getMenu(screen)).toBeInTheDocument();

		// Manual close drop-down options list
		const listbox = getMenu(screen);
		const closeButton = getCloseCloseMenuButton(screen);

		await closeButton.click();

		await expect.element(listbox).not.toBeInTheDocument();

		// Display drop-down options list
		const input = getInput(screen);

		await input.click();

		await expect.element(getMenu(screen)).toBeInTheDocument();

		// Load the 1 page of options
		await vi.waitFor(() => {
			expect(getProp).toHaveBeenCalledTimes(1);
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

		// Scroll and load the 3 page of options
		await scroll(screen, 500);

		await vi.waitFor(() => {
			expect(getAllOptions(screen).all()).toHaveLength(30);
		});

		// Type option label into the select
		const label = "Option 40";

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
