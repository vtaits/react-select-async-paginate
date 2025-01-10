import { expect, test, vi } from "vitest";
import { getInitialCache } from "../getInitialCache";
import { setLoading } from "./setLoading";

vi.mock("../getInitialCache");

const mockedGetInitialCache = vi.mocked(getInitialCache);

const params = {
	loadOptions: vi.fn(),
};

test("should set loading state for existed cache item", () => {
	const result = setLoading(
		{
			inputValue: "test1",
			menuIsOpen: true,
			cache: {
				test1: {
					hasMore: false,
					isFirstLoad: false,
					isLoading: false,
					options: [1, 2, 3],
					lockedUntil: 0,
				},

				test2: {
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
			inputValue: "test1",
		},
	);

	expect(mockedGetInitialCache).toHaveBeenCalledTimes(0);

	expect(result).toEqual({
		inputValue: "test1",
		menuIsOpen: true,
		cache: {
			test1: {
				hasMore: false,
				isFirstLoad: false,
				isLoading: true,
				options: [1, 2, 3],
				lockedUntil: 0,
			},

			test2: {
				hasMore: false,
				isFirstLoad: false,
				isLoading: false,
				options: [1, 2, 3],
				lockedUntil: 0,
			},
		},
	});
});

test("should create new cache item and set loading state", () => {
	mockedGetInitialCache.mockReturnValue({
		hasMore: true,
		isFirstLoad: true,
		isLoading: false,
		options: [],
		lockedUntil: 0,
	});

	const result = setLoading(
		{
			inputValue: "test1",
			menuIsOpen: true,
			cache: {
				test2: {
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
			inputValue: "test1",
		},
	);

	expect(mockedGetInitialCache).toHaveBeenCalledTimes(1);
	expect(mockedGetInitialCache).toHaveBeenCalledWith(params);

	expect(result).toEqual({
		inputValue: "test1",
		menuIsOpen: true,
		cache: {
			test1: {
				hasMore: true,
				isFirstLoad: true,
				isLoading: true,
				options: [],
				lockedUntil: 0,
			},

			test2: {
				hasMore: false,
				isFirstLoad: false,
				isLoading: false,
				options: [1, 2, 3],
				lockedUntil: 0,
			},
		},
	});
});
