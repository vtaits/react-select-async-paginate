import {
  useAsyncPaginateBase,
} from 'react-select-async-paginate';

import { useMapToAsyncPaginate } from '../useMapToAsyncPaginate';

import { useSelectFetchBase } from '../useSelectFetchBase';

jest.mock('react-select-async-paginate');
jest.mock('../useMapToAsyncPaginate');

beforeEach(() => {
  (useMapToAsyncPaginate as jest.Mock).mockReset();
});

afterEach(() => {
  jest.clearAllMocks();
});

const defaultParams = {
  url: '',
  inputValue: '',
  menuIsOpen: false,
};

test('should call useMapToAsyncPaginate with correct params', () => {
  useSelectFetchBase(
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

  (useMapToAsyncPaginate as jest.Mock).mockReturnValue(mappedParams);

  useSelectFetchBase(
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
  useSelectFetchBase(
    defaultParams,
    [1, 2, 3],
  );

  expect(useAsyncPaginateBase).toHaveBeenCalledTimes(1);
  expect(useAsyncPaginateBase).toHaveBeenCalledWith(
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

  (useAsyncPaginateBase as jest.Mock).mockReturnValue(expectedResult);

  const result = useSelectFetchBase(
    () => expectedResult,
    defaultParams,
    [1, 2, 3],
  );

  expect(result).toBe(expectedResult);
});
