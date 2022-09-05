import type {
  GroupBase,
} from 'react-select';

import type {
  Response,
} from 'react-select-async-paginate';

import { useMapToAsyncPaginate } from '../useMapToAsyncPaginate';

import type {
  MapResponse,
  Additional,
} from '../types';

jest.mock('react', () => ({
  ...jest.requireActual('react'),

  // eslint-disable-next-line @typescript-eslint/ban-types
  useCallback: jest.fn(<T extends Function>(callback: T) => callback),

  useMemo: jest.fn(<T>(callback: () => T) => callback()),
}));

afterEach(() => {
  jest.clearAllMocks();
});

const defaultParams = {
  url: '/test/',
};

test('should provide default additional', () => {
  const result = useMapToAsyncPaginate(
    defaultParams,
  );

  expect(result.additional).toEqual({
    page: 1,
  });
});

test('should redefine page in additional', () => {
  const result = useMapToAsyncPaginate(
    {
      ...defaultParams,
      initialPage: 3,
    },
  );

  expect(result.additional).toEqual({
    page: 3,
  });
});

test('should call get with default arguments', async () => {
  const get = jest.fn()
    .mockReturnValue({
      options: [],
    });

  const result = useMapToAsyncPaginate(
    {
      ...defaultParams,
      url: 'test-url',
      queryParams: {
        param1: 'value1',
        param2: 'value2',
      },
      get,
    },
  );

  await result.loadOptions('testSearch', [1, 2, 3], { page: 10 });

  expect(get).toHaveBeenCalledTimes(1);
  expect(get).toHaveBeenCalledWith(
    'test-url',
    {
      param1: 'value1',
      param2: 'value2',
      search: 'testSearch',
      page: 10,
      offset: 3,
    },
  );
});

test('should redefine search param name in query params', async () => {
  const get = jest.fn()
    .mockReturnValue({
      options: [],
    });

  const result = useMapToAsyncPaginate(
    {
      ...defaultParams,
      url: 'test-url',
      queryParams: {
        param1: 'value1',
        param2: 'value2',
      },
      searchParamName: 'search',
      get,
    },
  );

  await result.loadOptions('testSearch', [1, 2, 3], { page: 10 });

  expect(get).toHaveBeenCalledTimes(1);
  expect(get).toHaveBeenCalledWith(
    'test-url',
    {
      param1: 'value1',
      param2: 'value2',
      search: 'testSearch',
      page: 10,
      offset: 3,
    },
  );
});

test('should redefine page param name in query params', async () => {
  const get = jest.fn()
    .mockReturnValue({
      options: [],
    });

  const result = useMapToAsyncPaginate(
    {
      ...defaultParams,
      url: 'test-url',
      queryParams: {
        param1: 'value1',
        param2: 'value2',
      },
      pageParamName: 'currentPage',
      get,
    },
  );

  await result.loadOptions('testSearch', [1, 2, 3], { page: 10 });

  expect(get).toHaveBeenCalledTimes(1);
  expect(get).toHaveBeenCalledWith(
    'test-url',
    {
      param1: 'value1',
      param2: 'value2',
      search: 'testSearch',
      currentPage: 10,
      offset: 3,
    },
  );
});

test('should not send page if page param name is null', async () => {
  const get = jest.fn()
    .mockReturnValue({
      options: [],
    });

  const result = useMapToAsyncPaginate(
    {
      ...defaultParams,
      url: 'test-url',
      queryParams: {
        param1: 'value1',
        param2: 'value2',
      },
      pageParamName: null,
      get,
    },
  );

  await result.loadOptions('testSearch', [1, 2, 3], { page: 10 });

  expect(get).toHaveBeenCalledTimes(1);
  expect(get).toHaveBeenCalledWith(
    'test-url',
    {
      param1: 'value1',
      param2: 'value2',
      search: 'testSearch',
      offset: 3,
    },
  );
});

test('should redefine offset param name', async () => {
  const get = jest.fn()
    .mockReturnValue({
      options: [],
    });

  const result = useMapToAsyncPaginate(
    {
      ...defaultParams,
      url: 'test-url',
      queryParams: {
        param1: 'value1',
        param2: 'value2',
      },
      offsetParamName: 'otherOffset',
      get,
    },
  );

  await result.loadOptions('testSearch', [1, 2, 3], { page: 10 });

  expect(get).toHaveBeenCalledTimes(1);
  expect(get).toHaveBeenCalledWith(
    'test-url',
    {
      param1: 'value1',
      param2: 'value2',
      search: 'testSearch',
      page: 10,
      otherOffset: 3,
    },
  );
});

test('should not send offset if offset param name is null', async () => {
  const get = jest.fn()
    .mockReturnValue({
      options: [],
    });

  const result = useMapToAsyncPaginate(
    {
      ...defaultParams,
      url: 'test-url',
      queryParams: {
        param1: 'value1',
        param2: 'value2',
      },
      offsetParamName: null,
      get,
    },
  );

  await result.loadOptions('testSearch', [1, 2, 3], { page: 10 });

  expect(get).toHaveBeenCalledTimes(1);
  expect(get).toHaveBeenCalledWith(
    'test-url',
    {
      param1: 'value1',
      param2: 'value2',
      search: 'testSearch',
      page: 10,
    },
  );
});

test('should return response with increased page in additional', async () => {
  const get = jest.fn().mockReturnValue({
    options: [4, 5, 6],
    hasMore: true,
  });

  const result = useMapToAsyncPaginate(
    {
      ...defaultParams,
      get,
    },
  );

  const response = await result.loadOptions('testSearch', [1, 2, 3], { page: 10 });

  expect(response).toEqual({
    options: [4, 5, 6],
    hasMore: true,

    additional: {
      page: 11,
    },
  });
});

test('should return mapped response with increased page in additional', async () => {
  const response = {
    results: [4, 5, 6],
    has_more: true,
  };

  const get = jest.fn(() => response);

  const mapResponse = jest.fn<
  Response<number, GroupBase<number>, Additional>,
  Parameters<MapResponse<number, GroupBase<number>>>
  >(({
    results,
    has_more: hasMore,
  }) => ({
    options: results,
    hasMore,
  }));

  const result = useMapToAsyncPaginate(
    {
      ...defaultParams,
      get,
      mapResponse,
    },
  );

  const prevOptions = [1, 2, 3];

  const loadOptionsResponse = await result.loadOptions('testSearch', prevOptions, { page: 10 });

  expect(loadOptionsResponse).toEqual({
    options: [4, 5, 6],
    hasMore: true,

    additional: {
      page: 11,
    },
  });

  expect(mapResponse).toBeCalledTimes(1);
  expect(mapResponse).toHaveBeenCalledWith(
    response,
    {
      search: 'testSearch',
      prevPage: 10,
      prevOptions,
    },
  );
});

test('should return empty response on error', async () => {
  const get = jest.fn(() => {
    throw new Error('Test error');
  });

  const result = useMapToAsyncPaginate(
    {
      ...defaultParams,
      get,
    },
  );

  const response = await result.loadOptions('testSearch', [1, 2, 3], { page: 10 });

  expect(response).toEqual({
    options: [],
    hasMore: false,
  });
});
