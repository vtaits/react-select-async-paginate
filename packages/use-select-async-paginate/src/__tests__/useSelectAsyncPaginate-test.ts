import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';

import { createAsyncPaginateModel } from 'select-async-paginate-model';
import type {
  Model,
  OptionsCacheItem,
  Params,
} from 'select-async-paginate-model';

import { useSelectAsyncPaginate } from '../useSelectAsyncPaginate';

jest.mock('react');

const mockedUseEffect = jest.mocked(useEffect);
const mockedUseRef = jest.mocked(useRef);
const mockedUseState = jest.mocked(useState);
const mockedUseSyncExternalStore = jest.mocked(useSyncExternalStore);

jest.mock('select-async-paginate-model');

const mockedCreateAsyncPaginateModel = jest.mocked(createAsyncPaginateModel);

const testParams: Params<unknown, unknown> = {
  loadOptions: jest.fn(),
};

const testModel: Model<unknown, unknown> = {
  getCurrentCache: jest.fn(),
  handleLoadMore: jest.fn(),
  handleReset: jest.fn(),
  onChangeInputValue: jest.fn(),
  onToggleMenu: jest.fn(),
  subscribe: jest.fn(),
  updateParams: jest.fn(),
};

const testCacheItem: OptionsCacheItem<unknown, unknown> = {
  hasMore: true,
  isFirstLoad: true,
  isLoading: true,
  options: [1, 2, 3],
  additional: null,
};

beforeEach(() => {
  jest.resetAllMocks();

  mockedUseRef.mockReturnValue({
    current: true,
  });

  mockedUseState.mockReturnValue([testModel, jest.fn()]);

  mockedUseSyncExternalStore.mockReturnValue(testCacheItem);

  mockedCreateAsyncPaginateModel.mockReturnValue(testModel);
});

test('should create model correctly', () => {
  const result = useSelectAsyncPaginate(testParams);

  expect(result).toEqual([
    testCacheItem,
    testModel,
  ]);

  expect(mockedUseState).toHaveBeenCalledTimes(1);

  const initState = (mockedUseState.mock.calls[0] as unknown as [() => unknown])[0];
  expect(initState()).toBe(testModel);

  expect(mockedUseSyncExternalStore).toHaveBeenCalledTimes(1);
  expect(mockedUseSyncExternalStore).toHaveBeenCalledWith(
    testModel.subscribe,
    testModel.getCurrentCache,
  );
});

test('should provide an empty array of deps to `useEffect` by default', () => {
  useSelectAsyncPaginate(testParams);

  expect(mockedUseEffect).toHaveBeenCalledTimes(1);
  expect(mockedUseEffect.mock.calls[0][1]).toEqual([]);
});

test('should provide deps from the 2nd argument to `useEffect`', () => {
  const testDeps = [1, 2, 3];

  useSelectAsyncPaginate(testParams, testDeps);

  expect(mockedUseEffect).toHaveBeenCalledTimes(1);
  expect(mockedUseEffect.mock.calls[0][1]).toBe(testDeps);
});

test('should not reset the model on the first render', () => {
  const testRef = {
    current: true,
  };

  mockedUseRef.mockReturnValue(testRef);

  useSelectAsyncPaginate(testParams);

  expect(mockedUseEffect).toHaveBeenCalledTimes(1);
  const [effect] = mockedUseEffect.mock.calls[0];

  effect();

  expect(testRef.current).toBe(false);
  expect(testModel.handleReset).toHaveBeenCalledTimes(0);
});

test('should reset the model if some of deps is changed', () => {
  const testRef = {
    current: false,
  };

  mockedUseRef.mockReturnValue(testRef);

  useSelectAsyncPaginate(testParams);

  expect(mockedUseEffect).toHaveBeenCalledTimes(1);
  const [effect] = mockedUseEffect.mock.calls[0];

  effect();

  expect(testRef.current).toBe(false);
  expect(testModel.handleReset).toHaveBeenCalledTimes(1);
});
