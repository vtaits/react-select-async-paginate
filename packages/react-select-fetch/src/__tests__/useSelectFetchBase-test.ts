import {
  useAsyncPaginateBase,
} from 'react-select-async-paginate';

import { useMapToAsyncPaginate } from '../useMapToAsyncPaginate';

import { useSelectFetchBase } from '../useSelectFetchBase';

jest.mock('react-select-async-paginate');
jest.mock('../useMapToAsyncPaginate');

const mockedUseAsyncPaginateBase = jest.mocked(useAsyncPaginateBase);
const mockedUseMapToAsyncPaginate = jest.mocked(useMapToAsyncPaginate);

beforeEach(() => {
  mockedUseMapToAsyncPaginate.mockReset();
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

  expect(mockedUseMapToAsyncPaginate).toBeCalledTimes(1);
  expect(mockedUseMapToAsyncPaginate).toBeCalledWith(defaultParams);
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

  mockedUseMapToAsyncPaginate.mockReturnValue(mappedParams);

  useSelectFetchBase(
    {
      ...defaultParams,
      shouldLoadMore,
    },
  );

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

test('should provide correct deps to useAsyncPaginateBase', () => {
  useSelectFetchBase(
    defaultParams,
    [1, 2, 3],
  );

  expect(mockedUseAsyncPaginateBase).toHaveBeenCalledTimes(1);
  expect(mockedUseAsyncPaginateBase).toHaveBeenCalledWith(
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

  mockedUseAsyncPaginateBase.mockReturnValue(expectedResult);

  const result = useSelectFetchBase(
    defaultParams,
    [1, 2, 3],
  );

  expect(result).toBe(expectedResult);
});
