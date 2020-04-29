import {
  useSelectFetchPure,
} from '../useSelectFetch';

const defaultParams = {
  url: '',
};

test('should call useMapToAsyncPaginate with correct params', () => {
  const useMapToAsyncPaginate = jest.fn();
  const useAsyncPaginate = jest.fn();

  useSelectFetchPure(
    useMapToAsyncPaginate,
    useAsyncPaginate,
    defaultParams,
  );

  expect(useMapToAsyncPaginate).toBeCalledTimes(1);
  expect(useMapToAsyncPaginate).toBeCalledWith(defaultParams);
});

test('should call useAsyncPaginate with correct params', () => {
  const shouldLoadMore = jest.fn();
  const loadOptions = jest.fn();
  const additional = {
    page: 1,
  };

  const mappedParams = {
    loadOptions,
    additional,
  };

  const useAsyncPaginate = jest.fn();

  useSelectFetchPure(
    () => mappedParams,
    useAsyncPaginate,
    {
      ...defaultParams,
      shouldLoadMore,
    },
  );

  expect(useAsyncPaginate).toBeCalledTimes(1);
  expect(useAsyncPaginate).toBeCalledWith(
    {
      ...defaultParams,
      loadOptions,
      additional,
      shouldLoadMore,
    },
    [],
  );
});

test('should provide correct deps to useAsyncPaginate', () => {
  const useAsyncPaginate = jest.fn();

  useSelectFetchPure(
    jest.fn(),
    useAsyncPaginate,
    defaultParams,
    [1, 2, 3],
  );

  expect(useAsyncPaginate).toBeCalledTimes(1);
  expect(useAsyncPaginate).toBeCalledWith(
    defaultParams,
    [1, 2, 3],
  );
});

test('should return correct result', () => {
  const expectedResult = {
    options: [],
    handleScrolledToBottom: jest.fn(),
    shouldLoadMore: jest.fn(),
    isLoading: false,
    isFirstLoad: false,
    menuIsOpen: false,
    inputValue: '',
    filterOption: null,
    onMenuOpen: jest.fn(),
    onMenuClose: jest.fn(),
    onInputChange: jest.fn(),
  };

  const result = useSelectFetchPure(
    jest.fn(),
    () => expectedResult,
    defaultParams,
    [1, 2, 3],
  );

  expect(result).toBe(expectedResult);
});
