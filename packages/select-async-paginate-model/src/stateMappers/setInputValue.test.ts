import { expect, test } from "vitest";
import { setInputValue } from "./setInputValue";

test("should set input value", () => {
	expect(
		setInputValue(
			{
				inputValue: "test1",
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
			},
			{
				inputValue: "test2",
				clearCacheOnSearchChange: false,
			},
		),
	).toEqual({
		inputValue: "test2",
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
	});
});

test("should set input value and clear cache", () => {
	expect(
		setInputValue(
			{
				inputValue: "test1",
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
			},
			{
				inputValue: "test2",
				clearCacheOnSearchChange: true,
			},
		),
	).toEqual({
		inputValue: "test2",
		menuIsOpen: true,
		cache: {},
	});
});
