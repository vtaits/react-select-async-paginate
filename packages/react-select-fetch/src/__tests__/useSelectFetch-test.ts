import {
  useAsyncPaginate,
} from 'react-select-async-paginate';

import { useSelectFetch } from '../useSelectFetch';

import { useMapToAsyncPaginate } from '../useMapToAsyncPaginate';

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
};

test('should call useMapToAsyncPaginate with correct params', () => {
  useSelectFetch(
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

  (useMapToAsyncPaginate as jest.Mock).mockReturnValue(mappedParams);

  useSelectFetch(
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
  useSelectFetch(
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

  (useAsyncPaginate as jest.Mock).mockReturnValue(expectedResult);

  const result = useSelectFetch(
    defaultParams,
    [1, 2, 3],
  );

  expect(result).toBe(expectedResult);
});
