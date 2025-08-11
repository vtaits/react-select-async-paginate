import { expect, test } from "vitest";
import { reset } from "./reset";

test("should reset cache", () => {
	expect(
		reset({
			inputValue: "input",
			menuIsOpen: true,
			cache: {
				test: {
					hasMore: false,
					isFirstLoad: false,
					isLoading: false,
					options: [1, 2, 3],
					lockedUntil: 0,
				},
			},
			optionsDict: {},
		}),
	).toEqual({
		inputValue: "input",
		menuIsOpen: true,
		cache: {},
		optionsDict: {},
	});
});
