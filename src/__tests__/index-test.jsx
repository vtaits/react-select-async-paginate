import React from 'react';
import { shallow, mount } from 'enzyme';
import Select from 'react-select';

import AsyncPaginate from '../index';

const defaultProps = {
  loadOptions: () => ({
    options: [],
    hasMore: false,
  }),
};

test('should render Select', () => {
  const wrapper = shallow(
    <AsyncPaginate
      {...defaultProps}
    />,
  );

  const selectNode = wrapper.find(Select);

  expect(selectNode.length).toBe(1);
  expect(selectNode.prop('isLoading')).toBe(false);
  expect(selectNode.prop('options')).toEqual([]);
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

  const selectNode = wrapper.find(Select);

  expect(selectNode.length).toBe(1);
  expect(selectNode.prop('isLoading')).toBe(false);
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
      },
    },
  });

  const selectNode = wrapper.find(Select);

  expect(selectNode.length).toBe(1);
  expect(selectNode.prop('isLoading')).toBe(true);
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

  await wrapper.find(Select).prop('onOpen')();

  const {
    search,
    optionsCache,
  } = wrapper.state();

  const currentOptionsCache = optionsCache[search];

  expect(currentOptionsCache.isLoading).toBe(false);
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
      },
    },
  });

  await wrapper.find(Select).prop('onOpen')();

  expect(loadOptions.mock.calls.length).toBe(0);
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

  await wrapper.find(Select).prop('onInputChange')('test');

  const {
    search,
    optionsCache,
  } = wrapper.state();

  expect(search).toBe('test');

  const currentOptionsCache = optionsCache[search];

  expect(currentOptionsCache.isLoading).toBe(false);
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
      },
    },
  });

  await wrapper.find(Select).prop('onInputChange')('test');

  expect(wrapper.state('search')).toBe('test');
  expect(loadOptions.mock.calls.length).toBe(0);
});

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
      },
    },
  });

  await wrapper.find(Select).prop('onMenuScrollToBottom')();

  const {
    search,
    optionsCache,
  } = wrapper.state();

  expect(search).toBe('test');

  const currentOptionsCache = optionsCache[search];

  expect(currentOptionsCache.isLoading).toBe(false);
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
      },
    },
  });

  await wrapper.find(Select).prop('onMenuScrollToBottom')();

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
      },
    },
  });

  await wrapper.find(Select).prop('onMenuScrollToBottom')();

  expect(loadOptions.mock.calls.length).toBe(0);
});

test('should clean search on close select', () => {
  const wrapper = shallow(
    <AsyncPaginate
      {...defaultProps}
    />,
  );

  wrapper.setState({
    search: 'test',
  });

  wrapper.find(Select).prop('onClose')();

  expect(wrapper.state('search')).toBe('');
});
