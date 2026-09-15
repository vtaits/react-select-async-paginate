import { unwrap } from "krustykrab";
import { describe, expect, test, vi } from "vitest";
import { type RenderResult, render } from "vitest-browser-react";
import {
	getAllOptions,
	getInput,
	getMenu,
	getMenuOption,
	getSingleValue,
	openMenu,
	type,
} from "../testUtils";
import { loadOptions, MenuPlacement } from "./MenuPlacement";

// `scroll` from testUtils sets an absolute `scrollTop`. With `menuPlacement="auto"`
// the menu height depends on the available space, so a fixed offset is not always
// past the load-more threshold - always scroll to the actual bottom here.
async function scrollToBottom(screen: RenderResult) {
	const menu = unwrap(getMenu(screen).query());

	menu.scrollTop = menu.scrollHeight;
}

describe("MenuPlacement", () => {
	test("MenuPlacement", async () => {
		const loadOptionsProp = vi.fn(loadOptions);

		const screen = render(<MenuPlacement loadOptions={loadOptionsProp} />);

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
		await scrollToBottom(screen);

		await vi.waitFor(() => {
			expect(getAllOptions(screen).all()).toHaveLength(20);
		});

		// Scroll and load the 3 page of options
		await scrollToBottom(screen);

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
		await listbox.getByRole("option").click();
		await expect.element(listbox).not.toBeInTheDocument();

		const resultOption = getSingleValue(screen);
		await expect.element(resultOption).toHaveTextContent("Option 40");
	});

	test("keeps the menu placed on top while loading more options", async () => {
		const loadOptionsProp = vi.fn(loadOptions);

		const screen = render(<MenuPlacement loadOptions={loadOptionsProp} />);

		await openMenu(screen);

		// The first load grows the menu from the loading message to its full
		// height, so the placement has to be recounted and end up on top.
		await vi.waitFor(() => {
			expect(getAllOptions(screen).all()).toHaveLength(10);
		});

		const menuEl = unwrap(getMenu(screen).query()).closest(
			'[class*="-menu"]',
		) as HTMLElement;

		expect(menuEl).toBeTruthy();

		const topAfterFirstLoad = menuEl.getBoundingClientRect().top;

		// Placed above the control: the menu fits the viewport instead of
		// overflowing below it.
		expect(topAfterFirstLoad).toBeGreaterThanOrEqual(0);
		expect(menuEl.getBoundingClientRect().bottom).toBeLessThanOrEqual(
			window.innerHeight,
		);

		// Loading more options must not move or remount the menu. The jump was
		// transient - it lasted only while the request was in flight - so sample
		// the position throughout the load instead of just after it.
		const tops = new Set<number>();
		let sampling = true;
		const sampleTop = () => {
			const el = getMenu(screen).query()?.closest('[class*="-menu"]');

			if (el) {
				tops.add(el.getBoundingClientRect().top);
			}

			if (sampling) {
				requestAnimationFrame(sampleTop);
			}
		};
		requestAnimationFrame(sampleTop);

		await scrollToBottom(screen);

		await vi.waitFor(() => {
			expect(getAllOptions(screen).all()).toHaveLength(20);
		});

		sampling = false;

		const menuElAfterLoadMore = unwrap(getMenu(screen).query()).closest(
			'[class*="-menu"]',
		) as HTMLElement;

		// Not remounted, and never moved at any point during the load.
		expect(menuElAfterLoadMore).toBe(menuEl);
		expect([...tops]).toEqual([topAfterFirstLoad]);
	});
});
