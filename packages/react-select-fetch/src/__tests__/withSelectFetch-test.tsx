import type {
  ReactElement,
} from 'react';

import { createRenderer } from 'react-test-renderer/shallow';

import type {
  GroupBase,
  Options,
  Props as SelectProps,
} from 'react-select';

import {
  useComponents,
} from 'react-select-async-paginate';
import type {
  UseAsyncPaginateResult,
} from 'react-select-async-paginate';

import { useSelectFetch } from '../useSelectFetch';

import { withSelectFetch } from '../withSelectFetch';
import type {
  SelectFetchProps,
  UseSelectFetchParams,
} from '../types';

jest.mock('react-select-async-paginate');
jest.mock('../useSelectFetch');

type UseSelectFetchMock = jest.Mock<
UseAsyncPaginateResult<unknown, GroupBase<unknown>>, [
  UseSelectFetchParams<unknown, GroupBase<unknown>>,
  readonly unknown[],
]>;

beforeEach(() => {
  (useComponents as jest.Mock).mockReturnValue({});

  (useSelectFetch as UseSelectFetchMock).mockReturnValue({
    handleScrolledToBottom: () => undefined,
    shouldLoadMore: (): boolean => true,
    isLoading: true,
    isFirstLoad: true,
    options: [],
    filterOption: null,
    inputValue: '',
    onInputChange: () => undefined,
    menuIsOpen: false,
    onMenuOpen: () => undefined,
    onMenuClose: () => undefined,
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

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

const SelectFetch = withSelectFetch(TestComponent);

type PageObject<
  OptionType,
  IsMulti extends boolean,
  Group extends GroupBase<OptionType>,
> = {
  getChildProps: () => ExtendedSelectProps<OptionType, IsMulti, Group>;
};

const defaultProps = {
  url: '',
};

const setup = <
  OptionType,
  IsMulti extends boolean,
  Group extends GroupBase<OptionType>,
>(
    props: Partial<SelectFetchProps<OptionType, GroupBase<OptionType>, IsMulti>>,
  ): PageObject<OptionType, IsMulti, Group> => {
  const renderer = createRenderer();

  renderer.render(
    <SelectFetch
      {...defaultProps}
      {...props}
    />,
  );

  const result = renderer.getRenderOutput();

  const getChildProps = () => result.props as ExtendedSelectProps<OptionType, IsMulti, Group>;

  return {
    getChildProps,
  };
};

test('should provide props from parent to child', () => {
  const getOptionLabel = jest.fn();

  const page = setup({
    getOptionLabel,
  });

  const childProps = page.getChildProps();

  expect(childProps.getOptionLabel).toBe(getOptionLabel);
});

test('should provide props from hook to child', () => {
  const options: Options<any> = [
    {
      value: 1,
      label: '1',
    },
  ];

  (useSelectFetch as UseSelectFetchMock).mockReturnValue({
    handleScrolledToBottom: () => undefined,
    shouldLoadMore: () => true,
    isLoading: true,
    isFirstLoad: true,
    filterOption: null,
    inputValue: '',
    onInputChange: () => undefined,
    menuIsOpen: false,
    onMenuOpen: () => undefined,
    onMenuClose: () => undefined,
    options,
  });

  const page = setup({});

  const childProps = page.getChildProps();

  expect(childProps.isLoading).toBe(true);
  expect(childProps.isFirstLoad).toBe(true);
  expect(childProps.filterOption).toBe(null);
  expect(childProps.options).toBe(options);
  expect(childProps.inputValue).toBe('');
  expect(childProps.menuIsOpen).toBe(false);
});

test('should redefine parent props with hook props', () => {
  const optionsProp: Options<unknown> = [
    {
      value: 1,
      label: '1',
    },
  ];

  const optionsHookResult: Options<unknown> = [
    {
      value: 1,
      label: '1',
    },
  ];

  (useSelectFetch as UseSelectFetchMock).mockReturnValue({
    handleScrolledToBottom: () => undefined,
    shouldLoadMore: () => true,
    isLoading: true,
    isFirstLoad: true,
    filterOption: null,
    inputValue: '',
    onInputChange: () => undefined,
    menuIsOpen: false,
    onMenuOpen: () => undefined,
    onMenuClose: () => undefined,
    options: optionsHookResult,
  });

  const page = setup({
    options: optionsProp,
  });

  const childProps = page.getChildProps();

  expect(childProps.options).toBe(optionsHookResult);
});

test('should call hook with correct params', () => {
  const options = [
    {
      value: 1,
      label: '1',
    },
  ];

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
  });

  expect(useSelectFetch).toHaveBeenCalledTimes(1);

  const params = (useSelectFetch as UseSelectFetchMock).mock.calls[0][0];

  expect(params.options).toBe(options);
  // eslint-disable-next-line no-prototype-builtins
  expect(params.hasOwnProperty('cacheUniqs')).toBe(false);
  // eslint-disable-next-line no-prototype-builtins
  expect(params.hasOwnProperty('selectRef')).toBe(false);
  // eslint-disable-next-line no-prototype-builtins
  expect(params.hasOwnProperty('useSelectFetch')).toBe(false);
});

test('should call hook with empty deps', () => {
  setup({});

  expect((useSelectFetch as UseSelectFetchMock).mock.calls[0][1].length).toBe(0);
});

test('should call hook with deps from cacheUniq', () => {
  const cacheUniqs = [1, 2, 3];

  setup({
    cacheUniqs,
  });

  expect((useSelectFetch as UseSelectFetchMock).mock.calls[0][1]).toBe(cacheUniqs);
});

test('should call useComponents hook', () => {
  function Test() {
    return <div />;
  }

  const components: SelectComponentsConfig<unknown, false, GroupBase<unknown>> = {
    Menu: Test,
  };

  setup({
    components,
  });

  expect(useComponents).toHaveBeenCalledTimes(1);
  expect(useComponents).toHaveBeenCalledWith(components);
});

test('should use result of useComponents hook', () => {
  function Test() {
    return <div />;
  }

  const components: SelectComponentsConfig<unknown, false, GroupBase<unknown>> = {
    Menu: Test,
  };

  (useComponents as jest.Mock).mockReturnValue(components);

  const page = setup({
    components,
  });

  expect(page.getChildProps().components).toBe(components);
});
