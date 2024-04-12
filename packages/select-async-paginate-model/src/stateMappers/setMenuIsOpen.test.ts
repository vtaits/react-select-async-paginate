import { expect, test } from "vitest";
import { setMenuIsOpen } from "./setMenuIsOpen";

test("should set `menuIsOpen`", () => {
	expect(
		setMenuIsOpen(
			{
				inputValue: "test1",
				menuIsOpen: true,
				cache: {
					test: {
						hasMore: false,
						isFirstLoad: false,
						isLoading: false,
						options: [1, 2, 3],
					},
				},
			},
			{
				menuIsOpen: false,
			},
		),
	).toEqual({
		inputValue: "test1",
		menuIsOpen: false,
		cache: {
			test: {
				hasMore: false,
				isFirstLoad: false,
				isLoading: false,
				options: [1, 2, 3],
			},
		},
	});
});
