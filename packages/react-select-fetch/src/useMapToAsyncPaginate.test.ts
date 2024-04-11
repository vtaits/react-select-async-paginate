import { afterEach, expect, test, vi } from "vitest";
import {
	defaultResponseMapper,
	useMapToAsyncPaginate,
} from "./useMapToAsyncPaginate";

vi.mock("react", async () => {
	const actual = await vi.importActual("react");

	return {
		...actual,

		// biome-ignore lint/complexity/noBannedTypes: supports any function
		useCallback: vi.fn(<T extends Function>(callback: T) => callback),

		useMemo: vi.fn(<T>(callback: () => T) => callback()),
	};
});

afterEach(() => {
	vi.clearAllMocks();
});

const defaultParams = {
	url: "/test/",
};

test("should return response if valid", () => {
	const response = {
		options: [1, 2, 3],
	};

	expect(defaultResponseMapper(response)).toBe(response);
});

test("should throw error if response is invalid", () => {
	const response = {};

	expect(() => {
		defaultResponseMapper(response);
	}).toThrow();
});

test("should provide default additional", () => {
	const result = useMapToAsyncPaginate(defaultParams);

	expect(result.additional).toEqual({
		page: 1,
	});
});

test("should redefine page in additional", () => {
	const result = useMapToAsyncPaginate({
		...defaultParams,
		initialPage: 3,
	});

	expect(result.additional).toEqual({
		page: 3,
	});
});

test("should call get with default arguments", async () => {
	const get = vi.fn().mockResolvedValue({
		options: [],
	});

	const result = useMapToAsyncPaginate({
		...defaultParams,
		url: "test-url",
		queryParams: {
			param1: "value1",
			param2: "value2",
		},
		get,
	});

	await result.loadOptions("testSearch", [1, 2, 3], { page: 10 });

	expect(get).toHaveBeenCalledTimes(1);
	expect(get).toHaveBeenCalledWith("test-url", {
		param1: "value1",
		param2: "value2",
		search: "testSearch",
		page: 10,
		offset: 3,
	});
});

test("should redefine search param name in query params", async () => {
	const get = vi.fn().mockResolvedValue({
		options: [],
	});

	const result = useMapToAsyncPaginate({
		...defaultParams,
		url: "test-url",
		queryParams: {
			param1: "value1",
			param2: "value2",
		},
		searchParamName: "search",
		get,
	});

	await result.loadOptions("testSearch", [1, 2, 3], { page: 10 });

	expect(get).toHaveBeenCalledTimes(1);
	expect(get).toHaveBeenCalledWith("test-url", {
		param1: "value1",
		param2: "value2",
		search: "testSearch",
		page: 10,
		offset: 3,
	});
});

test("should redefine page param name in query params", async () => {
	const get = vi.fn().mockResolvedValue({
		options: [],
	});

	const result = useMapToAsyncPaginate({
		...defaultParams,
		url: "test-url",
		queryParams: {
			param1: "value1",
			param2: "value2",
		},
		pageParamName: "currentPage",
		get,
	});

	await result.loadOptions("testSearch", [1, 2, 3], { page: 10 });

	expect(get).toHaveBeenCalledTimes(1);
	expect(get).toHaveBeenCalledWith("test-url", {
		param1: "value1",
		param2: "value2",
		search: "testSearch",
		currentPage: 10,
		offset: 3,
	});
});

test("should not send page if page param name is null", async () => {
	const get = vi.fn().mockResolvedValue({
		options: [],
	});

	const result = useMapToAsyncPaginate({
		...defaultParams,
		url: "test-url",
		queryParams: {
			param1: "value1",
			param2: "value2",
		},
		pageParamName: null,
		get,
	});

	await result.loadOptions("testSearch", [1, 2, 3], { page: 10 });

	expect(get).toHaveBeenCalledTimes(1);
	expect(get).toHaveBeenCalledWith("test-url", {
		param1: "value1",
		param2: "value2",
		search: "testSearch",
		offset: 3,
	});
});

test("should redefine offset param name", async () => {
	const get = vi.fn().mockResolvedValue({
		options: [],
	});

	const result = useMapToAsyncPaginate({
		...defaultParams,
		url: "test-url",
		queryParams: {
			param1: "value1",
			param2: "value2",
		},
		offsetParamName: "otherOffset",
		get,
	});

	await result.loadOptions("testSearch", [1, 2, 3], { page: 10 });

	expect(get).toHaveBeenCalledTimes(1);
	expect(get).toHaveBeenCalledWith("test-url", {
		param1: "value1",
		param2: "value2",
		search: "testSearch",
		page: 10,
		otherOffset: 3,
	});
});

test("should not send offset if offset param name is null", async () => {
	const get = vi.fn().mockResolvedValue({
		options: [],
	});

	const result = useMapToAsyncPaginate({
		...defaultParams,
		url: "test-url",
		queryParams: {
			param1: "value1",
			param2: "value2",
		},
		offsetParamName: null,
		get,
	});

	await result.loadOptions("testSearch", [1, 2, 3], { page: 10 });

	expect(get).toHaveBeenCalledTimes(1);
	expect(get).toHaveBeenCalledWith("test-url", {
		param1: "value1",
		param2: "value2",
		search: "testSearch",
		page: 10,
	});
});

test("should return response with increased page in additional", async () => {
	const get = vi.fn().mockResolvedValue({
		options: [4, 5, 6],
		hasMore: true,
	});

	const result = useMapToAsyncPaginate({
		...defaultParams,
		get,
	});

	const response = await result.loadOptions("testSearch", [1, 2, 3], {
		page: 10,
	});

	expect(response).toEqual({
		options: [4, 5, 6],
		hasMore: true,

		additional: {
			page: 11,
		},
	});
});

test("should return mapped response with increased page in additional", async () => {
	const response = {
		results: [4, 5, 6],
		has_more: true,
	};

	const resultResponse = {
		options: [1, 2, 3],
		hasMore: false,
	};

	const get = vi.fn().mockResolvedValue(response);

	const mapResponse = vi.fn().mockReturnValue(resultResponse);

	const result = useMapToAsyncPaginate({
		...defaultParams,
		get,
		mapResponse,
	});

	const prevOptions = [1, 2, 3];

	const loadOptionsResponse = await result.loadOptions(
		"testSearch",
		prevOptions,
		{ page: 10 },
	);

	expect(loadOptionsResponse).toEqual({
		options: [1, 2, 3],
		hasMore: false,

		additional: {
			page: 11,
		},
	});

	expect(mapResponse).toHaveBeenCalledTimes(1);
	expect(mapResponse).toHaveBeenCalledWith(response, {
		search: "testSearch",
		prevPage: 10,
		prevOptions,
	});
});

test("should return empty response on error", async () => {
	const get = vi.fn().mockRejectedValue(new Error("Test error"));

	const result = useMapToAsyncPaginate({
		...defaultParams,
		get,
	});

	const response = await result.loadOptions("testSearch", [1, 2, 3], {
		page: 10,
	});

	expect(response).toEqual({
		options: [],
		hasMore: false,
	});
});

test("should throw an error if additional is not defined", async () => {
	const get = vi.fn(() => {
		throw new Error("Test error");
	});

	const result = useMapToAsyncPaginate({
		...defaultParams,
		get,
	});

	let hasError = false;

	try {
		await result.loadOptions("testSearch", [1, 2, 3], undefined);
	} catch (e) {
		hasError = true;
	}

	expect(hasError).toBe(true);
});
