import { expect, test, vi } from "vitest";
import { onLoadSuccess } from "./onLoadSuccess";

const params = {
	loadOptions: vi.fn(),
};

test("should throw an error if cache for current `inputValue` is not defined", () => {
	expect(() => {
		onLoadSuccess(
			{
				inputValue: "",
				menuIsOpen: false,
				cache: {
					test1: {
						hasMore: false,
						isFirstLoad: false,
						isLoading: false,
						options: [1, 2, 3],
						lockedUntil: 0,
					},
				},
			},
			params,
			{
				inputValue: "test2",
				response: {
					options: [],
				},
			},
		);
	}).toThrow();
});

test("should set next options by default and `hasMore` = true", () => {
	const result = onLoadSuccess(
		{
			inputValue: "",
			menuIsOpen: false,
			cache: {
				test: {
					hasMore: false,
					isFirstLoad: false,
					isLoading: false,
					options: [1, 2, 3],
					additional: "prevValue",
					lockedUntil: 0,
				},
			},
		},
		params,
		{
			inputValue: "test",
			response: {
				options: [4, 5, 6],
				hasMore: true,
			},
		},
	);

	expect(result).toEqual({
		inputValue: "",
		menuIsOpen: false,
		cache: {
			test: {
				hasMore: true,
				isFirstLoad: false,
				isLoading: false,
				options: [1, 2, 3, 4, 5, 6],
				additional: "prevValue",
				lockedUntil: 0,
			},
		},
	});
});

test("should set next options by default and `hasMore` = false", () => {
	const result = onLoadSuccess(
		{
			inputValue: "",
			menuIsOpen: false,
			cache: {
				test: {
					hasMore: false,
					isFirstLoad: false,
					isLoading: false,
					options: [1, 2, 3],
					additional: "prevValue",
					lockedUntil: 0,
				},
			},
		},
		params,
		{
			inputValue: "test",
			response: {
				options: [4, 5, 6],
				hasMore: false,
			},
		},
	);

	expect(result).toEqual({
		inputValue: "",
		menuIsOpen: false,
		cache: {
			test: {
				hasMore: false,
				isFirstLoad: false,
				isLoading: false,
				options: [1, 2, 3, 4, 5, 6],
				additional: "prevValue",
				lockedUntil: 0,
			},
		},
	});
});

test("should set next additional", () => {
	const result = onLoadSuccess(
		{
			inputValue: "",
			menuIsOpen: false,
			cache: {
				test: {
					hasMore: false,
					isFirstLoad: false,
					isLoading: false,
					options: [1, 2, 3],
					additional: "prevValue",
					lockedUntil: 0,
				},
			},
		},
		params,
		{
			inputValue: "test",
			response: {
				options: [4, 5, 6],
				hasMore: false,
				additional: "nextValue",
			},
		},
	);

	expect(result).toEqual({
		inputValue: "",
		menuIsOpen: false,
		cache: {
			test: {
				hasMore: false,
				isFirstLoad: false,
				isLoading: false,
				options: [1, 2, 3, 4, 5, 6],
				additional: "nextValue",
				lockedUntil: 0,
			},
		},
	});
});

test("should redefine `reduceOptions`", () => {
	const reduceOptions = vi.fn().mockReturnValue([7, 8, 9]);

	const result = onLoadSuccess(
		{
			inputValue: "",
			menuIsOpen: false,
			cache: {
				test: {
					hasMore: false,
					isFirstLoad: false,
					isLoading: false,
					options: [1, 2, 3],
					additional: "prevValue",
					lockedUntil: 0,
				},
			},
		},
		{
			...params,
			reduceOptions,
		},
		{
			inputValue: "test",
			response: {
				options: [4, 5, 6],
				hasMore: false,
			},
		},
	);

	expect(reduceOptions).toHaveBeenCalledTimes(1);
	expect(reduceOptions).toHaveBeenCalledWith([1, 2, 3], [4, 5, 6], "prevValue");

	expect(result).toEqual({
		inputValue: "",
		menuIsOpen: false,
		cache: {
			test: {
				hasMore: false,
				isFirstLoad: false,
				isLoading: false,
				options: [7, 8, 9],
				additional: "prevValue",
				lockedUntil: 0,
			},
		},
	});
});
