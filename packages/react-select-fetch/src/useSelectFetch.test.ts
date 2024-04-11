import { useAsyncPaginate } from "react-select-async-paginate";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { useMapToAsyncPaginate } from "./useMapToAsyncPaginate";
import { useSelectFetch } from "./useSelectFetch";

vi.mock("react-select-async-paginate");
vi.mock("./useMapToAsyncPaginate");

const mockedUseAsyncPaginate = vi.mocked(useAsyncPaginate);
const mockedUseMapToAsyncPaginate = vi.mocked(useMapToAsyncPaginate);

beforeEach(() => {
	mockedUseMapToAsyncPaginate.mockReset();
});

afterEach(() => {
	vi.clearAllMocks();
});

const defaultParams = {
	url: "",
};

test("should call useMapToAsyncPaginate with correct params", () => {
	useSelectFetch(defaultParams);

	expect(mockedUseMapToAsyncPaginate).toBeCalledTimes(1);
	expect(mockedUseMapToAsyncPaginate).toBeCalledWith(defaultParams);
});

test("should call useAsyncPaginate with correct params", () => {
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

	useSelectFetch({
		...defaultParams,
		shouldLoadMore,
	});

	expect(mockedUseAsyncPaginate).toBeCalledTimes(1);
	expect(mockedUseAsyncPaginate).toBeCalledWith(
		{
			...defaultParams,
			loadOptions,
			additional,
			shouldLoadMore,
		},
		[],
	);
});

test("should provide correct deps to useAsyncPaginate", () => {
	useSelectFetch(defaultParams, [1, 2, 3]);

	expect(mockedUseAsyncPaginate).toBeCalledTimes(1);
	expect(mockedUseAsyncPaginate).toBeCalledWith(defaultParams, [1, 2, 3]);
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

	mockedUseAsyncPaginate.mockReturnValue(expectedResult);

	const result = useSelectFetch(defaultParams, [1, 2, 3]);

	expect(result).toBe(expectedResult);
});
