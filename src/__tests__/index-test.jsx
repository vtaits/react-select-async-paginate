import React from 'react';
import { shallow, mount } from 'enzyme';
import { SelectBase } from 'react-select';

import AsyncPaginate, { MenuList } from '../index';

const defaultProps = {
  loadOptions: () => ({
    options: [],
    hasMore: false,
  }),
};

test('should render SelectBase', () => {
  const wrapper = shallow(
    <AsyncPaginate
      {...defaultProps}
    />,
  );

  const selectNode = wrapper.find(SelectBase);

  expect(selectNode.length).toBe(1);
  expect(selectNode.prop('isLoading')).toBe(false);
  expect(selectNode.prop('isFirstLoad')).toBe(true);
  expect(selectNode.prop('options')).toEqual([]);
  expect(selectNode.prop('menuIsOpen')).toBe(false);
});

test('should set empty options cache on init', () => {
  const wrapper = shallow(
    <AsyncPaginate
      {...defaultProps}
    />,
  );

  const optionsCache = wrapper.state('optionsCache');

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

  const wrapper = shallow(
    <AsyncPaginate
      {...defaultProps}
      options={options}
    />,
  );

  const optionsCache = wrapper.state('optionsCache');

  expect(optionsCache).toEqual({
    '': {
      isFirstLoad: false,
      isLoading: false,
      hasMore: true,
      options,
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

  expect(mockRef.mock.calls.length).toEqual(1);
  expect(mockRef.mock.calls[0]).toBeTruthy();
});

test('should set default state and options if search for cache is empty', () => {
  const wrapper = shallow(
    <AsyncPaginate
      {...defaultProps}
    />,
  );

  wrapper.setState({
    search: 'test',
    optionsCache: {},
  });

  const selectNode = wrapper.find(SelectBase);

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

  const wrapper = shallow(
    <AsyncPaginate
      {...defaultProps}
    />,
  );

  wrapper.setState({
    search: 'test',

    optionsCache: {
      test: {
        options,
        isLoading: true,
        isFirstLoad: false,
      },
    },
  });

  const selectNode = wrapper.find(SelectBase);

  expect(selectNode.length).toBe(1);
  expect(selectNode.prop('isLoading')).toBe(true);
  expect(selectNode.prop('isFirstLoad')).toBe(false);
  expect(selectNode.prop('options')).toEqual(options);
});

test('should load options on open select if options not cached', async () => {
  const options = [{
    value: 1,
    label: '1',
  }, {
    value: 2,
    label: '2',
  }];

  let wrapper;

  const loadOptions = async (query, prevOptions) => {
    expect(query).toBe('');
    expect(prevOptions).toEqual([]);

    expect(wrapper.state('optionsCache')[''].isLoading).toBe(true);
    expect(wrapper.state('optionsCache')[''].isFirstLoad).toBe(true);
    expect(wrapper.state('optionsCache')[''].hasMore).toBe(true);
    expect(wrapper.state('optionsCache')[''].options).toEqual([]);

    return {
      options,
      hasMore: false,
    };
  };

  wrapper = shallow(
    <AsyncPaginate
      {...defaultProps}
      loadOptions={loadOptions}
    />,
  );

  await wrapper.find(SelectBase).prop('onMenuOpen')();

  const {
    search,
    menuIsOpen,
    optionsCache,
  } = wrapper.state();

  expect(menuIsOpen).toBe(true);

  const currentOptionsCache = optionsCache[search];

  expect(currentOptionsCache.isLoading).toBe(false);
  expect(currentOptionsCache.isFirstLoad).toBe(false);
  expect(currentOptionsCache.hasMore).toBe(false);
  expect(currentOptionsCache.options).toEqual(options);
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

  const wrapper = shallow(
    <AsyncPaginate
      {...defaultProps}
      loadOptions={loadOptions}
    />,
  );

  wrapper.setState({
    optionsCache: {
      '': {
        options,
        hasMore: true,
        isLoading: false,
        isFirstLoad: false,
      },
    },
  });

  await wrapper.find(SelectBase).prop('onMenuOpen')();

  expect(loadOptions.mock.calls.length).toBe(0);
});

test('should set correct inputValue prop in SelectBase', async () => {
  const wrapper = shallow(
    <AsyncPaginate
      {...defaultProps}
    />,
  );

  wrapper.setState({
    search: 'test value',
  });

  expect(wrapper.find(SelectBase).prop('inputValue')).toBe('test value');
});

test('should set correct menuIsOpen prop in SelectBase', async () => {
  const wrapper = shallow(
    <AsyncPaginate
      {...defaultProps}
    />,
  );

  wrapper.setState({
    menuIsOpen: true,
  });

  expect(wrapper.find(SelectBase).prop('menuIsOpen')).toBe(true);
});

test('should load options on search change if options not cached', async () => {
  const options = [{
    value: 1,
    label: '1',
  }, {
    value: 2,
    label: '2',
  }];

  let wrapper;

  const loadOptions = async (query, prevOptions) => {
    expect(query).toBe('test');
    expect(prevOptions).toEqual([]);

    expect(wrapper.state('optionsCache').test.isLoading).toBe(true);
    expect(wrapper.state('optionsCache').test.isFirstLoad).toBe(true);
    expect(wrapper.state('optionsCache').test.hasMore).toBe(true);
    expect(wrapper.state('optionsCache').test.options).toEqual([]);

    return {
      options,
      hasMore: false,
    };
  };

  wrapper = shallow(
    <AsyncPaginate
      {...defaultProps}
      loadOptions={loadOptions}
    />,
  );

  await wrapper.find(SelectBase).prop('onInputChange')('test');

  const {
    search,
    optionsCache,
  } = wrapper.state();

  expect(search).toBe('test');

  const currentOptionsCache = optionsCache[search];

  expect(currentOptionsCache.isLoading).toBe(false);
  expect(currentOptionsCache.isFirstLoad).toBe(false);
  expect(currentOptionsCache.hasMore).toBe(false);
  expect(currentOptionsCache.options).toEqual(options);
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

  const wrapper = shallow(
    <AsyncPaginate
      {...defaultProps}
      loadOptions={loadOptions}
    />,
  );

  wrapper.setState({
    optionsCache: {
      test: {
        options,
        hasMore: true,
        isLoading: false,
        isFirstLoad: false,
      },
    },
  });

  await wrapper.find(SelectBase).prop('onInputChange')('test');

  expect(wrapper.state('search')).toBe('test');
  expect(loadOptions.mock.calls.length).toBe(0);
});

['onMenuScrollToBottom', 'handleScrolledToBottom'].forEach((propName) => {
  describe(propName, () => {
    test('should load more options on scroll menu to bottom', async () => {
      let wrapper;

      const loadOptions = async (query, prevOptions) => {
        expect(query).toBe('test');
        expect(prevOptions).toEqual([{
          value: 1,
          label: '1',
        }, {
          value: 2,
          label: '2',
        }]);

        expect(wrapper.state('optionsCache').test.isLoading).toBe(true);
        expect(wrapper.state('optionsCache').test.isFirstLoad).toBe(false);
        expect(wrapper.state('optionsCache').test.hasMore).toBe(true);

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
      };

      wrapper = shallow(
        <AsyncPaginate
          {...defaultProps}
          loadOptions={loadOptions}
        />,
      );

      wrapper.setState({
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
            isLoading: false,
            isFirstLoad: false,
          },
        },
      });

      await wrapper.find(SelectBase).prop(propName)();

      const {
        search,
        optionsCache,
      } = wrapper.state();

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
    });

    test('should not load more options on scroll menu to bottom in loading state', async () => {
      const loadOptions = jest.fn();

      const wrapper = shallow(
        <AsyncPaginate
          {...defaultProps}
          loadOptions={loadOptions}
        />,
      );

      wrapper.setState({
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

      await wrapper.find(SelectBase).prop(propName)();

      expect(loadOptions.mock.calls.length).toBe(0);
    });

    test('should not load more options on scroll menu to bottom if not has more', async () => {
      const loadOptions = jest.fn();

      const wrapper = shallow(
        <AsyncPaginate
          {...defaultProps}
          loadOptions={loadOptions}
        />,
      );

      wrapper.setState({
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

      await wrapper.find(SelectBase).prop(propName)();

      expect(loadOptions.mock.calls.length).toBe(0);
    });
  });
});

test('should clean search and menuIsOpen on close select', () => {
  const wrapper = shallow(
    <AsyncPaginate
      {...defaultProps}
    />,
  );

  wrapper.setState({
    search: 'test',
    menuIsOpen: true,
  });

  wrapper.find(SelectBase).prop('onMenuClose')();

  expect(wrapper.state('search')).toBe('');
  expect(wrapper.state('menuIsOpen')).toBe(false);
});

test('should provide components', () => {
  const component1 = () => <div />;
  const component2 = () => <div />;

  const wrapper = shallow(
    <AsyncPaginate
      {...defaultProps}
      components={{
        component1,
        component2,
      }}
    />,
  );

  const selectNode = wrapper.find(SelectBase);
  const components = selectNode.prop('components');

  expect(components.component1).toBe(component1);
  expect(components.component2).toBe(component2);
  expect(components.MenuList).toBe(MenuList);
});

test('should redefine MenuList component', () => {
  const RedefinedMenuList = () => <div />;

  const wrapper = shallow(
    <AsyncPaginate
      {...defaultProps}
      components={{
        MenuList: RedefinedMenuList,
      }}
    />,
  );

  const selectNode = wrapper.find(SelectBase);
  const components = selectNode.prop('components');

  expect(components.MenuList).toBe(RedefinedMenuList);
});
