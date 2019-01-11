import React from 'react';
import { shallow, mount } from 'enzyme';
import { SelectBase } from 'react-select';

import AsyncPaginate, { MenuList } from '../async-paginate';

const defaultProps = {
  loadOptions: () => ({
    options: [],
    hasMore: false,
  }),
};

class PageObject {
  constructor(props) {
    this.wrapper = shallow(
      <AsyncPaginate
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
}

const setup = (props) => new PageObject(props);

test('should render SelectBase', () => {
  const page = setup({});

  const selectNode = page.getSelectNode();

  expect(selectNode.length).toBe(1);
  expect(selectNode.prop('isLoading')).toBe(false);
  expect(selectNode.prop('isFirstLoad')).toBe(true);
  expect(selectNode.prop('options')).toEqual([]);
  expect(selectNode.prop('menuIsOpen')).toBe(false);
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
  const options = [{
    value: 1,
    label: '1',
  }, {
    value: 2,
    label: '2',
  }];

  const additional = Symbol('additional');

  let page;

  const loadOptions = jest.fn(async (query, prevOptions) => {
    expect(query).toBe('');
    expect(prevOptions).toEqual([]);

    const currentOptionsCache = page.state('optionsCache')[''];

    expect(currentOptionsCache.isLoading).toBe(true);
    expect(currentOptionsCache.isFirstLoad).toBe(true);
    expect(currentOptionsCache.hasMore).toBe(true);
    expect(currentOptionsCache.options).toEqual([]);
    expect(currentOptionsCache.additional).toBe(additional);

    return {
      options,
      hasMore: false,
    };
  });

  page = setup({
    loadOptions,
    additional,
  });

  await page.getSelectNode().prop('onMenuOpen')();

  const {
    search,
    menuIsOpen,
    optionsCache,
  } = page.state();

  expect(menuIsOpen).toBe(true);

  const currentOptionsCache = optionsCache[search];

  expect(currentOptionsCache.isLoading).toBe(false);
  expect(currentOptionsCache.isFirstLoad).toBe(false);
  expect(currentOptionsCache.hasMore).toBe(false);
  expect(currentOptionsCache.options).toEqual(options);
  expect(currentOptionsCache.additional).toBe(null);

  expect(loadOptions.mock.calls.length).toBe(1);
  expect(loadOptions.mock.calls[0][0]).toBe('');
  expect(loadOptions.mock.calls[0][1]).toEqual([]);
  expect(loadOptions.mock.calls[0][2]).toBe(additional);
});

test('should not call loadOptions on open select if options cached', async () => {
  const options = [{
    value: 1,
    label: '1',
  }, {
    value: 2,
    label: '2',
  }];

  const loadOptions = jest.fn();

  const page = setup({
    loadOptions,
  });

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

  expect(loadOptions.mock.calls.length).toBe(0);
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
  const options = [{
    value: 1,
    label: '1',
  }, {
    value: 2,
    label: '2',
  }];

  const additional = Symbol('additional');

  let page;

  const loadOptions = jest.fn(async (query, prevOptions) => {
    expect(query).toBe('test');
    expect(prevOptions).toEqual([]);

    const currentOptionsCache = page.state('optionsCache').test;

    expect(currentOptionsCache.isLoading).toBe(true);
    expect(currentOptionsCache.isFirstLoad).toBe(true);
    expect(currentOptionsCache.hasMore).toBe(true);
    expect(currentOptionsCache.options).toEqual([]);
    expect(currentOptionsCache.additional).toBe(additional);

    return {
      options,
      hasMore: false,
    };
  });

  page = setup({
    loadOptions,
    additional,
  });

  await page.getSelectNode().prop('onInputChange')('test');

  const {
    search,
    optionsCache,
  } = page.state();

  expect(search).toBe('test');

  const currentOptionsCache = optionsCache[search];

  expect(currentOptionsCache.isLoading).toBe(false);
  expect(currentOptionsCache.isFirstLoad).toBe(false);
  expect(currentOptionsCache.hasMore).toBe(false);
  expect(currentOptionsCache.options).toEqual(options);
  expect(currentOptionsCache.additional).toBe(null);

  expect(loadOptions.mock.calls.length).toBe(1);
  expect(loadOptions.mock.calls[0][0]).toBe('test');
  expect(loadOptions.mock.calls[0][1]).toEqual([]);
  expect(loadOptions.mock.calls[0][2]).toBe(additional);
});

test('should not call loadOptions on search change if options cached', async () => {
  const options = [{
    value: 1,
    label: '1',
  }, {
    value: 2,
    label: '2',
  }];

  const loadOptions = jest.fn();

  const page = setup({
    loadOptions,
  });

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
  expect(loadOptions.mock.calls.length).toBe(0);
});

['onMenuScrollToBottom', 'handleScrolledToBottom'].forEach((propName) => {
  describe(propName, () => {
    test('should load more options on scroll menu to bottom', async () => {
      const options = [{
        value: 1,
        label: '1',
      }, {
        value: 2,
        label: '2',
      }];

      let page;

      const additional = Symbol('additional');

      const loadOptions = jest.fn(async (query, prevOptions) => {
        expect(query).toBe('test');
        expect(prevOptions).toEqual([{
          value: 1,
          label: '1',
        }, {
          value: 2,
          label: '2',
        }]);

        const testOptionsCache = page.state('optionsCache').test;

        expect(testOptionsCache.isLoading).toBe(true);
        expect(testOptionsCache.isFirstLoad).toBe(false);
        expect(testOptionsCache.hasMore).toBe(true);
        expect(testOptionsCache.additional).toBe(additional);

        return {
          options: [{
            value: 3,
            label: '3',
          }, {
            value: 4,
            label: '4',
          }],
          hasMore: false,
        };
      });

      page = setup({
        loadOptions,
        additional,
      });

      page.setState({
        search: 'test',

        optionsCache: {
          test: {
            options,
            hasMore: true,
            isLoading: false,
            isFirstLoad: false,
            additional,
          },
        },
      });

      await page.getSelectNode().prop(propName)();

      const {
        search,
        optionsCache,
      } = page.state();

      expect(search).toBe('test');

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
      expect(currentOptionsCache.additional).toBe(null);

      expect(loadOptions.mock.calls.length).toBe(1);
      expect(loadOptions.mock.calls[0][0]).toBe('test');
      expect(loadOptions.mock.calls[0][1]).toBe(options);
      expect(loadOptions.mock.calls[0][2]).toBe(additional);
    });

    test('should not load more options on scroll menu to bottom in loading state', async () => {
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

      await page.getSelectNode().prop(propName)();

      expect(loadOptions.mock.calls.length).toBe(0);
    });

    test('should not load more options on scroll menu to bottom if not has more', async () => {
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

      await page.getSelectNode().prop(propName)();

      expect(loadOptions.mock.calls.length).toBe(0);
    });
  });
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
