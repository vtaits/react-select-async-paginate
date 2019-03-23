import React, { Component } from 'react';
import { shallow, mount } from 'enzyme';
import { SelectBase } from 'react-select';

import AsyncPaginate, { MenuList } from '../async-paginate';
import defaultShouldLoadMore from '../default-should-load-more';

const defaultProps = {
  loadOptions: () => ({
    options: [],
    hasMore: false,
  }),
};

const loadOptionsMethod = jest.fn();

class ManualAsyncPaginate extends AsyncPaginate {
  // eslint-disable-next-line class-methods-use-this
  loadOptions() {
    loadOptionsMethod();
  }

  manualLoadOptions() {
    return super.loadOptions();
  }
}

class PageObject {
  constructor(props) {
    this.wrapper = shallow(
      <ManualAsyncPaginate
        {...defaultProps}
        {...props}
      />,
    );
  }

  state(...args) {
    return this.wrapper.state(...args);
  }

  setState(...args) {
    return this.wrapper.setState(...args);
  }

  getSelectNode() {
    return this.wrapper.find(SelectBase);
  }

  loadOptions() {
    return this.wrapper.instance().manualLoadOptions();
  }
}

const setup = (props) => new PageObject(props);

afterEach(() => {
  loadOptionsMethod.mockClear();
  jest.clearAllTimers();
});

test('should render SelectBase with default props', () => {
  const page = setup({});

  const selectNode = page.getSelectNode();

  expect(selectNode.length).toBe(1);
  expect(selectNode.prop('isLoading')).toBe(false);
  expect(selectNode.prop('isFirstLoad')).toBe(true);
  expect(selectNode.prop('options')).toEqual([]);
  expect(selectNode.prop('menuIsOpen')).toBe(false);
  expect(selectNode.prop('shouldLoadMore')).toBe(defaultShouldLoadMore);
});

test('should redefine shouldLoadMore', () => {
  const shouldLoadMore = jest.fn();

  const page = setup({
    shouldLoadMore,
  });

  const selectNode = page.getSelectNode();

  expect(selectNode.prop('shouldLoadMore')).toBe(shouldLoadMore);
});

test('should set empty options cache on init', () => {
  const page = setup({});

  const optionsCache = page.state('optionsCache');

  expect(optionsCache).toEqual({});
});

test('should set options cache with initial options on init', () => {
  const options = [
    {
      label: 'label 1',
      value: 'value 1',
    },
    {
      label: 'label 2',
      value: 'value 2',
    },
  ];

  const page = setup({
    options,
  });

  const optionsCache = page.state('optionsCache');

  expect(optionsCache).toEqual({
    '': {
      isFirstLoad: false,
      isLoading: false,
      hasMore: true,
      options,
      additional: null,
    },
  });
});

test('should redefine additional in initial options cache', () => {
  const options = [
    {
      label: 'label 1',
      value: 'value 1',
    },
    {
      label: 'label 2',
      value: 'value 2',
    },
  ];

  const additional = Symbol('additional');

  const page = setup({
    options,
    additional,
  });

  const optionsCache = page.state('optionsCache');

  expect(optionsCache).toEqual({
    '': {
      isFirstLoad: false,
      isLoading: false,
      hasMore: true,
      options,
      additional,
    },
  });
});

test('should call selectRef', () => {
  const mockRef = jest.fn();

  mount(
    <AsyncPaginate
      {...defaultProps}
      selectRef={mockRef}
    />,
  );

  expect(mockRef.mock.calls.length).toBe(1);
  expect(mockRef.mock.calls[0]).toBeTruthy();
});

test('should set default state and options if search for cache is empty', () => {
  const page = setup({});

  page.setState({
    search: 'test',
    optionsCache: {},
  });

  const selectNode = page.getSelectNode();

  expect(selectNode.length).toBe(1);
  expect(selectNode.prop('isLoading')).toBe(false);
  expect(selectNode.prop('isFirstLoad')).toBe(true);
  expect(selectNode.prop('options')).toEqual([]);
});

test('should set loading state and options from cache', () => {
  const options = [{
    value: 1,
    label: '1',
  }, {
    value: 2,
    label: '2',
  }];

  const page = setup({});

  const additional = Symbol('additional');

  page.setState({
    search: 'test',

    optionsCache: {
      test: {
        options,
        isLoading: true,
        isFirstLoad: false,
        additional,
      },
    },
  });

  const selectNode = page.getSelectNode();

  expect(selectNode.length).toBe(1);
  expect(selectNode.prop('isLoading')).toBe(true);
  expect(selectNode.prop('isFirstLoad')).toBe(false);
  expect(selectNode.prop('options')).toBe(options);
});

test('should load options on open select if options not cached', async () => {
  const page = setup({});

  await page.getSelectNode().prop('onMenuOpen')();

  const {
    menuIsOpen,
  } = page.state();

  expect(menuIsOpen).toBe(true);
  expect(loadOptionsMethod.mock.calls.length).toBe(1);
});

test('should call onMenuOpen on open menu', async () => {
  const onMenuOpen = jest.fn();

  const page = setup({
    onMenuOpen,
  });

  await page.getSelectNode().prop('onMenuOpen')();

  expect(onMenuOpen.mock.calls.length).toBe(1);
});

test('should not call loadOptions on open select if options cached', async () => {
  const options = [{
    value: 1,
    label: '1',
  }, {
    value: 2,
    label: '2',
  }];

  const page = setup({});

  page.setState({
    optionsCache: {
      '': {
        options,
        hasMore: true,
        isLoading: false,
        isFirstLoad: false,
      },
    },
  });

  await page.getSelectNode().prop('onMenuOpen')();

  const {
    menuIsOpen,
  } = page.state();

  expect(menuIsOpen).toBe(true);
  expect(loadOptionsMethod.mock.calls.length).toBe(0);
});

test('should set correct inputValue prop in SelectBase', async () => {
  const page = setup({});

  page.setState({
    search: 'test value',
  });

  expect(page.getSelectNode().prop('inputValue')).toBe('test value');
});

test('should set correct menuIsOpen prop in SelectBase', async () => {
  const page = setup({});

  page.setState({
    menuIsOpen: true,
  });

  expect(page.getSelectNode().prop('menuIsOpen')).toBe(true);
});

test('should load options on search change if options not cached', async () => {
  const additional = Symbol('additional');

  const page = setup({
    additional,
  });

  await page.getSelectNode().prop('onInputChange')('test');

  const {
    search,
  } = page.state();

  expect(search).toBe('test');
  expect(loadOptionsMethod.mock.calls.length).toBe(1);
});

test('should not call loadOptions on search change if options cached', async () => {
  const options = [{
    value: 1,
    label: '1',
  }, {
    value: 2,
    label: '2',
  }];

  const page = setup({});

  page.setState({
    optionsCache: {
      test: {
        options,
        hasMore: true,
        isLoading: false,
        isFirstLoad: false,
      },
    },
  });

  await page.getSelectNode().prop('onInputChange')('test');

  expect(page.state('search')).toBe('test');
  expect(loadOptionsMethod.mock.calls.length).toBe(0);
});

['onMenuScrollToBottom', 'handleScrolledToBottom'].forEach((propName) => {
  describe(propName, () => {
    test('should load more options on scroll menu to bottom', async () => {
      const page = setup({});

      page.setState({
        search: 'test',

        optionsCache: {
          test: {
            options: [],
            hasMore: true,
            isLoading: false,
            isFirstLoad: false,
            additional: null,
          },
        },
      });

      await page.getSelectNode().prop(propName)();

      expect(loadOptionsMethod.mock.calls.length).toBe(1);
    });
  });
});

test('should call menuIsOpen on close menu', async () => {
  const onMenuClose = jest.fn();

  const page = setup({
    onMenuClose,
  });

  await page.getSelectNode().prop('onMenuClose')();

  expect(onMenuClose.mock.calls.length).toBe(1);
});

test('should clean search and menuIsOpen on close select', () => {
  const page = setup({});

  page.setState({
    search: 'test',
    menuIsOpen: true,
  });

  page.getSelectNode().prop('onMenuClose')();

  expect(page.state('search')).toBe('');
  expect(page.state('menuIsOpen')).toBe(false);
});

test('should provide components', () => {
  const component1 = () => <div />;
  const component2 = () => <div />;

  const page = setup({
    components: {
      component1,
      component2,
    },
  });

  const selectNode = page.getSelectNode();
  const components = selectNode.prop('components');

  expect(components.component1).toBe(component1);
  expect(components.component2).toBe(component2);
  expect(components.MenuList).toBe(MenuList);
});

test('should redefine MenuList component', () => {
  const RedefinedMenuList = () => <div />;

  const page = setup({
    components: {
      MenuList: RedefinedMenuList,
    },
  });

  const selectNode = page.getSelectNode();
  const components = selectNode.prop('components');

  expect(components.MenuList).toBe(RedefinedMenuList);
});

describe('loadOptions', () => {
  test('should load options if options not cached', async () => {
    const options = [{
      value: 1,
      label: '1',
    }, {
      value: 2,
      label: '2',
    }];

    const additionalPrev = Symbol('additionalPrev');
    const additionalNext = Symbol('additionalNext');

    let page;

    const loadOptions = jest.fn(async () => {
      const currentOptionsCache = page.state('optionsCache').test;

      expect(currentOptionsCache.isLoading).toBe(true);
      expect(currentOptionsCache.isFirstLoad).toBe(true);
      expect(currentOptionsCache.hasMore).toBe(true);
      expect(currentOptionsCache.options).toEqual([]);
      expect(currentOptionsCache.additional).toBe(additionalPrev);

      return {
        options,
        hasMore: false,
        additional: additionalNext,
      };
    });

    page = setup({
      loadOptions,
      additional: additionalPrev,
    });

    page.setState({
      search: 'test',
    });

    await page.loadOptions();

    const {
      search,
      optionsCache,
    } = page.state();

    const currentOptionsCache = optionsCache[search];

    expect(currentOptionsCache.isLoading).toBe(false);
    expect(currentOptionsCache.isFirstLoad).toBe(false);
    expect(currentOptionsCache.hasMore).toBe(false);
    expect(currentOptionsCache.options).toEqual(options);
    expect(currentOptionsCache.additional).toBe(additionalNext);

    expect(loadOptions.mock.calls.length).toBe(1);
    expect(loadOptions.mock.calls[0][0]).toBe('test');
    expect(loadOptions.mock.calls[0][1]).toEqual([]);
    expect(loadOptions.mock.calls[0][2]).toBe(additionalPrev);
  });

  test('should load more options', async () => {
    const options = [{
      value: 1,
      label: '1',
    }, {
      value: 2,
      label: '2',
    }];

    const additionalPrev = Symbol('additionalPrev');
    const additionalNext = Symbol('additionalNext');

    let page;

    const loadOptions = jest.fn(async () => {
      const testOptionsCache = page.state('optionsCache').test;

      expect(testOptionsCache.isLoading).toBe(true);
      expect(testOptionsCache.isFirstLoad).toBe(false);
      expect(testOptionsCache.hasMore).toBe(true);
      expect(testOptionsCache.options).toEqual(options);
      expect(testOptionsCache.additional).toBe(additionalPrev);

      return {
        options: [{
          value: 3,
          label: '3',
        }, {
          value: 4,
          label: '4',
        }],
        hasMore: false,
        additional: additionalNext,
      };
    });

    page = setup({
      loadOptions,
    });

    page.setState({
      search: 'test',

      optionsCache: {
        test: {
          options,
          hasMore: true,
          isLoading: false,
          isFirstLoad: false,
          additional: additionalPrev,
        },
      },
    });

    await page.loadOptions();

    const {
      search,
      optionsCache,
    } = page.state();

    const currentOptionsCache = optionsCache[search];

    expect(currentOptionsCache.isLoading).toBe(false);
    expect(currentOptionsCache.isFirstLoad).toBe(false);
    expect(currentOptionsCache.hasMore).toBe(false);
    expect(currentOptionsCache.options).toEqual([{
      value: 1,
      label: '1',
    }, {
      value: 2,
      label: '2',
    }, {
      value: 3,
      label: '3',
    }, {
      value: 4,
      label: '4',
    }]);
    expect(currentOptionsCache.additional).toBe(additionalNext);

    expect(loadOptions.mock.calls.length).toBe(1);
    expect(loadOptions.mock.calls[0][0]).toBe('test');
    expect(loadOptions.mock.calls[0][1]).toEqual(options);
    expect(loadOptions.mock.calls[0][2]).toBe(additionalPrev);
  });

  test('should not load more options in loading state', async () => {
    const loadOptions = jest.fn();

    const page = setup({
      loadOptions,
    });

    page.setState({
      search: 'test',

      optionsCache: {
        test: {
          options: [{
            value: 1,
            label: '1',
          }, {
            value: 2,
            label: '2',
          }],
          hasMore: true,
          isLoading: true,
          isFirstLoad: false,
        },
      },
    });

    await page.loadOptions();

    expect(loadOptions.mock.calls.length).toBe(0);
  });

  test('should not load more options if hasn\'t more', async () => {
    const loadOptions = jest.fn();

    const page = setup({
      loadOptions,
    });

    page.setState({
      search: 'test',

      optionsCache: {
        test: {
          options: [{
            value: 1,
            label: '1',
          }, {
            value: 2,
            label: '2',
          }],
          hasMore: false,
          isLoading: false,
          isFirstLoad: false,
        },
      },
    });

    await page.loadOptions();

    expect(loadOptions.mock.calls.length).toBe(0);
  });

  test('should work with debounceTimeout', async () => {
    const loadOptions = jest.fn();

    const page = setup({
      loadOptions,
      debounceTimeout: 300,
    });

    await page.loadOptions();

    expect(loadOptions.mock.calls.length).toBe(1);
  });

  test('should cancel loading if search changed in debounce mode', async () => {
    const loadOptions = jest.fn();

    const page = setup({
      loadOptions,
      debounceTimeout: 300,
    });

    setTimeout(() => {
      page.setState({
        search: 'test',
      });
    }, 150);

    await page.loadOptions();

    expect(loadOptions.mock.calls.length).toBe(0);
  });

  test('should reduce options by custom algorithm', async () => {
    const resultOptions = [
      {
        value: 10,
        label: '10',
      }, {
        value: 20,
        label: '20',
      },
    ];

    const reduceOptions = jest.fn(() => resultOptions);

    const options = [{
      value: 1,
      label: '1',
    }, {
      value: 2,
      label: '2',
    }];

    const newOptions = [{
      value: 3,
      label: '3',
    }, {
      value: 4,
      label: '4',
    }];

    const additionalPrev = Symbol('additionalPrev');
    const additionalNext = Symbol('additionalNext');

    const loadOptions = jest.fn(async () => ({
      options: newOptions,
      hasMore: false,
      additional: additionalNext,
    }));

    const page = setup({
      loadOptions,
      reduceOptions,
    });

    page.setState({
      search: 'test',

      optionsCache: {
        test: {
          options,
          hasMore: true,
          isLoading: false,
          isFirstLoad: false,
          additional: additionalPrev,
        },
      },
    });

    await page.loadOptions();

    const {
      search,
      optionsCache,
    } = page.state();

    const currentOptionsCache = optionsCache[search];

    expect(currentOptionsCache.options).toBe(resultOptions);

    expect(reduceOptions.mock.calls.length).toBe(1);
    expect(reduceOptions.mock.calls[0][0]).toBe(options);
    expect(reduceOptions.mock.calls[0][1]).toBe(newOptions);
    expect(reduceOptions.mock.calls[0][2]).toBe(additionalNext);
  });
});

test('should allow to puss custom Select component', () => {
  // eslint-disable-next-line react/prefer-stateless-function
  class MyCustomSelectWrapper extends Component {
    render() {
      return <SelectBase {...this.props} />;
    }
  }

  const wrapper = mount(
    <AsyncPaginate
      SelectComponent={MyCustomSelectWrapper}
      loadOptions={() => {
      }}
    />,
  );

  expect(wrapper.find(MyCustomSelectWrapper))
    .toBeTruthy();
});
