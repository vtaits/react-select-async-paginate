import {
  useSelectFetchBasePure,
} from '../useSelectFetchBase';

const defaultParams = {
  url: '',
  inputValue: '',
  menuIsOpen: false,
};

test('should call useMapToAsyncPaginate with correct params', () => {
  const useMapToAsyncPaginate = jest.fn();
  const useAsyncPaginateBase = jest.fn();

  useSelectFetchBasePure(
    useMapToAsyncPaginate,
    useAsyncPaginateBase,
    defaultParams,
  );

  expect(useMapToAsyncPaginate).toBeCalledTimes(1);
  expect(useMapToAsyncPaginate).toBeCalledWith(defaultParams);
});

test('should call useAsyncPaginateBase with correct params', () => {
  const shouldLoadMore = jest.fn();
  const loadOptions = jest.fn();
  const additional = {
    page: 1,
  };

  const mappedParams = {
    loadOptions,
    additional,
  };

  const useAsyncPaginateBase = jest.fn();

  useSelectFetchBasePure(
    () => mappedParams,
    useAsyncPaginateBase,
    {
      ...defaultParams,
      shouldLoadMore,
    },
  );

  expect(useAsyncPaginateBase).toBeCalledTimes(1);
  expect(useAsyncPaginateBase).toBeCalledWith(
    {
      ...defaultParams,
      loadOptions,
      additional,
      shouldLoadMore,
    },
    [],
  );
});

test('should provide correct deps to useAsyncPaginateBase', () => {
  const useAsyncPaginateBase = jest.fn();

  useSelectFetchBasePure(
    jest.fn(),
    useAsyncPaginateBase,
    defaultParams,
    [1, 2, 3],
  );

  expect(useAsyncPaginateBase).toBeCalledTimes(1);
  expect(useAsyncPaginateBase).toBeCalledWith(
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

  const result = useSelectFetchBasePure(
    jest.fn(),
    () => expectedResult,
    defaultParams,
    [1, 2, 3],
  );

  expect(result).toBe(expectedResult);
});
