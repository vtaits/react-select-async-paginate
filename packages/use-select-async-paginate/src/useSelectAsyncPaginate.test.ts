import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type {
	Model,
	OptionsCacheItem,
	Params,
} from "select-async-paginate-model";
import { createAsyncPaginateModel } from "select-async-paginate-model";
import { beforeEach, expect, test, vi } from "vitest";
import { useSelectAsyncPaginate } from "./useSelectAsyncPaginate";

vi.mock("react");

const mockedUseEffect = vi.mocked(useEffect);
const mockedUseRef = vi.mocked(useRef);
const mockedUseState = vi.mocked(useState);
const mockedUseSyncExternalStore = vi.mocked(useSyncExternalStore);

vi.mock("select-async-paginate-model");

const mockedCreateAsyncPaginateModel = vi.mocked(createAsyncPaginateModel);

const testParams: Params<unknown, unknown> = {
	loadOptions: vi.fn(),
};

const testModel: Model<unknown, unknown> = {
	getCurrentCache: vi.fn(),
	getOptionsDict: vi.fn().mockReturnValue({}),
	handleLoadMore: vi.fn(),
	handleReset: vi.fn(),
	onChangeInputValue: vi.fn(),
	onToggleMenu: vi.fn(),
	subscribe: vi.fn(),
	updateParams: vi.fn(),
};

const testCacheItem: OptionsCacheItem<unknown, unknown> = {
	hasMore: true,
	isFirstLoad: true,
	isLoading: true,
	options: [1, 2, 3],
	additional: null,
	lockedUntil: 0,
};

beforeEach(() => {
	vi.resetAllMocks();

	mockedUseRef.mockReturnValue({
		current: true,
	});

	mockedUseState.mockReturnValue([testModel, vi.fn()]);

	mockedUseSyncExternalStore
		.mockReturnValueOnce(testCacheItem)
		.mockReturnValueOnce({});

	mockedCreateAsyncPaginateModel.mockReturnValue(testModel);
});

test("should create model correctly", () => {
	const result = useSelectAsyncPaginate(testParams);

	expect(result).toEqual({
		currentCache: testCacheItem,
		model: testModel,
		optionsDict: {},
	});

	expect(mockedUseState).toHaveBeenCalledTimes(1);

	const initState = (
		mockedUseState.mock.calls[0] as unknown as [() => unknown]
	)[0];
	expect(initState()).toBe(testModel);

	expect(mockedUseSyncExternalStore).toHaveBeenCalledTimes(2);
	expect(mockedUseSyncExternalStore).toHaveBeenNthCalledWith(
		1,
		testModel.subscribe,
		testModel.getCurrentCache,
	);
	expect(mockedUseSyncExternalStore).toHaveBeenNthCalledWith(
		2,
		testModel.subscribe,
		testModel.getOptionsDict,
	);
});

test("should provide an empty array of deps to `useEffect` by default", () => {
	useSelectAsyncPaginate(testParams);

	expect(mockedUseEffect).toHaveBeenCalledTimes(1);
	expect(mockedUseEffect.mock.calls[0][1]).toEqual([]);
});

test("should provide deps from the 2nd argument to `useEffect`", () => {
	const testDeps = [1, 2, 3];

	useSelectAsyncPaginate(testParams, testDeps);

	expect(mockedUseEffect).toHaveBeenCalledTimes(1);
	expect(mockedUseEffect.mock.calls[0][1]).toBe(testDeps);
});

test("should not reset the model on the first render", () => {
	const testRef = {
		current: true,
	};

	mockedUseRef.mockReturnValue(testRef);

	useSelectAsyncPaginate(testParams);

	expect(mockedUseEffect).toHaveBeenCalledTimes(1);
	const [effect] = mockedUseEffect.mock.calls[0];

	effect();

	expect(testRef.current).toBe(false);
	expect(testModel.handleReset).toHaveBeenCalledTimes(0);
});

test("should reset the model if some of deps is changed", () => {
	const testRef = {
		current: false,
	};

	mockedUseRef.mockReturnValue(testRef);

	useSelectAsyncPaginate(testParams);

	expect(mockedUseEffect).toHaveBeenCalledTimes(1);
	const [effect] = mockedUseEffect.mock.calls[0];

	effect();

	expect(testRef.current).toBe(false);
	expect(testModel.handleReset).toHaveBeenCalledTimes(1);
});
