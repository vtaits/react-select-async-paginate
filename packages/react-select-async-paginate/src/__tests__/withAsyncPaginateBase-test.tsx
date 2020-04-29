import React from 'react';
import type {
  FC,
} from 'react';
import { shallow } from 'enzyme';
import type {
  ShallowWrapper,
} from 'enzyme';
import type {
  OptionsType,
  SelectComponentsConfig,
} from 'react-select';

import { withAsyncPaginateBase } from '../withAsyncPaginateBase';
import type {
  Props,
} from '../withAsyncPaginateBase';

import type {
  UseAsyncPaginateBaseResult,
  LoadOptions,
} from '../types';

const TestComponent: FC = () => <div />;

const AsyncPagintateBase = withAsyncPaginateBase(TestComponent);

type PageObject = {
  getChildNode: () => ShallowWrapper;
};

const defaultLoadOptions: LoadOptions = () => ({
  options: [],
});

const defaultProps = {
  loadOptions: defaultLoadOptions,
  inputValue: '',
  menuIsOpen: false,

  useComponents: (): SelectComponentsConfig<any> => ({}),

  useAsyncPaginateBase: (): UseAsyncPaginateBaseResult => ({
    handleScrolledToBottom: (): void => {},
    shouldLoadMore: (): boolean => true,
    isLoading: true,
    isFirstLoad: true,
    options: [],
    filterOption: null,
  }),
};

const setup = (props: Partial<Props>): PageObject => {
  const wrapper: ShallowWrapper = shallow(
    <AsyncPagintateBase
      {...defaultProps}
      {...props}
    />,
  );

  const getChildNode = (): ShallowWrapper => wrapper.find(TestComponent);

  return {
    getChildNode,
  };
};

test('should provide props from parent to child', () => {
  const getOptionLabel = jest.fn();

  const page = setup({
    getOptionLabel,
  });

  const childNode = page.getChildNode();

  expect(childNode.prop('getOptionLabel')).toBe(getOptionLabel);
});

test('should provide props from hook to child', () => {
  const options: OptionsType<any> = [
    {
      value: 1,
      label: '1',
    },
  ];

  const useAsyncPaginateBase = (): UseAsyncPaginateBaseResult => ({
    handleScrolledToBottom: (): void => {},
    shouldLoadMore: (): boolean => true,
    isLoading: true,
    isFirstLoad: true,
    filterOption: null,
    options,
  });

  const page = setup({
    useAsyncPaginateBase,
  });

  const childNode = page.getChildNode();

  expect(childNode.prop('isLoading')).toBe(true);
  expect(childNode.prop('isFirstLoad')).toBe(true);
  expect(childNode.prop('filterOption')).toBe(null);
  expect(childNode.prop('options')).toBe(options);
});

test('should redefine parent props with hook props', () => {
  const optionsProp: OptionsType<any> = [
    {
      value: 1,
      label: '1',
    },
  ];

  const optionsHookResult: OptionsType<any> = [
    {
      value: 1,
      label: '1',
    },
  ];

  const useAsyncPaginateBase = (): UseAsyncPaginateBaseResult => ({
    handleScrolledToBottom: (): void => {},
    shouldLoadMore: (): boolean => true,
    isLoading: true,
    isFirstLoad: true,
    filterOption: null,
    options: optionsHookResult,
  });

  const page = setup({
    options: optionsProp,
    useAsyncPaginateBase,
  });

  const childNode = page.getChildNode();

  expect(childNode.prop('options')).toBe(optionsHookResult);
});

test('should call hook with correct params', () => {
  const options = [
    {
      value: 1,
      label: '1',
    },
  ];

  const useAsyncPaginateBase = jest.fn();

  const Test: FC = () => <div />;

  setup({
    components: {
      Menu: Test,
    },

    selectRef: () => {},
    cacheUniqs: [1, 2, 3],
    options,
    useAsyncPaginateBase,
  });

  expect(useAsyncPaginateBase.mock.calls.length).toBe(1);

  const params = useAsyncPaginateBase.mock.calls[0][0];

  expect(params.options).toBe(options);
  // eslint-disable-next-line no-prototype-builtins
  expect(params.hasOwnProperty('selectRef')).toBe(false);
  // eslint-disable-next-line no-prototype-builtins
  expect(params.hasOwnProperty('cacheUniqs')).toBe(false);
  // eslint-disable-next-line no-prototype-builtins
  expect(params.hasOwnProperty('useAsyncPaginateBase')).toBe(false);
});

test('should call hook with empty deps', () => {
  const useAsyncPaginateBase = jest.fn();

  setup({
    useAsyncPaginateBase,
  });

  expect(useAsyncPaginateBase.mock.calls[0][1].length).toBe(0);
});

test('should call hook with deps from cacheUniq', () => {
  const cacheUniqs = [1, 2, 3];

  const useAsyncPaginateBase = jest.fn();

  setup({
    cacheUniqs,
    useAsyncPaginateBase,
  });

  expect(useAsyncPaginateBase.mock.calls[0][1]).toBe(cacheUniqs);
});

test('should call useComponents hook', () => {
  const useComponents = jest.fn<
  SelectComponentsConfig<any>,
  [SelectComponentsConfig<any>]
  >(() => ({}));

  const Test: FC = () => <div />;

  const components: SelectComponentsConfig<any> = {
    Menu: Test,
  };

  setup({
    components,
    useComponents,
  });

  expect(useComponents.mock.calls[0][0]).toBe(components);
});

test('should use result of useComponents hook', () => {
  const Test: FC = () => <div />;

  const components: SelectComponentsConfig<any> = {
    Menu: Test,
  };

  const useComponents = (): SelectComponentsConfig<any> => components;

  const page = setup({
    components,
    useComponents,
  });

  expect(page.getChildNode().prop('components')).toBe(components);
});
