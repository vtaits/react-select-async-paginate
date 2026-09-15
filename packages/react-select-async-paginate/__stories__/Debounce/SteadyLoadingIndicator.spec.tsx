import sleep from "sleep-promise";
import { describe, expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import { getInput, openMenu, type } from "../testUtils";
import { Debounce, loadOptions } from "./Debounce";

const isLoadingIndicator = (node: Node) =>
	node.nodeType === 1 &&
	`${(node as Element).className}`.includes("loadingIndicator");

describe("SteadyLoadingIndicator", () => {
	test("keeps the loading indicator mounted across keystrokes", async () => {
		const loadOptionsProp = vi.fn(loadOptions);

		const screen = render(
			<Debounce debounceTimeout={150} loadOptions={loadOptionsProp} />,
		);

		await openMenu(screen);

		// Wait for the initial load to settle, so the indicator is gone and any
		// mutation observed later belongs to the typing sequence.
		await vi.waitFor(() => {
			expect(loadOptionsProp).toHaveBeenCalledTimes(1);
		});
		await vi.waitFor(() => {
			expect(
				screen.baseElement.querySelector('[class*="loadingIndicator"]'),
			).toBeNull();
		});

		let removals = 0;
		const observer = new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				for (const node of mutation.removedNodes) {
					if (isLoadingIndicator(node)) {
						removals += 1;
					}
				}
			}
		});
		observer.observe(screen.baseElement, { childList: true, subtree: true });

		// Type several characters, each creating a new `inputValue` key.
		for (const text of ["O", "Op", "Opt", "Opti"]) {
			await type(screen, text);
			await sleep(30);
		}

		observer.disconnect();

		await expect.element(getInput(screen)).toHaveValue("Opti");

		// Once loading has begun, the indicator must stay mounted for the whole
		// sequence. Any unmount restarts its animation, which reads as a flicker.
		expect(removals).toBe(0);
	});
});
