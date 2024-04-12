import { expect, test } from "vitest";
import { unsetLoading } from "./unsetLoading";

test("should unset loading state for existed cache item", () => {
	const result = unsetLoading(
		{
			inputValue: "test1",
			menuIsOpen: true,
			cache: {
				test1: {
					hasMore: false,
					isFirstLoad: false,
					isLoading: true,
					options: [1, 2, 3],
				},

				test2: {
					hasMore: false,
					isFirstLoad: false,
					isLoading: true,
					options: [1, 2, 3],
				},
			},
		},
		{
			inputValue: "test1",
			isClean: false,
		},
	);

	expect(result).toEqual({
		inputValue: "test1",
		menuIsOpen: true,
		cache: {
			test1: {
				hasMore: false,
				isFirstLoad: false,
				isLoading: false,
				options: [1, 2, 3],
			},

			test2: {
				hasMore: false,
				isFirstLoad: false,
				isLoading: true,
				options: [1, 2, 3],
			},
		},
	});
});

test("should remove cache item", () => {
	const result = unsetLoading(
		{
			inputValue: "test1",
			menuIsOpen: true,
			cache: {
				test1: {
					hasMore: false,
					isFirstLoad: false,
					isLoading: true,
					options: [1, 2, 3],
				},

				test2: {
					hasMore: false,
					isFirstLoad: false,
					isLoading: true,
					options: [1, 2, 3],
				},
			},
		},
		{
			inputValue: "test1",
			isClean: true,
		},
	);

	expect(result).toEqual({
		inputValue: "test1",
		menuIsOpen: true,
		cache: {
			test2: {
				hasMore: false,
				isFirstLoad: false,
				isLoading: true,
				options: [1, 2, 3],
			},
		},
	});
});

test("should do nothing if cache item not defined for `inputValue`", () => {
	const result = unsetLoading(
		{
			inputValue: "test1",
			menuIsOpen: true,
			cache: {
				test2: {
					hasMore: false,
					isFirstLoad: false,
					isLoading: false,
					options: [1, 2, 3],
				},
			},
		},
		{
			inputValue: "test1",
			isClean: false,
		},
	);

	expect(result).toEqual({
		inputValue: "test1",
		menuIsOpen: true,
		cache: {
			test2: {
				hasMore: false,
				isFirstLoad: false,
				isLoading: false,
				options: [1, 2, 3],
			},
		},
	});
});
