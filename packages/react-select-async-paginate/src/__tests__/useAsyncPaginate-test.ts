import {
  useState,
} from 'react';

import type {
  GroupBase,
  OptionsOrGroups,
} from 'react-select';

import { useAsyncPaginateBase } from '../useAsyncPaginateBase';

import {
  useAsyncPaginate,
} from '../useAsyncPaginate';

import type {
  UseAsyncPaginateParams,
  UseAsyncPaginateBaseResult,
} from '../types';

jest.mock('react', () => ({
  ...jest.requireActual('react'),

  useState: jest.fn(),

  // eslint-disable-next-line @typescript-eslint/ban-types
  useCallback: jest.fn(<T extends Function>(callback: T) => callback),
}));

jest.mock('../useAsyncPaginateBase');

const mockedUseAsyncPaginateBase = jest.mocked(useAsyncPaginateBase, true);
const mockedUseState = jest.mocked(useState, true);

beforeEach(() => {
  mockedUseAsyncPaginateBase.mockReturnValue({
    handleScrolledToBottom: (): void => {},
    shouldLoadMore: (): boolean => true,
    isLoading: true,
    isFirstLoad: true,
    options: [],
    filterOption: null,
  });

  mockedUseState
    .mockReturnValueOnce(['', (): void => {}])
    .mockReturnValueOnce([false, (): void => {}]);
});

afterEach(() => {
  jest.clearAllMocks();
});

const defaultParams: UseAsyncPaginateParams<any, any, any> = {
  loadOptions: () => ({
    options: [],
  }),
};

test('should provide all params to useAsyncPaginateBase', () => {
  const loadOptions = jest.fn();
  const reduceOptions = jest.fn();
  const shouldLoadMore = jest.fn();

  const deps = [1, 2, 3];

  type OptionType = {
    value: number;
    label: string;
  };

  const options: OptionsOrGroups<OptionType, GroupBase<OptionType>> = [
    {
      value: 1,
      label: '1',
    },

    {
      value: 2,
      label: '2',
    },
  ];

  const defaultOptions: OptionsOrGroups<OptionType, GroupBase<OptionType>> = [
    {
      value: 3,
      label: '3',
    },

    {
      value: 4,
      label: '4',
    },
  ];

  useAsyncPaginate(
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

  expect(useAsyncPaginateBase).toHaveBeenCalledTimes(1);

  const params = mockedUseAsyncPaginateBase.mock.calls[0][0];

  expect(params.loadOptions).toBe(loadOptions);
  expect(params.options).toBe(options);
  expect(params.defaultOptions).toBe(defaultOptions);
  expect(params.additional).toBe(1234);
  expect(params.loadOptionsOnMenuOpen).toBe(false);
  expect(params.debounceTimeout).toBe(5);
  expect(params.reduceOptions).toBe(reduceOptions);
  expect(params.shouldLoadMore).toBe(shouldLoadMore);

  expect(mockedUseAsyncPaginateBase.mock.calls[0][1]).toBe(deps);
});

test('should return all fields from of useAsyncPaginateBase', () => {
  const handleScrolledToBottom = jest.fn();
  const shouldLoadMore = jest.fn();
  const filterOption = jest.fn();

  type OptionType = {
    value: number;
    label: string;
  };

  const options: UseAsyncPaginateBaseResult<OptionType, GroupBase<OptionType>>['options'] = [
    {
      value: 1,
      label: '1',
    },

    {
      value: 2,
      label: '2',
    },
  ];

  mockedUseAsyncPaginateBase.mockReturnValue({
    handleScrolledToBottom,
    shouldLoadMore,
    isLoading: true,
    isFirstLoad: true,
    options,
    filterOption,
  });

  const result = useAsyncPaginate<OptionType, GroupBase<OptionType>, null>(
    defaultParams,
  );

  expect(result.handleScrolledToBottom).toBe(handleScrolledToBottom);
  expect(result.shouldLoadMore).toBe(shouldLoadMore);
  expect(result.isLoading).toBe(true);
  expect(result.isFirstLoad).toBe(true);
  expect(result.options).toBe(options);
});

test('should provide inputValue from state to useAsyncPaginateBase and response', () => {
  mockedUseState.mockReset();
  mockedUseState
    .mockReturnValueOnce(['test', (): void => {}])
    .mockReturnValueOnce([false, (): void => {}]);

  const result = useAsyncPaginate(defaultParams);

  const params = mockedUseAsyncPaginateBase.mock.calls[0][0];

  expect(result.inputValue).toBe('test');
  expect(params.inputValue).toBe('test');
});

test('should provide inputValue from params to useAsyncPaginateBase and response', () => {
  mockedUseState.mockReset();
  mockedUseState
    .mockReturnValueOnce(['test', (): void => {}])
    .mockReturnValueOnce([false, (): void => {}]);

  const result = useAsyncPaginate(
    {
      ...defaultParams,
      inputValue: 'test2',
    },
  );

  const params = mockedUseAsyncPaginateBase.mock.calls[0][0];

  expect(result.inputValue).toBe('test2');
  expect(params.inputValue).toBe('test2');
});

test('should use defaultInputValue from params as initial value for the inputValue state', () => {
  const defaultInputValue = 'test3';

  mockedUseState.mockReset();
  mockedUseState
    .mockReturnValueOnce([defaultInputValue, (): void => {}])
    .mockReturnValueOnce([false, (): void => {}]);

  const result = useAsyncPaginate(
    {
      ...defaultParams,
      defaultInputValue,
    },
  );

  expect(useState).toHaveBeenCalledTimes(2);
  expect(useState).toHaveBeenNthCalledWith(1, defaultInputValue);
  expect(useState).toHaveBeenNthCalledWith(2, false);

  expect(result.inputValue).toBe(defaultInputValue);
});

test('should change local inputValue on input change', () => {
  const setInputValue = jest.fn();

  mockedUseState.mockReset();
  mockedUseState
    .mockReturnValueOnce(['test', setInputValue])
    .mockReturnValueOnce([false, (): void => {}]);

  const result = useAsyncPaginate(defaultParams);

  result.onInputChange('test2', {
    action: 'set-value',
    prevInputValue: 'test1',
  });

  expect(setInputValue).toHaveBeenCalledTimes(1);
  expect(setInputValue.mock.calls[0][0]).toBe('test2');
});

test('should change local inputValue and call onInputChange param on input change', () => {
  const setInputValue = jest.fn();
  const onInputChange = jest.fn();

  mockedUseState.mockReset();
  mockedUseState
    .mockReturnValueOnce(['test', setInputValue])
    .mockReturnValueOnce([false, (): void => {}]);

  const result = useAsyncPaginate(
    {
      ...defaultParams,
      onInputChange,
    },
  );

  result.onInputChange('test2', {
    action: 'set-value',
    prevInputValue: 'test1',
  });

  expect(setInputValue.mock.calls.length).toBe(1);
  expect(setInputValue.mock.calls[0][0]).toBe('test2');

  expect(onInputChange).toBeCalledTimes(1);
  expect(onInputChange).toHaveBeenCalledWith('test2', {
    action: 'set-value',
    prevInputValue: 'test1',
  });
});

test('should provide truthy menuIsOpen from state to useAsyncPaginateBase and response', () => {
  mockedUseState.mockReset();
  mockedUseState
    .mockReturnValueOnce(['', (): void => {}])
    .mockReturnValueOnce([true, (): void => {}]);

  const result = useAsyncPaginate(
    defaultParams,
  );

  const params = mockedUseAsyncPaginateBase.mock.calls[0][0];

  expect(result.menuIsOpen).toBe(true);
  expect(params.menuIsOpen).toBe(true);
});

test('should provide truthy menuIsOpen from params to useAsyncPaginateBase and response', () => {
  mockedUseState.mockReset();
  mockedUseState
    .mockReturnValueOnce(['', (): void => {}])
    .mockReturnValueOnce([false, (): void => {}]);

  const result = useAsyncPaginate(
    {
      ...defaultParams,
      menuIsOpen: true,
    },
  );

  const params = mockedUseAsyncPaginateBase.mock.calls[0][0];

  expect(result.menuIsOpen).toBe(true);
  expect(params.menuIsOpen).toBe(true);
});

test('should provide falsy menuIsOpen from state to useAsyncPaginateBase and response', () => {
  mockedUseState.mockReset();
  mockedUseState
    .mockReturnValueOnce(['', (): void => {}])
    .mockReturnValueOnce([false, (): void => {}]);

  const result = useAsyncPaginate(
    defaultParams,
  );

  const params = mockedUseAsyncPaginateBase.mock.calls[0][0];

  expect(result.menuIsOpen).toBe(false);
  expect(params.menuIsOpen).toBe(false);
});

test('should provide falsy menuIsOpen from params to useAsyncPaginateBase and response', () => {
  mockedUseState.mockReset();
  mockedUseState
    .mockReturnValueOnce(['', (): void => {}])
    .mockReturnValueOnce([true, (): void => {}]);

  const result = useAsyncPaginate(
    {
      ...defaultParams,
      menuIsOpen: false,
    },
  );

  const params = mockedUseAsyncPaginateBase.mock.calls[0][0];

  expect(result.menuIsOpen).toBe(false);
  expect(params.menuIsOpen).toBe(false);
});

test('should use defaultMenuIsOpen from params as initial value for the menuIsOpen state', () => {
  const defaultMenuIsOpen = true;

  mockedUseState.mockReset();
  mockedUseState
    .mockReturnValueOnce(['', (): void => {}])
    .mockReturnValueOnce([defaultMenuIsOpen, (): void => {}]);

  const result = useAsyncPaginate(
    {
      ...defaultParams,
      defaultMenuIsOpen,
    },
  );

  expect(useState).toHaveBeenCalledTimes(2);
  expect(useState).toHaveBeenNthCalledWith(1, '');
  expect(useState).toHaveBeenNthCalledWith(2, defaultMenuIsOpen);

  expect(result.menuIsOpen).toBe(true);
});

test('should open menu', () => {
  const setMenuIsOpen = jest.fn();

  mockedUseState.mockReset();
  mockedUseState
    .mockReturnValueOnce(['', (): void => {}])
    .mockReturnValueOnce([false, setMenuIsOpen]);

  const result = useAsyncPaginate(
    defaultParams,
  );

  result.onMenuOpen();

  expect(setMenuIsOpen).toHaveBeenCalledTimes(1);
  expect(setMenuIsOpen).toHaveBeenCalledWith(true);
});

test('should open menu and call onMenuOpen param', () => {
  const setMenuIsOpen = jest.fn();
  const onMenuOpen = jest.fn();

  mockedUseState.mockReset();
  mockedUseState
    .mockReturnValueOnce(['', (): void => {}])
    .mockReturnValueOnce([false, setMenuIsOpen]);

  const result = useAsyncPaginate(
    {
      ...defaultParams,
      onMenuOpen,
    },
  );

  result.onMenuOpen();

  expect(setMenuIsOpen).toHaveBeenCalledTimes(1);
  expect(setMenuIsOpen).toHaveBeenCalledWith(true);

  expect(onMenuOpen).toHaveBeenCalledTimes(1);
});

test('should close menu', () => {
  const setMenuIsOpen = jest.fn();

  mockedUseState.mockReset();
  mockedUseState
    .mockReturnValueOnce(['', (): void => {}])
    .mockReturnValueOnce([true, setMenuIsOpen]);

  const result = useAsyncPaginate(
    defaultParams,
  );

  result.onMenuClose();

  expect(setMenuIsOpen).toHaveBeenCalledTimes(1);
  expect(setMenuIsOpen).toHaveBeenCalledWith(false);
});

test('should close menu', () => {
  const setMenuIsOpen = jest.fn();
  const onMenuClose = jest.fn();

  mockedUseState.mockReset();
  mockedUseState
    .mockReturnValueOnce(['', (): void => {}])
    .mockReturnValueOnce([true, setMenuIsOpen]);

  const result = useAsyncPaginate(
    {
      ...defaultParams,
      onMenuClose,
    },
  );

  result.onMenuClose();

  expect(setMenuIsOpen).toHaveBeenCalledTimes(1);
  expect(setMenuIsOpen).toHaveBeenCalledWith(false);

  expect(onMenuClose).toHaveBeenCalledTimes(1);
});
