import { legacy_createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import { getInitialState } from '../getInitialState';
import { createReducer } from '../createReducer';
import { loadMore } from '../thunks/loadMore';
import { requestOptions } from '../thunks/requestOptions';
import { setInputValue } from '../thunks/setInputValue';

import { setMenuIsOpen } from '../thunks/setMenuIsOpen';
import { getInitialCache } from '../getInitialCache';
import { reset } from '../thunks/reset';

import { createAsyncPaginateModel } from '../createAsyncPaginateModel';

import {
  RequestOptionsCaller,
} from '../types/internal';
import type {
  State,
} from '../types/internal';
import type {
  Params,
} from '../types/public';

jest.mock('redux');
const mockedCreateStore = jest.mocked(legacy_createStore);
const mockedApplyMiddleWare = jest.mocked(applyMiddleware);

const mockedWithExtraArgument = jest.spyOn(thunk, 'withExtraArgument');

jest.mock('../createReducer');
const mockedCreateReducer = jest.mocked(createReducer);

jest.mock('../getInitialCache');
const mockedGetInitialCache = jest.mocked(getInitialCache);

jest.mock('../getInitialState');
const mockedGetInitialState = jest.mocked(getInitialState);

jest.mock('../thunks/loadMore');
const mockedLoadMore = jest.mocked(loadMore);

jest.mock('../thunks/requestOptions');
const mockedRequestOptions = jest.mocked(requestOptions);

jest.mock('../thunks/reset');
const mockedReset = jest.mocked(reset);

jest.mock('../thunks/setInputValue');
const mockedSetInputValue = jest.mocked(setInputValue);

jest.mock('../thunks/setMenuIsOpen');
const mockedSetMenuIsOpen = jest.mocked(setMenuIsOpen);

const params: Params<any, any> = {
  loadOptions: jest.fn(),
};

const store = {
  dispatch: jest.fn(),
  getState: jest.fn(),
  subscribe: jest.fn(),
  replaceReducer: jest.fn(),
  [Symbol.observable]: jest.fn(),
};

beforeEach(() => {
  jest.resetAllMocks();

  mockedCreateStore.mockReturnValue(store);
});

test('should creare store with correct params', () => {
  const initalState: State<any, any> = {
    cache: {},
    inputValue: 'testInput',
    menuIsOpen: true,
  };

  mockedGetInitialState.mockReturnValue(initalState);

  const reducer = jest.fn();
  mockedCreateReducer.mockReturnValue(reducer);

  const thunkMiddleWare = jest.fn();
  mockedWithExtraArgument.mockReturnValue(thunkMiddleWare);

  const middleWare = jest.fn();
  mockedApplyMiddleWare.mockReturnValue(middleWare);

  createAsyncPaginateModel(params);

  expect(mockedGetInitialState).toHaveBeenCalledTimes(1);
  expect(mockedGetInitialState).toHaveBeenCalledWith(params);

  expect(mockedCreateReducer).toHaveBeenCalledTimes(1);
  expect(mockedCreateReducer).toHaveBeenCalledWith(
    params,
    initalState,
  );

  expect(mockedApplyMiddleWare).toHaveBeenCalledTimes(1);
  expect(mockedApplyMiddleWare).toHaveBeenCalledWith(thunkMiddleWare);

  expect(mockedCreateStore).toHaveBeenCalledTimes(1);
  expect(mockedCreateStore).toHaveBeenCalledWith(
    reducer,
    middleWare,
  );

  expect(mockedWithExtraArgument).toHaveBeenCalledTimes(1);
  const getParams = mockedWithExtraArgument.mock.calls[0][0] as () => Params<unknown, unknown>;

  expect(getParams()).toBe(params);
});

test('should open menu', () => {
  const model = createAsyncPaginateModel(params);

  const resThunk = jest.fn();
  mockedSetMenuIsOpen.mockReturnValue(resThunk);

  model.onToggleMenu(true);

  expect(store.dispatch).toHaveBeenCalledTimes(1);
  expect(store.dispatch).toHaveBeenCalledWith(resThunk);

  expect(mockedSetMenuIsOpen).toHaveBeenCalledTimes(1);
  expect(mockedSetMenuIsOpen).toHaveBeenCalledWith(true);
});

test('should close menu', () => {
  const model = createAsyncPaginateModel(params);

  const resThunk = jest.fn();
  mockedSetMenuIsOpen.mockReturnValue(resThunk);

  model.onToggleMenu(false);

  expect(store.dispatch).toHaveBeenCalledTimes(1);
  expect(store.dispatch).toHaveBeenCalledWith(resThunk);

  expect(mockedSetMenuIsOpen).toHaveBeenCalledTimes(1);
  expect(mockedSetMenuIsOpen).toHaveBeenCalledWith(false);
});

test('should change input value', () => {
  const model = createAsyncPaginateModel(params);

  const resThunk = jest.fn();
  mockedSetInputValue.mockReturnValue(resThunk);

  model.onChangeInputValue('test');

  expect(store.dispatch).toHaveBeenCalledTimes(1);
  expect(store.dispatch).toHaveBeenCalledWith(resThunk);

  expect(mockedSetInputValue).toHaveBeenCalledTimes(1);
  expect(mockedSetInputValue).toHaveBeenCalledWith('test');
});

test('should load more options', () => {
  const model = createAsyncPaginateModel(params);

  const resThunk = jest.fn();
  mockedLoadMore.mockReturnValue(resThunk);

  model.handleLoadMore();

  expect(store.dispatch).toHaveBeenCalledTimes(1);
  expect(store.dispatch).toHaveBeenCalledWith(resThunk);

  expect(mockedLoadMore).toHaveBeenCalledTimes(1);
});

test('should reset cached options', () => {
  const model = createAsyncPaginateModel(params);

  const resThunk = jest.fn();
  mockedReset.mockReturnValue(resThunk);

  model.handleReset();

  expect(store.dispatch).toHaveBeenCalledTimes(1);
  expect(store.dispatch).toHaveBeenCalledWith(resThunk);

  expect(mockedReset).toHaveBeenCalledTimes(1);
});

test('should return existed cache item for current value of input', () => {
  const state = {
    cache: {
      test: {
        isFirstLoad: false,
        isLoading: false,
        hasMore: true,
        options: [],
        additional: undefined,
      },
    },
    inputValue: 'test',
    menuIsOpen: false,
  };

  store.getState.mockReturnValue(state);

  const model = createAsyncPaginateModel(params);

  expect(model.getCurrentCache()).toBe(state.cache.test);

  expect(mockedGetInitialCache).toHaveBeenCalledTimes(0);
});

test('should compute cache item if cache for current value of input is not defined', () => {
  const state = {
    cache: {
      test: {
        isFirstLoad: false,
        isLoading: false,
        hasMore: true,
        options: [],
        additional: undefined,
      },
    },
    inputValue: 'test2',
    menuIsOpen: false,
  };

  store.getState.mockReturnValue(state);

  const expectedCacheItem = {
    isFirstLoad: true,
    isLoading: false,
    hasMore: false,
    options: [1, 2, 3],
    additional: 456,
  };

  mockedGetInitialCache.mockReturnValue(expectedCacheItem);

  const model = createAsyncPaginateModel(params);

  expect(model.getCurrentCache()).toBe(expectedCacheItem);

  expect(mockedGetInitialCache).toHaveBeenCalledTimes(1);
  expect(mockedGetInitialCache).toHaveBeenCalledWith(params);
});

test('should preovied `subscribe` of store', () => {
  const model = createAsyncPaginateModel(params);

  expect(model.subscribe).toBe(store.subscribe);
});

test('should not load options automatically on init if autoload is falsy', () => {
  createAsyncPaginateModel(params);

  expect(store.dispatch).toHaveBeenCalledTimes(0);
  expect(mockedRequestOptions).toHaveBeenCalledTimes(0);
});

test('should load options automatically on init if autoload is `true`', () => {
  const resThunk = jest.fn();
  mockedRequestOptions.mockReturnValue(resThunk);

  createAsyncPaginateModel({
    ...params,
    autoload: true,
  });

  expect(store.dispatch).toHaveBeenCalledTimes(1);
  expect(store.dispatch).toHaveBeenCalledWith(resThunk);

  expect(mockedRequestOptions).toHaveBeenCalledTimes(1);
  expect(mockedRequestOptions).toHaveBeenCalledWith(RequestOptionsCaller.Autoload);
});

test('should update params', () => {
  const nextParams: Params<any, any> = {
    loadOptions: jest.fn(),
    additional: 'otherAdditional',
    debounceTimeout: 1234,
  };

  const model = createAsyncPaginateModel(params);

  const getParams = mockedWithExtraArgument.mock.calls[0][0] as () => Params<unknown, unknown>;

  model.updateParams(nextParams);

  expect(getParams()).toBe(nextParams);
});
