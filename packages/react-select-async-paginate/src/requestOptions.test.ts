import type { GroupBase } from "react-select";
import sleep from "sleep-promise";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { defaultReduceOptions } from "./defaultReduceOptions";
import { requestOptions } from "./requestOptions";
import type { UseAsyncPaginateBaseParams } from "./types";
import { validateResponse } from "./validateResponse";

vi.mock("sleep-promise");
vi.mock("./validateResponse");

const mockedValidateResponse = vi.mocked(validateResponse);
const mockedSleep = vi.mocked(sleep);

vi.spyOn(window, "setTimeout");

beforeEach(() => {
	mockedValidateResponse.mockReturnValue(true);
	mockedSleep.mockResolvedValue(undefined);
});

afterEach(() => {
	vi.clearAllMocks();
});

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

const defaultParamsRef = {
	current: defaultParams,
};

const defaultIsMountedRef = {
	current: true,
};

const defaultSetOptionsCache = (): void => {};

test("should request if options not cached", async () => {
	const newOptions = [
		{
			value: 1,
			label: "1",
		},

		{
			value: 2,
			label: "2",
		},
	];

	const setOptionsCache = vi.fn();
	const loadOptions = vi.fn().mockReturnValue({
		options: newOptions,
		hasMore: true,
	});

	const additional = Symbol("additional");

	await requestOptions(
		"autoload",
		{
			...defaultParamsRef,
			current: {
				...defaultParams,
				loadOptions,
				inputValue: "test",
				additional,
			},
		},
		{
			current: {},
		},
		0,
		setOptionsCache,
		defaultReduceOptions,
		defaultIsMountedRef,
		false,
	);

	expect(loadOptions).toHaveBeenCalledTimes(1);
	expect(loadOptions.mock.calls[0][0]).toBe("test");
	expect(loadOptions.mock.calls[0][1]).toEqual([]);
	expect(loadOptions.mock.calls[0][2]).toEqual(additional);

	expect(setOptionsCache).toHaveBeenCalledTimes(2);

	const intermediateCache = setOptionsCache.mock.calls[0][0]({});

	expect(intermediateCache).toEqual({
		test: {
			isFirstLoad: true,
			options: [],
			hasMore: true,
			isLoading: true,
			lockedUntil: 0,
			additional,
		},
	});

	const lastCache = setOptionsCache.mock.calls[1][0](intermediateCache);

	expect(lastCache).toEqual({
		test: {
			isFirstLoad: false,
			options: newOptions,
			hasMore: true,
			isLoading: false,
			lockedUntil: 0,
			additional,
		},
	});
});

test("should request if options cached", async () => {
	const prevOptions = [
		{
			value: 1,
			label: "1",
		},

		{
			value: 2,
			label: "2",
		},
	];

	const newOptions = [
		{
			value: 3,
			label: "4",
		},

		{
			value: 4,
			label: "4",
		},
	];

	const setOptionsCache = vi.fn();
	const loadOptions = vi.fn().mockReturnValue({
		options: newOptions,
		hasMore: true,
	});

	const additional = Symbol("additional");

	const initialOptionsCache = {
		test: {
			options: prevOptions,
			hasMore: true,
			isLoading: false,
			isFirstLoad: false,
			lockedUntil: 0,
			additional,
		},
	};

	await requestOptions(
		"autoload",
		{
			...defaultParamsRef,
			current: {
				...defaultParams,
				loadOptions,
				inputValue: "test",
			},
		},
		{
			current: initialOptionsCache,
		},
		0,
		setOptionsCache,
		defaultReduceOptions,
		defaultIsMountedRef,
		false,
	);

	expect(loadOptions).toHaveBeenCalledTimes(1);
	expect(loadOptions.mock.calls[0][0]).toBe("test");
	expect(loadOptions.mock.calls[0][1]).toBe(prevOptions);
	expect(loadOptions.mock.calls[0][2]).toEqual(additional);

	expect(setOptionsCache).toHaveBeenCalledTimes(2);

	const intermediateCache =
		setOptionsCache.mock.calls[0][0](initialOptionsCache);

	expect(intermediateCache).toEqual({
		test: {
			isFirstLoad: false,
			options: prevOptions,
			hasMore: true,
			isLoading: true,
			lockedUntil: 0,
			additional,
		},
	});

	const lastCache = setOptionsCache.mock.calls[1][0](intermediateCache);

	expect(lastCache).toEqual({
		test: {
			isFirstLoad: false,
			options: [...prevOptions, ...newOptions],
			hasMore: true,
			isLoading: false,
			lockedUntil: 0,
			additional,
		},
	});
});

test("should not request if options are loading for current search", async () => {
	const setOptionsCache = vi.fn();
	const loadOptions = vi.fn().mockReturnValue({
		options: [],
		hasMore: true,
	});

	const additional = Symbol("additional");

	await requestOptions(
		"autoload",
		{
			...defaultParamsRef,
			current: {
				...defaultParams,
				loadOptions,
				inputValue: "test",
				additional,
			},
		},
		{
			current: {
				test: {
					options: [],
					hasMore: true,
					isLoading: true,
					lockedUntil: 0,
					isFirstLoad: false,
				},
			},
		},
		0,
		setOptionsCache,
		defaultReduceOptions,
		defaultIsMountedRef,
		false,
	);

	expect(loadOptions).toHaveBeenCalledTimes(0);
	expect(setOptionsCache).toHaveBeenCalledTimes(0);
});

test("should not request if hasMore is false for current search", async () => {
	const setOptionsCache = vi.fn();
	const loadOptions = vi.fn().mockReturnValue({
		options: [],
		hasMore: true,
	});

	const additional = Symbol("additional");

	await requestOptions(
		"autoload",
		{
			...defaultParamsRef,
			current: {
				...defaultParams,
				loadOptions,
				inputValue: "test",
				additional,
			},
		},
		{
			current: {
				test: {
					options: [],
					hasMore: false,
					isLoading: false,
					isFirstLoad: false,
					lockedUntil: 0,
				},
			},
		},
		0,
		setOptionsCache,
		defaultReduceOptions,
		defaultIsMountedRef,
		false,
	);

	expect(loadOptions).toHaveBeenCalledTimes(0);
	expect(setOptionsCache).toHaveBeenCalledTimes(0);
});

test("should request with error", async () => {
	const setOptionsCache = vi.fn();
	const loadOptions = vi.fn().mockRejectedValue(new Error());

	const additional = Symbol("additional");

	await requestOptions(
		"autoload",
		{
			...defaultParamsRef,
			current: {
				...defaultParams,
				loadOptions,
				inputValue: "test",
				additional,
			},
		},
		{
			current: {},
		},
		0,
		setOptionsCache,
		defaultReduceOptions,
		defaultIsMountedRef,
		false,
	);

	expect(loadOptions).toHaveBeenCalledTimes(1);
	expect(loadOptions).toHaveBeenCalledWith("test", [], additional);

	expect(setOptionsCache).toHaveBeenCalledTimes(2);

	const intermediateCache = setOptionsCache.mock.calls[0][0]({});

	expect(intermediateCache).toEqual({
		test: {
			isFirstLoad: true,
			options: [],
			hasMore: true,
			isLoading: true,
			lockedUntil: 0,
			additional,
		},
	});

	const lastCache = setOptionsCache.mock.calls[1][0](intermediateCache);

	expect(lastCache).toEqual({
		test: {
			isFirstLoad: true,
			options: [],
			hasMore: true,
			isLoading: false,
			additional,
			lockedUntil: Date.now(),
		},
	});
});

test("should request with error and set locked timeout", async () => {
	const setOptionsCache = vi.fn();
	const loadOptions = vi.fn().mockRejectedValue(new Error());

	const additional = Symbol("additional");

	await requestOptions(
		"autoload",
		{
			...defaultParamsRef,
			current: {
				...defaultParams,
				loadOptions,
				inputValue: "test",
				additional,
				reloadOnErrorTimeout: 400,
			},
		},
		{
			current: {},
		},
		0,
		setOptionsCache,
		defaultReduceOptions,
		defaultIsMountedRef,
		false,
	);

	expect(loadOptions).toHaveBeenCalledTimes(1);
	expect(loadOptions).toHaveBeenCalledWith("test", [], additional);

	expect(setOptionsCache).toHaveBeenCalledTimes(2);

	const intermediateCache = setOptionsCache.mock.calls[0][0]({});

	expect(intermediateCache).toEqual({
		test: {
			isFirstLoad: true,
			options: [],
			hasMore: true,
			isLoading: true,
			lockedUntil: 0,
			additional,
		},
	});

	const lastCache = setOptionsCache.mock.calls[1][0](intermediateCache);

	expect(lastCache).toEqual({
		test: {
			isFirstLoad: true,
			options: [],
			hasMore: true,
			isLoading: false,
			additional,
			lockedUntil: Date.now() + 400,
		},
	});
});

test("should redefine reduceOptions", async () => {
	const prevOptions = [
		{
			value: 1,
			label: "1",
		},

		{
			value: 2,
			label: "2",
		},
	];

	const newOptions = [
		{
			value: 3,
			label: "4",
		},

		{
			value: 4,
			label: "4",
		},
	];

	const reducedOptions = [
		{
			value: 5,
			label: "5",
		},
	];

	const reduceOptions = vi.fn().mockReturnValue(reducedOptions);

	const setOptionsCache = vi.fn();
	const loadOptions = vi.fn().mockReturnValue({
		options: newOptions,
		hasMore: true,
	});

	const additional = Symbol("additional");

	const initialOptionsCache = {
		test: {
			options: prevOptions,
			hasMore: true,
			isLoading: false,
			isFirstLoad: false,
			lockedUntil: 0,
			additional,
		},
	};

	await requestOptions(
		"autoload",
		{
			...defaultParamsRef,
			current: {
				...defaultParams,
				loadOptions,
				inputValue: "test",
			},
		},
		{
			current: initialOptionsCache,
		},
		0,
		setOptionsCache,
		reduceOptions,
		defaultIsMountedRef,
		false,
	);

	expect(loadOptions).toHaveBeenCalledTimes(1);
	expect(loadOptions.mock.calls[0][0]).toBe("test");
	expect(loadOptions.mock.calls[0][1]).toBe(prevOptions);
	expect(loadOptions.mock.calls[0][2]).toEqual(additional);

	expect(setOptionsCache).toHaveBeenCalledTimes(2);

	const intermediateCache =
		setOptionsCache.mock.calls[0][0](initialOptionsCache);

	expect(intermediateCache).toEqual({
		test: {
			isFirstLoad: false,
			options: prevOptions,
			hasMore: true,
			isLoading: true,
			lockedUntil: 0,
			additional,
		},
	});

	const lastCache = setOptionsCache.mock.calls[1][0](intermediateCache);

	expect(lastCache).toEqual({
		test: {
			isFirstLoad: false,
			options: reducedOptions,
			hasMore: true,
			isLoading: false,
			lockedUntil: 0,
			additional,
		},
	});

	expect(reduceOptions).toHaveBeenCalledTimes(1);
	expect(reduceOptions.mock.calls[0][0]).toBe(prevOptions);
	expect(reduceOptions.mock.calls[0][1]).toBe(newOptions);
	expect(reduceOptions.mock.calls[0][2]).toBe(additional);
});

test("should validate response", async () => {
	const newOptions = [
		{
			value: 1,
			label: "1",
		},

		{
			value: 2,
			label: "2",
		},
	];

	const response = {
		options: newOptions,
		hasMore: true,
	};

	mockedValidateResponse.mockImplementation(() => {
		throw new Error();
	});

	const loadOptions = vi.fn().mockReturnValue(response);

	let hasError = false;
	try {
		await requestOptions(
			"autoload",
			{
				...defaultParamsRef,
				current: {
					...defaultParams,
					loadOptions,
				},
			},
			{
				current: {},
			},
			0,
			defaultSetOptionsCache,
			defaultReduceOptions,
			defaultIsMountedRef,
			false,
		);
	} catch (e) {
		hasError = true;
	}

	expect(hasError).toBe(true);

	expect(validateResponse).toHaveBeenCalledTimes(1);
	expect(validateResponse).toHaveBeenCalledWith(response);
});

test("should not sleep if debounceTimeout is 0", async () => {
	await requestOptions(
		"input-change",
		{
			...defaultParamsRef,
			current: {
				...defaultParams,
			},
		},
		{
			current: {},
		},
		0,
		defaultSetOptionsCache,
		defaultReduceOptions,
		defaultIsMountedRef,
		false,
	);

	expect(mockedSleep).toHaveBeenCalledTimes(0);
});

test('should not sleep if debounceTimeout bigger than 0 and caller is not "input-change"', async () => {
	await requestOptions(
		"autoload",
		{
			...defaultParamsRef,
			current: {
				...defaultParams,
			},
		},
		{
			current: {},
		},
		0,
		defaultSetOptionsCache,
		defaultReduceOptions,
		defaultIsMountedRef,
		false,
	);

	expect(mockedSleep).toHaveBeenCalledTimes(0);
});

test('should sleep if debounceTimeout bigger than 0 and caller is "input-change"', async () => {
	const newOptions = [
		{
			value: 1,
			label: "1",
		},

		{
			value: 2,
			label: "2",
		},
	];

	const setOptionsCache = vi.fn();
	const loadOptions = vi.fn().mockReturnValue({
		options: newOptions,
		hasMore: true,
	});

	const additional = Symbol("additional");

	await requestOptions(
		"input-change",
		{
			...defaultParamsRef,
			current: {
				...defaultParams,
				loadOptions,
				inputValue: "test",
				additional,
			},
		},
		{
			current: {},
		},
		1234,
		setOptionsCache,
		defaultReduceOptions,
		defaultIsMountedRef,
		false,
	);

	expect(mockedSleep).toHaveBeenCalledTimes(1);
	expect(mockedSleep).toHaveBeenCalledWith(1234);

	expect(loadOptions).toHaveBeenCalledTimes(1);
	expect(loadOptions).toHaveBeenCalledWith("test", [], additional);

	expect(setOptionsCache).toHaveBeenCalledTimes(2);

	const intermediateCache = setOptionsCache.mock.calls[0][0]({});

	expect(intermediateCache).toEqual({
		test: {
			isFirstLoad: true,
			options: [],
			hasMore: true,
			isLoading: true,
			lockedUntil: 0,
			additional,
		},
	});

	const lastCache = setOptionsCache.mock.calls[1][0](intermediateCache);

	expect(lastCache).toEqual({
		test: {
			isFirstLoad: false,
			options: newOptions,
			hasMore: true,
			isLoading: false,
			lockedUntil: 0,
			additional,
		},
	});
});

test("should cancel loading if inputValue has changed during sleep for empty cache", async () => {
	const newOptions = [
		{
			value: 1,
			label: "1",
		},

		{
			value: 2,
			label: "2",
		},
	];

	const setOptionsCache = vi.fn();
	const loadOptions = vi.fn().mockReturnValue({
		options: newOptions,
		hasMore: true,
	});

	const additional = Symbol("additional");

	const paramsRef = {
		...defaultParamsRef,
		current: {
			...defaultParams,
			loadOptions,
			inputValue: "test",
			additional,
		},
	};

	mockedSleep.mockImplementation(() => {
		paramsRef.current.inputValue = "test2";
		return Promise.resolve() as Promise<unknown> &
			((value: unknown) => unknown);
	});

	await requestOptions(
		"input-change",
		paramsRef,
		{
			current: {},
		},
		1234,
		setOptionsCache,
		defaultReduceOptions,
		defaultIsMountedRef,
		false,
	);

	expect(loadOptions).toHaveBeenCalledTimes(0);

	expect(setOptionsCache).toHaveBeenCalledTimes(2);

	const intermediateCache = setOptionsCache.mock.calls[0][0]({});

	expect(intermediateCache).toEqual({
		test: {
			isFirstLoad: true,
			options: [],
			hasMore: true,
			isLoading: true,
			lockedUntil: 0,
			additional,
		},
	});

	const lastCache = setOptionsCache.mock.calls[1][0](intermediateCache);

	expect(lastCache).toEqual({});
});

test("should cancel loading if inputValue has changed during sleep for filled cache", async () => {
	const newOptions = [
		{
			value: 1,
			label: "1",
		},

		{
			value: 2,
			label: "2",
		},
	];

	const setOptionsCache = vi.fn();
	const loadOptions = vi.fn().mockReturnValue({
		options: newOptions,
		hasMore: true,
	});

	const additional = Symbol("additional");

	const paramsRef = {
		...defaultParamsRef,
		current: {
			...defaultParams,
			loadOptions,
			inputValue: "test",
			additional,
		},
	};

	mockedSleep.mockImplementation(() => {
		paramsRef.current.inputValue = "test2";
		return Promise.resolve() as Promise<unknown> &
			((value: unknown) => unknown);
	});

	await requestOptions(
		"input-change",
		paramsRef,
		{
			current: {
				test: {
					isFirstLoad: true,
					options: [],
					hasMore: true,
					isLoading: false,
					lockedUntil: 0,
					additional,
				},
			},
		},
		1234,
		setOptionsCache,
		defaultReduceOptions,
		defaultIsMountedRef,
		false,
	);

	expect(loadOptions).toHaveBeenCalledTimes(0);

	expect(setOptionsCache).toHaveBeenCalledTimes(2);

	const intermediateCache = setOptionsCache.mock.calls[0][0]({});

	expect(intermediateCache).toEqual({
		test: {
			isFirstLoad: true,
			options: [],
			hasMore: true,
			isLoading: true,
			lockedUntil: 0,
			additional,
		},
	});

	const lastCache = setOptionsCache.mock.calls[1][0](intermediateCache);

	expect(lastCache).toEqual({
		test: {
			isFirstLoad: true,
			options: [],
			hasMore: true,
			isLoading: false,
			lockedUntil: 0,
			additional,
		},
	});
});

test("should redefine additional with response", async () => {
	const additional1 = Symbol("additional1");
	const additional2 = Symbol("additional2");

	const setOptionsCache = vi.fn();
	const loadOptions = vi.fn().mockReturnValue({
		options: [],
		hasMore: true,
		additional: additional2,
	});

	await requestOptions(
		"autoload",
		{
			...defaultParamsRef,
			current: {
				...defaultParams,
				loadOptions,
				inputValue: "test",
				additional: additional1,
			},
		},
		{
			current: {},
		},
		0,
		setOptionsCache,
		defaultReduceOptions,
		defaultIsMountedRef,
		false,
	);

	expect(setOptionsCache).toHaveBeenCalledTimes(2);

	const lastCache = setOptionsCache.mock.calls[1][0](
		setOptionsCache.mock.calls[0][0]({}),
	);

	expect(lastCache.test.additional).toBe(additional2);
});

test("should not redefine additional with response", async () => {
	const additional1 = Symbol("additional1");

	const setOptionsCache = vi.fn();
	const loadOptions = vi.fn().mockReturnValue({
		options: [],
		hasMore: true,
	});

	await requestOptions(
		"autoload",
		{
			...defaultParamsRef,
			current: {
				...defaultParams,
				loadOptions,
				inputValue: "test",
				additional: additional1,
			},
		},
		{
			current: {},
		},
		0,
		setOptionsCache,
		defaultReduceOptions,
		defaultIsMountedRef,
		false,
	);

	expect(setOptionsCache).toHaveBeenCalledTimes(2);

	const lastCache = setOptionsCache.mock.calls[1][0](
		setOptionsCache.mock.calls[0][0]({}),
	);

	expect(lastCache.test.additional).toBe(additional1);
});

test("should set truthy hasMore with response", async () => {
	const setOptionsCache = vi.fn();
	const loadOptions = vi.fn().mockReturnValue({
		options: [],
		hasMore: true,
	});

	await requestOptions(
		"autoload",
		{
			...defaultParamsRef,
			current: {
				...defaultParams,
				loadOptions,
				inputValue: "test",
			},
		},
		{
			current: {},
		},
		0,
		setOptionsCache,
		defaultReduceOptions,
		defaultIsMountedRef,
		false,
	);

	expect(setOptionsCache).toHaveBeenCalledTimes(2);

	const lastCache = setOptionsCache.mock.calls[1][0](
		setOptionsCache.mock.calls[0][0]({}),
	);

	expect(lastCache.test.hasMore).toBe(true);
});

test("should set falsy hasMore with response", async () => {
	const setOptionsCache = vi.fn();
	const loadOptions = vi.fn().mockReturnValue({
		options: [],
	});

	await requestOptions(
		"autoload",
		{
			...defaultParamsRef,
			current: {
				...defaultParams,
				loadOptions,
				inputValue: "test",
			},
		},
		{
			current: {},
		},
		0,
		setOptionsCache,
		defaultReduceOptions,
		defaultIsMountedRef,
		false,
	);

	expect(setOptionsCache).toHaveBeenCalledTimes(2);

	const lastCache = setOptionsCache.mock.calls[1][0](
		setOptionsCache.mock.calls[0][0]({}),
	);

	expect(lastCache.test.hasMore).toBe(false);
});

test("should not set cached after loading if the component is unmounted ", async () => {
	const newOptions = [
		{
			value: 1,
			label: "1",
		},

		{
			value: 2,
			label: "2",
		},
	];

	const setOptionsCache = vi.fn();
	const loadOptions = vi.fn().mockReturnValue({
		options: newOptions,
		hasMore: true,
	});

	const additional = Symbol("additional");

	await requestOptions(
		"autoload",
		{
			...defaultParamsRef,
			current: {
				...defaultParams,
				loadOptions,
				inputValue: "test",
				additional,
			},
		},
		{
			current: {},
		},
		0,
		setOptionsCache,
		defaultReduceOptions,
		{
			current: false,
		},
		false,
	);

	expect(loadOptions).toHaveBeenCalledTimes(1);
	expect(loadOptions.mock.calls[0][0]).toBe("test");
	expect(loadOptions.mock.calls[0][1]).toEqual([]);
	expect(loadOptions.mock.calls[0][2]).toEqual(additional);

	expect(setOptionsCache).toHaveBeenCalledTimes(1);

	const intermediateCache = setOptionsCache.mock.calls[0][0]({});

	expect(intermediateCache).toEqual({
		test: {
			isFirstLoad: true,
			options: [],
			hasMore: true,
			isLoading: true,
			lockedUntil: 0,
			additional,
		},
	});
});
