import { expect, test, vi } from "vitest";
import { getInitialOptionsCache } from "./getInitialOptionsCache";
import { getInitialState } from "./getInitialState";

vi.mock("./getInitialOptionsCache");

const params = {
	loadOptions: vi.fn(),
};

const mockedGetInitialOptionsCache = vi
	.mocked(getInitialOptionsCache)
	.mockReturnValue({
		test: {
			hasMore: false,
			isLoading: false,
			isFirstLoad: true,
			options: [],
			additional: null,
		},
	});

test("should call `getInitialOptionsCache` with correct arguments", () => {
	getInitialState(params);

	expect(mockedGetInitialOptionsCache).toHaveBeenCalledTimes(1);
	expect(mockedGetInitialOptionsCache).toHaveBeenCalledWith(params);
});

test("should set initial params", () => {
	expect(getInitialState(params)).toEqual({
		cache: {
			test: {
				hasMore: false,
				isLoading: false,
				isFirstLoad: true,
				options: [],
				additional: null,
			},
		},
		inputValue: "",
		menuIsOpen: false,
	});
});

test("should set redefined params", () => {
	expect(
		getInitialState({
			...params,
			initialInputValue: "test",
			initialMenuIsOpen: true,
		}),
	).toEqual({
		cache: {
			test: {
				hasMore: false,
				isLoading: false,
				isFirstLoad: true,
				options: [],
				additional: null,
			},
		},
		inputValue: "test",
		menuIsOpen: true,
	});
});
