import type {
  ReactElement,
} from 'react';

import { createRenderer } from 'react-test-renderer/shallow';

import type {
  GroupBase,
  Options,
  Props as SelectProps,
} from 'react-select';

import { withAsyncPaginate } from '../withAsyncPaginate';
import type {
  Props,
} from '../withAsyncPaginate';

import type {
  useComponents as defaultUseComponents,
} from '../useComponents';

import type {
  LoadOptions,
  UseAsyncPaginateResult,
} from '../types';

type ExtendedSelectProps<
  OptionType,
  IsMulti extends boolean,
  Group extends GroupBase<OptionType>,
> =
  & SelectProps<OptionType, IsMulti, Group>
  & {
    isFirstLoad: boolean;
  };

type SelectComponentsConfig<
OptionType,
IsMulti extends boolean,
Group extends GroupBase<OptionType>,
> = Partial<SelectProps<OptionType, IsMulti, Group>['components']>;

function TestComponent(): ReactElement {
  return <div />;
}

const AsyncPagintate = withAsyncPaginate(TestComponent);

type PageObject<
  OptionType,
  IsMulti extends boolean,
  Group extends GroupBase<OptionType>,
> = {
  getSelectProps: () => ExtendedSelectProps<OptionType, IsMulti, Group>;
};

const defaultLoadOptions: LoadOptions<any, any, any> = () => ({
  options: [],
});

const defaultProps: Props<any, any, any, boolean> = {
  loadOptions: defaultLoadOptions,

  useComponents: (() => ({})) as typeof defaultUseComponents,

  useAsyncPaginate: (): UseAsyncPaginateResult<any, any> => ({
    handleScrolledToBottom: (): void => {},
    shouldLoadMore: (): boolean => true,
    isLoading: true,
    isFirstLoad: true,
    options: [],
    filterOption: null,
    inputValue: '',
    onInputChange: (): void => {},
    menuIsOpen: false,
    onMenuOpen: (): void => {},
    onMenuClose: (): void => {},
  }),
};

const setup = <
  OptionType,
  IsMulti extends boolean,
  Group extends GroupBase<OptionType>,
>(
    props: Partial<Props<OptionType, Group, any, IsMulti>>,
  ): PageObject<OptionType, IsMulti, Group> => {
  const renderer = createRenderer();

  renderer.render(
    <AsyncPagintate
      {...defaultProps as Props<OptionType, Group, any, IsMulti>}
      {...props}
    />,
  );

  const result = renderer.getRenderOutput();

  const getSelectProps = () => result.props as ExtendedSelectProps<OptionType, IsMulti, Group>;

  return {
    getSelectProps,
  };
};

test('should provide props from parent to child', () => {
  const getOptionLabel = jest.fn();

  const page = setup({
    getOptionLabel,
  });

  const childProps = page.getSelectProps();

  expect(childProps.getOptionLabel).toBe(getOptionLabel);
});

test('should provide props from hook to child', () => {
  const options: Options<any> = [
    {
      value: 1,
      label: '1',
    },
  ];

  const useAsyncPaginate = (): UseAsyncPaginateResult<any, any> => ({
    handleScrolledToBottom: (): void => {},
    shouldLoadMore: (): boolean => true,
    isLoading: true,
    isFirstLoad: true,
    filterOption: null,
    inputValue: '',
    onInputChange: (): void => {},
    menuIsOpen: false,
    onMenuOpen: (): void => {},
    onMenuClose: (): void => {},
    options,
  });

  const page = setup({
    useAsyncPaginate,
  });

  const childProps = page.getSelectProps();

  expect(childProps.isLoading).toBe(true);
  expect(childProps.isFirstLoad).toBe(true);
  expect(childProps.filterOption).toBe(null);
  expect(childProps.options).toBe(options);
  expect(childProps.inputValue).toBe('');
  expect(childProps.menuIsOpen).toBe(false);
});

test('should redefine isLoading prop', () => {
  const useAsyncPaginate = (): UseAsyncPaginateResult<any, any> => ({
    handleScrolledToBottom: (): void => {},
    shouldLoadMore: (): boolean => true,
    isLoading: false,
    isFirstLoad: true,
    filterOption: null,
    inputValue: '',
    onInputChange: (): void => {},
    menuIsOpen: false,
    onMenuOpen: (): void => {},
    onMenuClose: (): void => {},
    options: [],
  });

  const page = setup({
    isLoading: true,
    useAsyncPaginate,
  });

  const childProps = page.getSelectProps();

  expect(childProps.isLoading).toBe(true);
});

test('should redefine parent props with hook props', () => {
  const optionsProp: Options<any> = [
    {
      value: 1,
      label: '1',
    },
  ];

  const optionsHookResult: Options<any> = [
    {
      value: 1,
      label: '1',
    },
  ];

  const useAsyncPaginate = (): UseAsyncPaginateResult<any, any> => ({
    handleScrolledToBottom: (): void => {},
    shouldLoadMore: (): boolean => true,
    isLoading: true,
    isFirstLoad: true,
    filterOption: null,
    inputValue: '',
    onInputChange: (): void => {},
    menuIsOpen: false,
    onMenuOpen: (): void => {},
    onMenuClose: (): void => {},
    options: optionsHookResult,
  });

  const page = setup({
    options: optionsProp,
    useAsyncPaginate,
  });

  const childProps = page.getSelectProps();

  expect(childProps.options).toBe(optionsHookResult);
});

test('should call hook with correct params', () => {
  const options = [
    {
      value: 1,
      label: '1',
    },
  ];

  const useAsyncPaginate = jest.fn()
    .mockReturnValue({});

  function Test() {
    return <div />;
  }

  setup({
    components: {
      Menu: Test,
    },

    selectRef: () => {},
    cacheUniqs: [1, 2, 3],
    options,
    useAsyncPaginate,
  });

  expect(useAsyncPaginate.mock.calls.length).toBe(1);

  const params = useAsyncPaginate.mock.calls[0][0];

  expect(params.options).toBe(options);
  // eslint-disable-next-line no-prototype-builtins
  expect(params.hasOwnProperty('cacheUniqs')).toBe(false);
  // eslint-disable-next-line no-prototype-builtins
  expect(params.hasOwnProperty('selectRef')).toBe(false);
  // eslint-disable-next-line no-prototype-builtins
  expect(params.hasOwnProperty('useAsyncPaginate')).toBe(false);
});

test('should call hook with empty deps', () => {
  const useAsyncPaginate = jest.fn()
    .mockReturnValue({});

  setup({
    useAsyncPaginate,
  });

  expect(useAsyncPaginate.mock.calls[0][1].length).toBe(0);
});

test('should call hook with deps from cacheUniq', () => {
  const cacheUniqs = [1, 2, 3];

  const useAsyncPaginate = jest.fn()
    .mockReturnValue({});

  setup({
    cacheUniqs,
    useAsyncPaginate,
  });

  expect(useAsyncPaginate.mock.calls[0][1]).toBe(cacheUniqs);
});

test('should call useComponents hook', () => {
  const useComponents = jest.fn()
    .mockReturnValue({});

  function Test() {
    return <div />;
  }

  const components: SelectComponentsConfig<any, false, any> = {
    Menu: Test,
  };

  setup({
    components,
    useComponents,
  });

  expect(useComponents.mock.calls[0][0]).toBe(components);
});

test('should use result of useComponents hook', () => {
  function Test() {
    return <div />;
  }

  const components: SelectComponentsConfig<any, false, any> = {
    Menu: Test,
  };

  const useComponents = (() => components) as typeof defaultUseComponents;

  const page = setup({
    components,
    useComponents,
  });

  expect(page.getSelectProps().components).toBe(components);
});
