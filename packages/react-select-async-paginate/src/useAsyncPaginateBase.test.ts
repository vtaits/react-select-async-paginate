import { useLazyRef } from "@vtaits/use-lazy-ref";
import { useEffect, useRef, useState } from "react";
import type { GroupBase } from "react-select";
import useIsMountedRef from "use-is-mounted-ref";
import useLatest from "use-latest";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { defaultReduceOptions } from "./defaultReduceOptions";
import { defaultShouldLoadMore } from "./defaultShouldLoadMore";
import { getInitialOptionsCache } from "./getInitialOptionsCache";
import { requestOptions } from "./requestOptions";
import type { OptionsCacheItem, UseAsyncPaginateBaseParams } from "./types";
import { increaseStateId, useAsyncPaginateBase } from "./useAsyncPaginateBase";

vi.mock("react", async () => {
	const actual = await vi.importActual("react");

	return {
		...actual,

		useState: vi.fn().mockReturnValue([1, () => undefined]),

		useEffect: vi.fn(),
		useRef: vi.fn(),

		// biome-ignore lint/complexity/noBannedTypes: supports any function
		useCallback: vi.fn(<T extends Function>(callback: T) => callback),
	};
});

vi.mock("use-is-mounted-ref");
vi.mock("@vtaits/use-lazy-ref");
vi.mock("./getInitialOptionsCache");
vi.mock("./requestOptions");
vi.mock("use-latest");

const mockedUseEffect = vi.mocked(useEffect);
const mockedUseState = vi.mocked(useState);
const mockedUseRef = vi.mocked(useRef);
const mockedGetInitialOptionsCache = vi.mocked(getInitialOptionsCache);
const mockedRequestOptions = vi.mocked(requestOptions);
const mockedUseIsMountedRef = vi.mocked(useIsMountedRef);
const mockedUseLazyRef = vi.mocked(useLazyRef);

const defaultCacheItem: OptionsCacheItem<
	unknown,
	GroupBase<unknown>,
	unknown
> = {
	options: [],
	isLoading: false,
	isFirstLoad: false,
	lockedUntil: 0,
	hasMore: true,
	additional: null,
};

const defaultParams: UseAsyncPaginateBaseParams<
	unknown,
	GroupBase<unknown>,
	unknown
> = {
	loadOptions: () => ({
		options: [],
	}),
	inputValue: "",
	menuIsOpen: false,
};

beforeEach(() => {
	mockedUseRef
		.mockReturnValueOnce({
			current: true,
		})
		.mockReturnValueOnce({
			current: defaultParams,
		});

	mockedUseLazyRef.mockReturnValue({
		current: {},
	});

	mockedRequestOptions.mockResolvedValue(undefined);
});

afterEach(() => {
	vi.clearAllMocks();
});

const mockUseRef = ({
	isInit = {
		current: true,
	},
	params = {
		current: defaultParams,
	},
}: {
	isInit?: {
		current: boolean;
	};

	params?: {
		current: UseAsyncPaginateBaseParams<unknown, GroupBase<unknown>, unknown>;
	};
}) => {
	mockedUseRef.mockReset();

	mockedUseRef.mockReturnValueOnce(isInit).mockReturnValueOnce(params);
};

beforeEach(() => {
	mockedUseIsMountedRef.mockReturnValue({
		current: false,
	});

	vi.mocked(useLatest).mockImplementation((value) => ({
		current: value,
	}));
});

afterEach(() => {
	vi.clearAllMocks();
});

describe("increaseStateId", () => {
	test("should increase value", () => {
		expect(increaseStateId(1)).toBe(2);
	});
});

describe("useAsyncPaginateBase", () => {
	test("should call getInitialOptionsCache on init", () => {
		mockedGetInitialOptionsCache.mockReset();
		mockedGetInitialOptionsCache.mockReturnValue({});

		const options = [
			{
				label: "label 1",
				value: "value 1",
			},
		];

		const defaultOptions = [
			{
				label: "label 2",
				value: "value 2",
			},
			{
				label: "label 3",
				value: "value 3",
			},
		];

		const additional = {
			page: 2,
		};

		useAsyncPaginateBase({
			...defaultParams,
			options,
			defaultOptions,
			additional,
		});

		const initFn = mockedUseLazyRef.mock.calls[0][0];
		initFn();

		expect(getInitialOptionsCache).toHaveBeenCalledTimes(1);
		expect(getInitialOptionsCache).toHaveBeenCalledWith({
			...defaultParams,
			options,
			defaultOptions,
			additional,
		});
	});

	test("should provide deps to first useEffect", async () => {
		const deps = [1, 2, 3];

		useAsyncPaginateBase(defaultParams, deps);

		expect(mockedUseEffect.mock.calls[0][1]).toBe(deps);
	});

	test('should not load options from first useEffect if "defaultOptions" is not true', async () => {
		useAsyncPaginateBase({
			...defaultParams,
			defaultOptions: [],
		});

		mockedUseEffect.mock.calls[0][0]();

		expect(requestOptions).toHaveBeenCalledTimes(0);
	});

	test('should load options from first useEffect if "defaultOptions" is true', async () => {
		useAsyncPaginateBase({
			...defaultParams,
			defaultOptions: true,
		});

		mockedUseEffect.mock.calls[0][0]();

		expect(requestOptions).toHaveBeenCalledTimes(1);
	});

	test("should not reset options cache from first useEffect on initial render", async () => {
		const setStateId = vi.fn();
		mockedUseState.mockReturnValue([1, setStateId]);

		const isInit = {
			current: true,
		};

		const optionsCache = {
			current: {
				test: defaultCacheItem,
			},
		};

		mockUseRef({
			isInit,
		});

		mockedUseLazyRef.mockReturnValueOnce(optionsCache);

		useAsyncPaginateBase(defaultParams);

		mockedUseEffect.mock.calls[0][0]();

		expect(isInit.current).toBe(false);
		expect(optionsCache.current).toEqual({
			test: defaultCacheItem,
		});
		expect(setStateId).toHaveBeenCalledTimes(0);
	});

	test("should reset options cache from first useEffect on not initial render", async () => {
		const setStateId = vi.fn();
		mockedUseState.mockReturnValue([1, setStateId]);

		const isInit = {
			current: false,
		};

		const optionsCache = {
			current: {
				test: {
					options: [],
					isLoading: false,
					isFirstLoad: false,
					hasMore: true,
					additional: null,
				},
			},
		};

		mockUseRef({
			isInit,
		});

		mockedUseLazyRef.mockReturnValueOnce(optionsCache);

		useAsyncPaginateBase(defaultParams);

		mockedUseEffect.mock.calls[0][0]();

		expect(isInit.current).toBe(false);
		expect(optionsCache.current).toEqual({});
		expect(setStateId).toHaveBeenCalledTimes(1);
		expect(setStateId).toHaveBeenCalledWith(increaseStateId);
	});

	test("should provide inputValue as dependency to second useEffect", async () => {
		useAsyncPaginateBase({
			...defaultParams,
			inputValue: "test",
		});

		expect(mockedUseEffect.mock.calls[1][1]?.[1]).toBe("test");
	});

	test("should load options on inputValue change if options are not cached if menu is open", async () => {
		useAsyncPaginateBase({
			...defaultParams,
			inputValue: "test",
			menuIsOpen: true,
		});

		mockedUseEffect.mock.calls[1][0]();

		expect(requestOptions).toHaveBeenCalledTimes(1);
	});

	test("should not load options on inputValue change if options are not cached if menu is not open", async () => {
		useAsyncPaginateBase({
			...defaultParams,
			inputValue: "test",
			menuIsOpen: false,
		});

		mockedUseEffect.mock.calls[1][0]();

		expect(requestOptions).toHaveBeenCalledTimes(0);
	});

	test("should not load options on inputValue change if options are cached", async () => {
		mockedUseLazyRef.mockReturnValueOnce({
			current: {
				test: {
					options: [
						{
							value: 1,
							label: "1",
						},

						{
							value: 2,
							label: "2",
						},
					],
					hasMore: true,
					isLoading: false,
					isFirstLoad: false,
				},
			},
		});

		useAsyncPaginateBase({
			...defaultParams,
			inputValue: "test",
		});

		mockedUseEffect.mock.calls[1][0]();

		expect(requestOptions).toHaveBeenCalledTimes(0);
	});

	test("should provide menuIsOpen as dependency to third useEffect", async () => {
		useAsyncPaginateBase({
			...defaultParams,
			menuIsOpen: true,
		});

		expect(mockedUseEffect.mock.calls[2][1]?.[2]).toBe(true);
	});

	test("should not load options from third useEffect if menuIsOpen is false", async () => {
		useAsyncPaginateBase({
			...defaultParams,
			menuIsOpen: false,
		});

		mockedUseEffect.mock.calls[2][0]();

		expect(requestOptions).toHaveBeenCalledTimes(0);
	});

	test("should not load options from third useEffect if optionsCache defined for empty search", async () => {
		mockedUseLazyRef.mockReturnValueOnce({
			current: {
				"": {
					options: [],
					hasMore: true,
					isLoading: false,
					isFirstLoad: false,
				},
			},
		});

		useAsyncPaginateBase({
			...defaultParams,
			menuIsOpen: true,
		});

		mockedUseEffect.mock.calls[2][0]();

		expect(requestOptions).toHaveBeenCalledTimes(0);
	});

	test("should not load options from third useEffect if loadOptionsOnMenuOpen is false", async () => {
		useAsyncPaginateBase({
			...defaultParams,
			loadOptionsOnMenuOpen: false,
			menuIsOpen: true,
		});

		mockedUseEffect.mock.calls[2][0]();

		expect(requestOptions).toHaveBeenCalledTimes(0);
	});

	test("should load options from third useEffect", async () => {
		useAsyncPaginateBase({
			...defaultParams,
			menuIsOpen: true,
		});

		mockedUseEffect.mock.calls[2][0]();

		expect(requestOptions).toHaveBeenCalledTimes(1);
	});

	test("should not load options on scroll to bottom if cache not defined for current search", async () => {
		const result = useAsyncPaginateBase({
			...defaultParams,
			inputValue: "test",
		});

		result.handleScrolledToBottom();

		expect(requestOptions).toHaveBeenCalledTimes(0);
	});

	test("should load options on scroll to bottom if cache defined for current search", async () => {
		mockedUseLazyRef.mockReturnValueOnce({
			current: {
				test: {
					options: [],
					hasMore: true,
					isLoading: false,
					isFirstLoad: false,
				},
			},
		});

		const result = useAsyncPaginateBase({
			...defaultParams,
			inputValue: "test",
		});

		result.handleScrolledToBottom();

		expect(requestOptions).toHaveBeenCalledTimes(1);
	});

	test("should provide default shouldLoadMore", async () => {
		const result = useAsyncPaginateBase(defaultParams);

		expect(result.shouldLoadMore).toBe(defaultShouldLoadMore);
	});

	test("should provide redefined shouldLoadMore", async () => {
		const shouldLoadMore = vi.fn();

		const result = useAsyncPaginateBase({
			...defaultParams,
			shouldLoadMore,
		});

		expect(result.shouldLoadMore).toBe(shouldLoadMore);
	});

	test("should provide default filterOption", async () => {
		const result = useAsyncPaginateBase(defaultParams);

		expect(result.filterOption).toBe(null);
	});

	test("should provide redefined filterOption", async () => {
		const filterOption = vi.fn();

		const result = useAsyncPaginateBase({
			...defaultParams,
			filterOption,
		});

		expect(result.filterOption).toBe(filterOption);
	});

	test("should provide initial params if cache not defined for current search", async () => {
		const result = useAsyncPaginateBase({
			...defaultParams,
			inputValue: "test",
		});

		expect(result.isLoading).toBe(false);
		expect(result.isFirstLoad).toBe(true);
		expect(result.options).toEqual([]);
	});

	test("should provide params from cache if cache defined for current search", async () => {
		const options = [
			{
				value: 1,
				label: "1",
			},

			{
				value: 2,
				label: "2",
			},
		];

		mockedUseLazyRef.mockReturnValueOnce({
			current: {
				test: {
					options,
					hasMore: true,
					isLoading: true,
					isFirstLoad: false,
				},
			},
		});

		const result = useAsyncPaginateBase({
			...defaultParams,
			inputValue: "test",
		});

		expect(result.isLoading).toBe(true);
		expect(result.isFirstLoad).toBe(false);
		expect(result.options).toEqual(options);
	});

	test("should provide default reduceOptions to requestOptions", async () => {
		mockedUseLazyRef.mockReturnValueOnce({
			current: {
				test: {
					options: [],
					hasMore: true,
					isLoading: false,
					isFirstLoad: false,
				},
			},
		});

		const result = useAsyncPaginateBase({
			...defaultParams,
			inputValue: "test",
		});

		result.handleScrolledToBottom();

		expect(requestOptions).toHaveBeenCalledTimes(1);
		expect(mockedRequestOptions.mock.calls[0][5]).toBe(defaultReduceOptions);
	});

	test("should provide redefined reduceOptions to requestOptions", async () => {
		const reduceOptions = vi.fn();

		mockedUseLazyRef.mockReturnValueOnce({
			current: {
				test: {
					options: [],
					hasMore: true,
					isLoading: false,
					isFirstLoad: false,
				},
			},
		});

		const result = useAsyncPaginateBase({
			...defaultParams,
			inputValue: "test",
			reduceOptions,
		});

		result.handleScrolledToBottom();

		expect(requestOptions).toHaveBeenCalledTimes(1);
		expect(mockedRequestOptions.mock.calls[0][5]).toBe(reduceOptions);
	});

	test("should reduce change cached options and set next increase state id if mounted", async () => {
		const reduceState = vi.fn().mockReturnValue({
			test2: defaultCacheItem,
		});

		const setStateId = vi.fn();
		mockedUseState.mockReturnValue([1, setStateId]);

		const optionsCache = {
			current: {
				test1: defaultCacheItem,
			},
		};

		mockedUseLazyRef.mockReturnValueOnce(optionsCache);

		mockedUseIsMountedRef.mockReturnValue({
			current: true,
		});

		const result = useAsyncPaginateBase({
			...defaultParams,
			inputValue: "test1",
		});

		result.handleScrolledToBottom();

		mockedRequestOptions.mock.calls[0][4](reduceState);

		expect(reduceState).toHaveBeenCalledTimes(1);
		expect(reduceState).toHaveBeenCalledWith({
			test1: defaultCacheItem,
		});

		expect(optionsCache.current).toEqual({
			test2: defaultCacheItem,
		});

		expect(setStateId).toHaveBeenCalledTimes(1);
		expect(setStateId).toHaveBeenCalledWith(increaseStateId);
	});

	test("should reduce change cached options and not set next increase state id if not mounted", async () => {
		const reduceState = vi.fn().mockReturnValue({
			test2: defaultCacheItem,
		});

		const setStateId = vi.fn();
		mockedUseState.mockReturnValue([1, setStateId]);

		const optionsCache = {
			current: {
				test1: defaultCacheItem,
			},
		};

		mockedUseLazyRef.mockReturnValueOnce(optionsCache);

		const result = useAsyncPaginateBase({
			...defaultParams,
			inputValue: "test1",
		});

		result.handleScrolledToBottom();

		mockedRequestOptions.mock.calls[0][4](reduceState);

		expect(reduceState).toHaveBeenCalledTimes(1);
		expect(reduceState).toHaveBeenCalledWith({
			test1: defaultCacheItem,
		});

		expect(optionsCache.current).toEqual({
			test2: defaultCacheItem,
		});

		expect(setStateId).toHaveBeenCalledTimes(0);
	});
});
