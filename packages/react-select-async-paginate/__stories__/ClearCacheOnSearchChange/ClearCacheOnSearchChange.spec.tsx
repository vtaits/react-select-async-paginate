import { describe, expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import {
	clearText,
	getAllOptions,
	getMenuOption,
	openMenu,
	scroll,
	type,
} from "../testUtils";
import {
	ClearCacheOnSearchChange,
	loadOptions,
} from "./ClearCacheOnSearchChange";

describe("ClearCacheOnSearchChange", () => {
	test("ClearCacheOnSearchChange", async () => {
		const loadOptionsProp = vi.fn(loadOptions);

		const screen = render(
			<ClearCacheOnSearchChange loadOptions={loadOptionsProp} />,
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

		expect(loadOptionsProp).toHaveBeenCalledTimes(2);

		// Type option label into the select
		await type(screen, "Option");

		await vi.waitFor(() => {
			expect(loadOptionsProp).toHaveBeenCalledTimes(3);
		});

		// Request empty list again
		await clearText(screen);

		await expect.element(firstOption).toBeInTheDocument();
		await expect.element(lastOption).toBeInTheDocument();

		expect(getAllOptions(screen).all()).toHaveLength(10);

		expect(loadOptionsProp).toHaveBeenCalledTimes(4);
	});
});
