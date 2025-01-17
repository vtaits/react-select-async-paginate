import { useAsyncPaginateBase } from "react-select-async-paginate";
import { useMapToAsyncPaginate } from "use-select-async-paginate-fetch";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { useSelectFetchBase } from "./useSelectFetchBase";

vi.mock("react-select-async-paginate");
vi.mock("use-select-async-paginate-fetch");

const mockedUseAsyncPaginateBase = vi.mocked(useAsyncPaginateBase);
const mockedUseMapToAsyncPaginate = vi.mocked(useMapToAsyncPaginate);

beforeEach(() => {
	mockedUseMapToAsyncPaginate.mockReset();
});

afterEach(() => {
	vi.clearAllMocks();
});

const defaultParams = {
	url: "",
	inputValue: "",
	menuIsOpen: false,
};

test("should call useMapToAsyncPaginate with correct params", () => {
	useSelectFetchBase(defaultParams);

	expect(mockedUseMapToAsyncPaginate).toBeCalledTimes(1);
	expect(mockedUseMapToAsyncPaginate).toBeCalledWith(defaultParams);
});

test("should call useAsyncPaginateBase with correct params", () => {
	const shouldLoadMore = vi.fn();
	const loadOptions = vi.fn();
	const additional = {
		page: 1,
	};

	const mappedParams = {
		loadOptions,
		additional,
	};

	mockedUseMapToAsyncPaginate.mockReturnValue(mappedParams);

	useSelectFetchBase({
		...defaultParams,
		shouldLoadMore,
	});

	expect(mockedUseAsyncPaginateBase).toBeCalledTimes(1);
	expect(mockedUseAsyncPaginateBase).toBeCalledWith(
		{
			...defaultParams,
			loadOptions,
			additional,
			shouldLoadMore,
		},
		[],
	);
});

test("should provide correct deps to useAsyncPaginateBase", () => {
	useSelectFetchBase(defaultParams, [1, 2, 3]);

	expect(mockedUseAsyncPaginateBase).toHaveBeenCalledTimes(1);
	expect(mockedUseAsyncPaginateBase).toHaveBeenCalledWith(
		defaultParams,
		[1, 2, 3],
	);
});

test("should return correct result", () => {
	const expectedResult = {
		options: [],
		handleScrolledToBottom: vi.fn(),
		shouldLoadMore: vi.fn(),
		isLoading: false,
		isFirstLoad: false,
		menuIsOpen: false,
		inputValue: "",
		filterOption: null,
		onMenuOpen: vi.fn(),
		onMenuClose: vi.fn(),
		onInputChange: vi.fn(),
	};

	mockedUseAsyncPaginateBase.mockReturnValue(expectedResult);

	const result = useSelectFetchBase(defaultParams, [1, 2, 3]);

	expect(result).toBe(expectedResult);
});
