/* eslint-disable max-classes-per-file */

import React from 'react';
import { shallow } from 'enzyme';

import wrapMenuList, { CHECK_TIMEOUT } from '../wrap-menu-list';

jest.useFakeTimers();

const TestComponent = () => <div />;

const WrappedMenuList = wrapMenuList(TestComponent);

const defaultProps = {
  innerRef: Function.prototype,

  selectProps: {
    handleScrolledToBottom: Function.prototype,
    shouldLoadMore: Function.prototype,
  },
};

class PageObject {
  constructor(props) {
    const checkAndHandleMock = jest.fn();

    class ManualMenuList extends WrappedMenuList {
      componentDidMount() { }

      manualDidMount() {
        super.componentDidMount();
      }

      /* eslint-disable class-methods-use-this */
      checkAndHandle() {
        checkAndHandleMock();
      }
      /* eslint-enable class-methods-use-this */

      manualCheckAndHandle() {
        super.checkAndHandle();
      }
    }

    this.checkAndHandleMock = checkAndHandleMock;

    this.wrapper = shallow(
      <ManualMenuList
        {...defaultProps}
        {...props}
      />,
    );
  }

  instance() {
    return this.wrapper.instance();
  }

  shouldHandle() {
    return this.instance().shouldHandle();
  }

  checkAndHandle() {
    return this.instance().manualCheckAndHandle();
  }

  getChildNode() {
    return this.wrapper.find(TestComponent);
  }

  setRef(ref) {
    const childNode = this.getChildNode();

    childNode.prop('innerRef')(ref);
  }
}

function setup(props) {
  return new PageObject(props);
}

beforeEach(() => {
  setTimeout.mockClear();
});

test('should provide props from parent', () => {
  const page = setup({
    prop1: 'value1',
    prop2: 'value2',
  });

  const childNode = page.getChildNode();

  expect(childNode.prop('prop1')).toBe('value1');
  expect(childNode.prop('prop2')).toBe('value2');
});

test('should set ref', () => {
  const innerRef = jest.fn();

  const page = setup({
    innerRef,
  });

  const testRef = Symbol('ref');

  page.setRef(testRef);

  expect(page.instance().menuListRef).toBe(testRef);
  expect(innerRef.mock.calls.length).toBe(1);
  expect(innerRef.mock.calls[0][0]).toBe(testRef);
});

test('should not handle if ref el is falsy', () => {
  const page = setup({});

  page.setRef(null);

  expect(page.shouldHandle()).toBe(false);
});

test('should handle if ref el is not scrollable', () => {
  const page = setup({});

  page.setRef({
    scrollTop: 0,
    scrollHeight: 100,
    clientHeight: 100,
  });

  expect(page.shouldHandle()).toBe(true);
});

test('should call shouldLoadMore with correct arguments', () => {
  const shouldLoadMore = jest.fn();

  const page = setup({
    selectProps: {
      ...defaultProps.selectProps,
      shouldLoadMore,
    },
  });

  page.setRef({
    scrollTop: 95,
    scrollHeight: 200,
    clientHeight: 100,
  });

  page.shouldHandle();

  expect(shouldLoadMore.mock.calls.length).toBe(1);
  expect(shouldLoadMore.mock.calls[0][0]).toBe(200);
  expect(shouldLoadMore.mock.calls[0][1]).toBe(100);
  expect(shouldLoadMore.mock.calls[0][2]).toBe(95);
});

test('should not handle if ref el is scrollable and shouldLoadMore returns false', () => {
  const page = setup({
    selectProps: {
      ...defaultProps.selectProps,
      shouldLoadMore: () => false,
    },
  });

  page.setRef({
    scrollTop: 30,
    scrollHeight: 200,
    clientHeight: 100,
  });

  expect(page.shouldHandle()).toBe(false);
});

test('should handle if ref el is scrollable and shouldLoadMore returns true', () => {
  const page = setup({
    selectProps: {
      ...defaultProps.selectProps,
      shouldLoadMore: () => true,
    },
  });

  page.setRef({
    scrollTop: 95,
    scrollHeight: 200,
    clientHeight: 100,
  });

  expect(page.shouldHandle()).toBe(true);
});

test('should not call handleScrolledToBottom if should not handle', () => {
  const handleScrolledToBottom = jest.fn();

  const page = setup({
    selectProps: {
      ...defaultProps.selectProps,
      handleScrolledToBottom,
    },
  });

  page.setRef(null);
  page.checkAndHandle();

  expect(handleScrolledToBottom.mock.calls.length).toBe(0);
});

test('should call handleScrolledToBottom if should handle', () => {
  const handleScrolledToBottom = jest.fn();

  const page = setup({
    selectProps: {
      ...defaultProps.selectProps,
      handleScrolledToBottom,
    },
  });

  page.setRef({
    scrollTop: 0,
    scrollHeight: 100,
    clientHeight: 100,
  });
  page.checkAndHandle();

  expect(handleScrolledToBottom.mock.calls.length).toBe(1);
});

test('should call checkAndLoad and start timer on mount', () => {
  const page = setup({});

  page.instance().manualDidMount();

  expect(page.checkAndHandleMock.mock.calls.length).toBe(1);
  expect(setTimeout).toHaveBeenCalledTimes(1);
  expect(setTimeout).toHaveBeenLastCalledWith(
    page.instance().setCheckAndHandleTimeount,
    CHECK_TIMEOUT,
  );
});

test('should call checkAndLoad and start on call setCheckAndHandleTimeount', () => {
  const page = setup({});

  page.instance().setCheckAndHandleTimeount();

  expect(page.checkAndHandleMock.mock.calls.length).toBe(1);
  expect(setTimeout).toHaveBeenCalledTimes(1);
  expect(setTimeout).toHaveBeenLastCalledWith(
    page.instance().setCheckAndHandleTimeount,
    CHECK_TIMEOUT,
  );
});

test('should stop timer on unmount', () => {
  const page = setup({});

  const timeount = setTimeout(() => {});

  page.instance().checkTimeout = timeount;

  page.instance().componentWillUnmount();

  expect(clearTimeout).toHaveBeenCalledTimes(1);
  expect(clearTimeout).toHaveBeenLastCalledWith(timeount);
});
