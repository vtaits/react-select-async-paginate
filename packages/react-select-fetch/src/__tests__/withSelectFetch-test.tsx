import { shallow } from 'enzyme';
import type {
  ShallowWrapper,
} from 'enzyme';
import type {
  GroupBase,
  Options,
  Props as SelectProps,
} from 'react-select';
import type {
  UseAsyncPaginateResult,
  useComponents as defaultUseComponents,
} from 'react-select-async-paginate';

import { withSelectFetch } from '../withSelectFetch';
import type {
  Props,
} from '../withSelectFetch';

type SelectComponentsConfig<
OptionType,
IsMulti extends boolean,
Group extends GroupBase<OptionType>,
> = Partial<SelectProps<OptionType, IsMulti, Group>['components']>;

function TestComponent() {
  return <div />;
}

const SelectFetch = withSelectFetch(TestComponent);

type PageObject = {
  getChildNode: () => ShallowWrapper;
};

const defaultProps = {
  url: '',

  useComponents: (() => ({})) as typeof defaultUseComponents,

  useSelectFetch: (): UseAsyncPaginateResult<any, any> => ({
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

const setup = <OptionType, IsMulti extends boolean>(
  props: Partial<Props<OptionType, GroupBase<OptionType>, IsMulti>>,
): PageObject => {
  const wrapper: ShallowWrapper = shallow(
    <SelectFetch
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
  const options: Options<any> = [
    {
      value: 1,
      label: '1',
    },
  ];

  const useSelectFetch = (): UseAsyncPaginateResult<any, any> => ({
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
    useSelectFetch,
  });

  const childNode = page.getChildNode();

  expect(childNode.prop('isLoading')).toBe(true);
  expect(childNode.prop('isFirstLoad')).toBe(true);
  expect(childNode.prop('filterOption')).toBe(null);
  expect(childNode.prop('options')).toBe(options);
  expect(childNode.prop('inputValue')).toBe('');
  expect(childNode.prop('menuIsOpen')).toBe(false);
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

  const useSelectFetch = (): UseAsyncPaginateResult<any, any> => ({
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
    useSelectFetch,
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

  const useSelectFetch = jest.fn();

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
    useSelectFetch,
  });

  expect(useSelectFetch.mock.calls.length).toBe(1);

  const params = useSelectFetch.mock.calls[0][0];

  expect(params.options).toBe(options);
  // eslint-disable-next-line no-prototype-builtins
  expect(params.hasOwnProperty('cacheUniqs')).toBe(false);
  // eslint-disable-next-line no-prototype-builtins
  expect(params.hasOwnProperty('selectRef')).toBe(false);
  // eslint-disable-next-line no-prototype-builtins
  expect(params.hasOwnProperty('useSelectFetch')).toBe(false);
});

test('should call hook with empty deps', () => {
  const useSelectFetch = jest.fn();

  setup({
    useSelectFetch,
  });

  expect(useSelectFetch.mock.calls[0][1].length).toBe(0);
});

test('should call hook with deps from cacheUniq', () => {
  const cacheUniqs = [1, 2, 3];

  const useSelectFetch = jest.fn();

  setup({
    cacheUniqs,
    useSelectFetch,
  });

  expect(useSelectFetch.mock.calls[0][1]).toBe(cacheUniqs);
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

  expect(page.getChildNode().prop('components')).toBe(components);
});
