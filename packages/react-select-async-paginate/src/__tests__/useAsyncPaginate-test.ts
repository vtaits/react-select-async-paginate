import {
  useState as reactUseState,
  useCallback as reactUseCallbact,
} from 'react';

import {
  useAsyncPaginatePure,
} from '../useAsyncPaginate';

import type {
  OptionsList,
  UseAsyncPaginateParams,
  UseAsyncPaginateBaseResult,
  UseAsyncPaginateBaseParams,
} from '../types';

const defaultUseCallback: typeof reactUseCallbact = (fn) => fn;

const makeUseState = (): typeof reactUseState => jest.fn()
  .mockReturnValueOnce(['', (): void => {}])
  .mockReturnValueOnce([false, (): void => {}]);

const defaultParams: UseAsyncPaginateParams = {
  loadOptions: () => ({
    options: [],
  }),
};

const defaultUseAsyncPaginateBase = (): UseAsyncPaginateBaseResult => ({
  handleScrolledToBottom: (): void => {},
  shouldLoadMore: (): boolean => true,
  isLoading: true,
  isFirstLoad: true,
  options: [],
  filterOption: null,
});

test('should provide all params to useAsyncPaginateBase', () => {
  const useAsyncPaginateBase = jest.fn();

  const loadOptions = jest.fn();
  const reduceOptions = jest.fn();
  const shouldLoadMore = jest.fn();

  const deps = [1, 2, 3];

  const options: OptionsList = [
    {
      value: 1,
      label: '1',
    },

    {
      value: 2,
      label: '2',
    },
  ];

  const defaultOptions: OptionsList = [
    {
      value: 3,
      label: '3',
    },

    {
      value: 4,
      label: '4',
    },
  ];

  useAsyncPaginatePure(
    makeUseState(),
    defaultUseCallback,
    useAsyncPaginateBase,
    {
      loadOptions,
      options,
      defaultOptions,
      additional: 1234,
      loadOptionsOnMenuOpen: false,
      debounceTimeout: 5,
      reduceOptions,
      shouldLoadMore,
    },
    deps,
  );

  expect(useAsyncPaginateBase.mock.calls.length).toBe(1);

  const params = useAsyncPaginateBase.mock.calls[0][0];

  expect(params.loadOptions).toBe(loadOptions);
  expect(params.options).toBe(options);
  expect(params.defaultOptions).toBe(defaultOptions);
  expect(params.additional).toBe(1234);
  expect(params.loadOptionsOnMenuOpen).toBe(false);
  expect(params.debounceTimeout).toBe(5);
  expect(params.reduceOptions).toBe(reduceOptions);
  expect(params.shouldLoadMore).toBe(shouldLoadMore);

  expect(useAsyncPaginateBase.mock.calls[0][1]).toBe(deps);
});

test('should return all fields from of useAsyncPaginateBase', () => {
  const handleScrolledToBottom = jest.fn();
  const shouldLoadMore = jest.fn();
  const filterOption = jest.fn();

  const options: OptionsList = [
    {
      value: 1,
      label: '1',
    },

    {
      value: 2,
      label: '2',
    },
  ];

  const result = useAsyncPaginatePure(
    makeUseState(),
    defaultUseCallback,
    () => ({
      handleScrolledToBottom,
      shouldLoadMore,
      isLoading: true,
      isFirstLoad: true,
      options,
      filterOption,
    }),
    defaultParams,
  );

  expect(result.handleScrolledToBottom).toBe(handleScrolledToBottom);
  expect(result.shouldLoadMore).toBe(shouldLoadMore);
  expect(result.isLoading).toBe(true);
  expect(result.isFirstLoad).toBe(true);
  expect(result.options).toBe(options);
});

test('should provide inputValue to useAsyncPaginateBase and response', () => {
  const useAsyncPaginateBase = jest.fn<
  UseAsyncPaginateBaseResult,
  [UseAsyncPaginateBaseParams]
  >(defaultUseAsyncPaginateBase);

  const result = useAsyncPaginatePure(
    jest.fn()
      .mockReturnValueOnce(['test', (): void => {}])
      .mockReturnValueOnce([false, (): void => {}]),
    defaultUseCallback,
    useAsyncPaginateBase,
    defaultParams,
  );

  const params = useAsyncPaginateBase.mock.calls[0][0];

  expect(result.inputValue).toBe('test');
  expect(params.inputValue).toBe('test');
});

test('should change inputValue on input change', () => {
  const setInputValue = jest.fn();

  const result = useAsyncPaginatePure(
    jest.fn()
      .mockReturnValueOnce(['test', setInputValue])
      .mockReturnValueOnce([false, (): void => {}]),
    defaultUseCallback,
    defaultUseAsyncPaginateBase,
    defaultParams,
  );

  result.onInputChange('test2');

  expect(setInputValue.mock.calls.length).toBe(1);
  expect(setInputValue.mock.calls[0][0]).toBe('test2');
});

test('should provide truthy menuIsOpen to useAsyncPaginateBase and response', () => {
  const useAsyncPaginateBase = jest.fn<
  UseAsyncPaginateBaseResult,
  [UseAsyncPaginateBaseParams]
  >(defaultUseAsyncPaginateBase);

  const result = useAsyncPaginatePure(
    jest.fn()
      .mockReturnValueOnce(['', (): void => {}])
      .mockReturnValueOnce([true, (): void => {}]),
    defaultUseCallback,
    useAsyncPaginateBase,
    defaultParams,
  );

  const params = useAsyncPaginateBase.mock.calls[0][0];

  expect(result.menuIsOpen).toBe(true);
  expect(params.menuIsOpen).toBe(true);
});

test('should provide falsy menuIsOpen to useAsyncPaginateBase and response', () => {
  const useAsyncPaginateBase = jest.fn<
  UseAsyncPaginateBaseResult,
  [UseAsyncPaginateBaseParams]
  >(defaultUseAsyncPaginateBase);

  const result = useAsyncPaginatePure(
    jest.fn()
      .mockReturnValueOnce(['', (): void => {}])
      .mockReturnValueOnce([false, (): void => {}]),
    defaultUseCallback,
    useAsyncPaginateBase,
    defaultParams,
  );

  const params = useAsyncPaginateBase.mock.calls[0][0];

  expect(result.menuIsOpen).toBe(false);
  expect(params.menuIsOpen).toBe(false);
});

test('should open menu', () => {
  const setMenuIsOpen = jest.fn();

  const result = useAsyncPaginatePure(
    jest.fn()
      .mockReturnValueOnce(['', (): void => {}])
      .mockReturnValueOnce([false, setMenuIsOpen]),
    defaultUseCallback,
    defaultUseAsyncPaginateBase,
    defaultParams,
  );

  result.onMenuOpen();

  expect(setMenuIsOpen.mock.calls.length).toBe(1);
  expect(setMenuIsOpen.mock.calls[0][0]).toBe(true);
});

test('should close menu', () => {
  const setMenuIsOpen = jest.fn();

  const result = useAsyncPaginatePure(
    jest.fn()
      .mockReturnValueOnce(['', (): void => {}])
      .mockReturnValueOnce([true, setMenuIsOpen]),
    defaultUseCallback,
    defaultUseAsyncPaginateBase,
    defaultParams,
  );

  result.onMenuClose();

  expect(setMenuIsOpen.mock.calls.length).toBe(1);
  expect(setMenuIsOpen.mock.calls[0][0]).toBe(false);
});
