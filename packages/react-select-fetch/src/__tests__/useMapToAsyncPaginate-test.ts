import {
  useCallback as reactUseCallback,
  useMemo as reactUseMemo,
} from 'react';

import type {
  Response,
} from 'react-select-async-paginate';

import {
  useMapToAsyncPaginatePure,
} from '../useMapToAsyncPaginate';

import type {
  MapResponse,
} from '../types';

const defaultUseCallback: typeof reactUseCallback = (callback) => callback;
const defaultUseMemo: typeof reactUseMemo = (callback) => callback();

const defaultParams = {
  url: '/test/',
};

test('should provide default additional', () => {
  const result = useMapToAsyncPaginatePure(
    defaultUseCallback,
    defaultUseMemo,
    defaultParams,
  );

  expect(result.additional).toEqual({
    page: 1,
  });
});

test('should redefine page in additional', () => {
  const result = useMapToAsyncPaginatePure(
    defaultUseCallback,
    defaultUseMemo,
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
  const get = jest.fn();

  const result = useMapToAsyncPaginatePure(
    defaultUseCallback,
    defaultUseMemo,
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

  expect(get.mock.calls.length).toBe(1);
  expect(get.mock.calls[0][0]).toBe('test-url');
  expect(get.mock.calls[0][1]).toEqual({
    param1: 'value1',
    param2: 'value2',
    search: 'testSearch',
    page: 10,
    offset: 3,
  });
});

test('should redefine search param name in query params', async () => {
  const get = jest.fn();

  const result = useMapToAsyncPaginatePure(
    defaultUseCallback,
    defaultUseMemo,
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

  expect(get.mock.calls.length).toBe(1);
  expect(get.mock.calls[0][0]).toBe('test-url');
  expect(get.mock.calls[0][1]).toEqual({
    param1: 'value1',
    param2: 'value2',
    search: 'testSearch',
    page: 10,
    offset: 3,
  });
});

test('should redefine page param name in query params', async () => {
  const get = jest.fn();

  const result = useMapToAsyncPaginatePure(
    defaultUseCallback,
    defaultUseMemo,
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

  expect(get.mock.calls.length).toBe(1);
  expect(get.mock.calls[0][0]).toBe('test-url');
  expect(get.mock.calls[0][1]).toEqual({
    param1: 'value1',
    param2: 'value2',
    search: 'testSearch',
    currentPage: 10,
    offset: 3,
  });
});

test('should not send page if page param name falsy', async () => {
  const get = jest.fn();

  const result = useMapToAsyncPaginatePure(
    defaultUseCallback,
    defaultUseMemo,
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

  expect(get.mock.calls.length).toBe(1);
  expect(get.mock.calls[0][0]).toBe('test-url');
  expect(get.mock.calls[0][1]).toEqual({
    param1: 'value1',
    param2: 'value2',
    search: 'testSearch',
    offset: 3,
  });
});

test('should redefine offset param name', async () => {
  const get = jest.fn();

  const result = useMapToAsyncPaginatePure(
    defaultUseCallback,
    defaultUseMemo,
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

  expect(get.mock.calls.length).toBe(1);
  expect(get.mock.calls[0][0]).toBe('test-url');
  expect(get.mock.calls[0][1]).toEqual({
    param1: 'value1',
    param2: 'value2',
    search: 'testSearch',
    page: 10,
    otherOffset: 3,
  });
});

test('should not send offset if offset param name falsy', async () => {
  const get = jest.fn();

  const result = useMapToAsyncPaginatePure(
    defaultUseCallback,
    defaultUseMemo,
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

  expect(get.mock.calls.length).toBe(1);
  expect(get.mock.calls[0][0]).toBe('test-url');
  expect(get.mock.calls[0][1]).toEqual({
    param1: 'value1',
    param2: 'value2',
    search: 'testSearch',
    page: 10,
  });
});

test('should return response with increased page in additional', async () => {
  const get = jest.fn(() => ({
    options: [4, 5, 6],
    hasMore: true,
  }));

  const result = useMapToAsyncPaginatePure(
    defaultUseCallback,
    defaultUseMemo,
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

  const mapResponse = jest.fn<Response, Parameters<MapResponse>>(({
    results,
    has_more: hasMore,
  }) => ({
    options: results,
    hasMore,
  }));

  const result = useMapToAsyncPaginatePure(
    defaultUseCallback,
    defaultUseMemo,
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

  expect(mapResponse.mock.calls.length).toBe(1);
  expect(mapResponse.mock.calls[0][0]).toBe(response);
  expect(mapResponse.mock.calls[0][1].search).toBe('testSearch');
  expect(mapResponse.mock.calls[0][1].prevPage).toBe(10);
  expect(mapResponse.mock.calls[0][1].prevOptions).toBe(prevOptions);
});

test('should return empty response on error', async () => {
  const get = jest.fn(() => {
    throw new Error('Test error');
  });

  const result = useMapToAsyncPaginatePure(
    defaultUseCallback,
    defaultUseMemo,
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
