import { applyMiddleware, legacy_createStore } from "redux";
import { withExtraArgument } from "redux-thunk";
import { beforeEach, expect, test, vi } from "vitest";
import { createAsyncPaginateModel } from "./createAsyncPaginateModel";
import { createReducer } from "./createReducer";
import { getInitialCache } from "./getInitialCache";
import { getInitialState } from "./getInitialState";
import { loadMore } from "./thunks/loadMore";
import { requestOptions } from "./thunks/requestOptions";
import { reset } from "./thunks/reset";
import { setInputValue } from "./thunks/setInputValue";
import { setMenuIsOpen } from "./thunks/setMenuIsOpen";
import { RequestOptionsCaller, type State } from "./types/internal";
import type { Params } from "./types/public";

vi.mock("redux");
const mockedCreateStore = vi.mocked(legacy_createStore);
const mockedApplyMiddleWare = vi.mocked(applyMiddleware);

vi.mock("redux-thunk");
const mockedWithExtraArgument = vi.mocked(withExtraArgument);

vi.mock("./createReducer");
const mockedCreateReducer = vi.mocked(createReducer);

vi.mock("./getInitialCache");
const mockedGetInitialCache = vi.mocked(getInitialCache);

vi.mock("./getInitialState");
const mockedGetInitialState = vi.mocked(getInitialState);

vi.mock("./thunks/loadMore");
const mockedLoadMore = vi.mocked(loadMore);

vi.mock("./thunks/requestOptions");
const mockedRequestOptions = vi.mocked(requestOptions);

vi.mock("./thunks/reset");
const mockedReset = vi.mocked(reset);

vi.mock("./thunks/setInputValue");
const mockedSetInputValue = vi.mocked(setInputValue);

vi.mock("./thunks/setMenuIsOpen");
const mockedSetMenuIsOpen = vi.mocked(setMenuIsOpen);

const params: Params<unknown, unknown> = {
	loadOptions: vi.fn(),
};

const store = {
	dispatch: vi.fn(),
	getState: vi.fn(),
	subscribe: vi.fn(),
	replaceReducer: vi.fn(),
	[Symbol.observable]: vi.fn(),
};

beforeEach(() => {
	vi.resetAllMocks();

	mockedCreateStore.mockReturnValue(store);
});

test("should creare store with correct params", () => {
	const initalState: State<unknown, unknown> = {
		cache: {},
		inputValue: "testInput",
		menuIsOpen: true,
		optionsDict: {},
	};

	mockedGetInitialState.mockReturnValue(initalState);

	const reducer = vi.fn();
	mockedCreateReducer.mockReturnValue(reducer);

	const thunkMiddleWare = vi.fn();
	mockedWithExtraArgument.mockReturnValue(thunkMiddleWare);

	const middleWare = vi.fn();
	mockedApplyMiddleWare.mockReturnValue(middleWare);

	createAsyncPaginateModel(params);

	expect(mockedGetInitialState).toHaveBeenCalledTimes(1);
	expect(mockedGetInitialState).toHaveBeenCalledWith(params);

	expect(mockedCreateReducer).toHaveBeenCalledTimes(1);
	expect(mockedCreateReducer).toHaveBeenCalledWith(params, initalState);

	expect(mockedApplyMiddleWare).toHaveBeenCalledTimes(1);
	expect(mockedApplyMiddleWare).toHaveBeenCalledWith(thunkMiddleWare);

	expect(mockedCreateStore).toHaveBeenCalledTimes(1);
	expect(mockedCreateStore).toHaveBeenCalledWith(reducer, middleWare);

	expect(mockedWithExtraArgument).toHaveBeenCalledTimes(1);
	const getParams = mockedWithExtraArgument.mock.calls[0][0] as () => Params<
		unknown,
		unknown
	>;

	expect(getParams()).toBe(params);
});

test("should open menu", () => {
	const model = createAsyncPaginateModel(params);

	const resThunk = vi.fn();
	mockedSetMenuIsOpen.mockReturnValue(resThunk);

	model.onToggleMenu(true);

	expect(store.dispatch).toHaveBeenCalledTimes(1);
	expect(store.dispatch).toHaveBeenCalledWith(resThunk);

	expect(mockedSetMenuIsOpen).toHaveBeenCalledTimes(1);
	expect(mockedSetMenuIsOpen).toHaveBeenCalledWith(true);
});

test("should close menu", () => {
	const model = createAsyncPaginateModel(params);

	const resThunk = vi.fn();
	mockedSetMenuIsOpen.mockReturnValue(resThunk);

	model.onToggleMenu(false);

	expect(store.dispatch).toHaveBeenCalledTimes(1);
	expect(store.dispatch).toHaveBeenCalledWith(resThunk);

	expect(mockedSetMenuIsOpen).toHaveBeenCalledTimes(1);
	expect(mockedSetMenuIsOpen).toHaveBeenCalledWith(false);
});

test("should change input value", () => {
	const model = createAsyncPaginateModel(params);

	const resThunk = vi.fn();
	mockedSetInputValue.mockReturnValue(resThunk);

	model.onChangeInputValue("test");

	expect(store.dispatch).toHaveBeenCalledTimes(1);
	expect(store.dispatch).toHaveBeenCalledWith(resThunk);

	expect(mockedSetInputValue).toHaveBeenCalledTimes(1);
	expect(mockedSetInputValue).toHaveBeenCalledWith("test");
});

test("should load more options", () => {
	const model = createAsyncPaginateModel(params);

	const resThunk = vi.fn();
	mockedLoadMore.mockReturnValue(resThunk);

	model.handleLoadMore();

	expect(store.dispatch).toHaveBeenCalledTimes(1);
	expect(store.dispatch).toHaveBeenCalledWith(resThunk);

	expect(mockedLoadMore).toHaveBeenCalledTimes(1);
});

test("should reset cached options", () => {
	const model = createAsyncPaginateModel(params);

	const resThunk = vi.fn();
	mockedReset.mockReturnValue(resThunk);

	model.handleReset();

	expect(store.dispatch).toHaveBeenCalledTimes(1);
	expect(store.dispatch).toHaveBeenCalledWith(resThunk);

	expect(mockedReset).toHaveBeenCalledTimes(1);
});

test("should return existed cache item for current value of input", () => {
	const state = {
		cache: {
			test: {
				isFirstLoad: false,
				isLoading: false,
				hasMore: true,
				options: [],
				additional: undefined,
			},
		},
		inputValue: "test",
		menuIsOpen: false,
	};

	store.getState.mockReturnValue(state);

	const model = createAsyncPaginateModel(params);

	expect(model.getCurrentCache()).toBe(state.cache.test);
});

test("should compute cache item if cache for current value of input is not defined", () => {
	const state = {
		cache: {
			test: {
				isFirstLoad: false,
				isLoading: false,
				hasMore: true,
				options: [],
				additional: undefined,
			},
		},
		inputValue: "test2",
		menuIsOpen: false,
	};

	store.getState.mockReturnValue(state);

	const expectedCacheItem = {
		isFirstLoad: true,
		isLoading: false,
		hasMore: false,
		options: [1, 2, 3],
		additional: 456,
		lockedUntil: 0,
	};

	mockedGetInitialCache.mockReturnValue(expectedCacheItem);

	const model = createAsyncPaginateModel(params);

	expect(model.getCurrentCache()).toBe(expectedCacheItem);

	expect(mockedGetInitialCache).toHaveBeenCalledTimes(1);
	expect(mockedGetInitialCache).toHaveBeenCalledWith(params);
});

test("should preovied `subscribe` of store", () => {
	const model = createAsyncPaginateModel(params);

	expect(model.subscribe).toBe(store.subscribe);
});

test("should not load options automatically on init if autoload is falsy", () => {
	createAsyncPaginateModel(params);

	expect(store.dispatch).toHaveBeenCalledTimes(0);
	expect(mockedRequestOptions).toHaveBeenCalledTimes(0);
});

test("should load options automatically on init if autoload is `true`", () => {
	const resThunk = vi.fn();
	mockedRequestOptions.mockReturnValue(resThunk);

	createAsyncPaginateModel({
		...params,
		autoload: true,
	});

	expect(store.dispatch).toHaveBeenCalledTimes(1);
	expect(store.dispatch).toHaveBeenCalledWith(resThunk);

	expect(mockedRequestOptions).toHaveBeenCalledTimes(1);
	expect(mockedRequestOptions).toHaveBeenCalledWith(
		RequestOptionsCaller.Autoload,
	);
});

test("should update params", () => {
	const nextParams: Params<unknown, unknown> = {
		loadOptions: vi.fn(),
		additional: "otherAdditional",
		debounceTimeout: 1234,
	};

	const model = createAsyncPaginateModel(params);

	const getParams = mockedWithExtraArgument.mock.calls[0][0] as () => Params<
		unknown,
		unknown
	>;

	model.updateParams(nextParams);

	expect(getParams()).toBe(nextParams);
});
