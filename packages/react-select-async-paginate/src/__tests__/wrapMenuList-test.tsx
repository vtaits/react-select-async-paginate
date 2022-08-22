import {
  useEffect,
  useRef,
  useCallback,
} from 'react';
import type {
  ReactElement,
} from 'react';

import { createRenderer } from 'react-test-renderer/shallow';

import { wrapMenuList, CHECK_TIMEOUT } from '../wrapMenuList';
import type {
  WrappedMenuListProps,
} from '../wrapMenuList';
import { defaultShouldLoadMore } from '../defaultShouldLoadMore';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useEffect: jest.fn(),
  useRef: jest.fn(),
  useCallback: jest.fn(),
}));

jest.useFakeTimers();

jest.spyOn(global, 'setTimeout');
jest.spyOn(global, 'clearTimeout');

beforeEach(() => {
  (useEffect as jest.Mock).mockReturnValue(undefined);
  (useCallback as jest.Mock<Function, [Function]>).mockImplementation((callback) => callback);
  (useRef as jest.Mock).mockReturnValue({
    current: null,
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

function TestComponent(): ReactElement {
  return <div />;
}

const WrappedMenuList = wrapMenuList(TestComponent);

const defaultProps: WrappedMenuListProps = {
  innerRef: null,

  selectProps: {
    handleScrolledToBottom: (): void => {},
    shouldLoadMore: defaultShouldLoadMore,
  },
};

type PageObject = {
  getChildProps: () => Record<string, any>;
};

const setup = (props: Partial<WrappedMenuListProps>): PageObject => {
  const renderer = createRenderer();

  renderer.render(
    <WrappedMenuList
      {...defaultProps}
      {...props}
    />,
  );

  const result = renderer.getRenderOutput();

  return {
    getChildProps: () => result.props,
  };
};

test('should provide props from parent', () => {
  const page = setup({
    prop1: 'value1',
    prop2: 'value2',
  });

  const childProps = page.getChildProps();

  expect(childProps.prop1).toBe('value1');
  expect(childProps.prop2).toBe('value2');
});

test('should not handle if ref el is falsy', () => {
  setup({
    useRef: jest.fn()
      .mockReturnValue({
        current: null,
      })
      .mockReturnValue({
        current: null,
      }),
  });

  const shouldHandle = (useCallback as jest.Mock).mock.calls[0][0];

  expect(shouldHandle()).toBe(false);
});

test('should handle if ref el is not scrollable', () => {
  (useRef as jest.Mock)
    .mockReturnValue({
      current: null,
    })
    .mockReturnValue({
      current: {
        scrollTop: 0,
        scrollHeight: 100,
        clientHeight: 100,
      },
    });

  setup({});

  const shouldHandle = (useCallback as jest.Mock).mock.calls[0][0];

  expect(shouldHandle()).toBe(true);
});

test('should call shouldLoadMore with correct arguments', () => {
  const shouldLoadMore = jest.fn();

  (useRef as jest.Mock)
    .mockReturnValue({
      current: null,
    })
    .mockReturnValue({
      current: {
        scrollTop: 95,
        scrollHeight: 200,
        clientHeight: 100,
      },
    });

  setup({
    selectProps: {
      ...defaultProps.selectProps,
      shouldLoadMore,
    },
  });

  const shouldHandle = (useCallback as jest.Mock).mock.calls[0][0];

  shouldHandle();

  expect(shouldLoadMore).toHaveBeenCalledTimes(1);
  expect(shouldLoadMore).toHaveBeenCalledWith(
    200,
    100,
    95,
  );
});

test('should not handle if ref el is scrollable and shouldLoadMore returns false', () => {
  (useRef as jest.Mock)
    .mockReturnValue({
      current: null,
    })
    .mockReturnValue({
      current: {
        scrollTop: 30,
        scrollHeight: 200,
        clientHeight: 100,
      },
    });

  setup({
    selectProps: {
      ...defaultProps.selectProps,
      shouldLoadMore: (): boolean => false,
    },
  });

  const shouldHandle = (useCallback as jest.Mock).mock.calls[0][0];

  expect(shouldHandle()).toBe(false);
});

test('should handle if ref el is scrollable and shouldLoadMore returns true', () => {
  (useRef as jest.Mock)
    .mockReturnValue({
      current: null,
    })
    .mockReturnValue({
      current: {
        scrollTop: 95,
        scrollHeight: 200,
        clientHeight: 100,
      },
    });

  setup({
    selectProps: {
      ...defaultProps.selectProps,
      shouldLoadMore: (): boolean => true,
    },
  });

  const shouldHandle = (useCallback as jest.Mock).mock.calls[0][0];

  expect(shouldHandle()).toBe(true);
});

test('should not call handleScrolledToBottom if should not handle', () => {
  (useCallback as jest.Mock)
    .mockReturnValueOnce(() => false)
    .mockReturnValue(jest.fn());

  (useRef as jest.Mock)
    .mockReturnValue({
      current: null,
    })
    .mockReturnValue({
      current: null,
    });

  const handleScrolledToBottom = jest.fn();

  setup({
    selectProps: {
      ...defaultProps.selectProps,
      handleScrolledToBottom,
    },
  });

  const checkAndHandle = (useCallback as jest.Mock).mock.calls[1][0];

  checkAndHandle();

  expect(handleScrolledToBottom).toHaveBeenCalledTimes(0);
});

test('should call handleScrolledToBottom if should handle', () => {
  (useCallback as jest.Mock)
    .mockReturnValueOnce(() => true)
    .mockReturnValue(jest.fn());

  (useRef as jest.Mock)
    .mockReturnValueOnce({
      current: null,
    })
    .mockReturnValueOnce({
      current: {
        scrollTop: 0,
        scrollHeight: 100,
        clientHeight: 100,
      },
    });

  const handleScrolledToBottom = jest.fn();

  setup({
    selectProps: {
      ...defaultProps.selectProps,
      handleScrolledToBottom,
    },
  });

  const checkAndHandle = (useCallback as jest.Mock).mock.calls[1][0];

  checkAndHandle();

  expect(handleScrolledToBottom).toHaveBeenCalledTimes(1);
});

test('should call checkAndLoad and start timer on mount', () => {
  const setCheckAndHandleTimeout = jest.fn();

  (useCallback as jest.Mock)
    .mockReturnValueOnce(jest.fn())
    .mockReturnValueOnce(jest.fn())
    .mockReturnValueOnce(setCheckAndHandleTimeout);

  setup({});

  (useEffect as jest.Mock).mock.calls[0][0]();

  expect(setCheckAndHandleTimeout).toHaveBeenCalledTimes(1);
});

test('should call checkAndLoad and start on call setCheckAndHandleTimeout', () => {
  const checkAndHandle = jest.fn();
  const setCheckAndHandleTimeout = jest.fn();

  (useCallback as jest.Mock)
    .mockReturnValueOnce(jest.fn())
    .mockReturnValueOnce(checkAndHandle)
    .mockReturnValueOnce(setCheckAndHandleTimeout);

  (setTimeout as unknown as jest.Mock)
    .mockReturnValue(123);

  const timeoutRef = {
    current: null,
  };

  (useRef as jest.Mock)
    .mockReturnValueOnce(timeoutRef)
    .mockReturnValueOnce({
      current: null,
    });

  setup({});

  (useCallback as jest.Mock).mock.calls[2][0]();

  expect(checkAndHandle.mock.calls.length).toBe(1);
  expect(setTimeout).toHaveBeenCalledTimes(1);
  expect(setTimeout).toHaveBeenLastCalledWith(
    setCheckAndHandleTimeout,
    CHECK_TIMEOUT,
  );

  expect(timeoutRef.current).toBe(123);
});

test('should stop timer on unmount', () => {
  (useCallback as jest.Mock)
    .mockReturnValue(jest.fn());

  (useRef as jest.Mock)
    .mockReturnValueOnce({
      current: 123,
    })
    .mockReturnValueOnce({
      current: null,
    });

  setup({});

  (useEffect as jest.Mock).mock.calls[0][0]()();

  expect(clearTimeout).toHaveBeenCalledTimes(1);
  expect(clearTimeout).toHaveBeenLastCalledWith(123);
});

test('should not call extra clearTimeout', () => {
  (useCallback as jest.Mock)
    .mockReturnValue(jest.fn());

  (useRef as jest.Mock)
    .mockReturnValueOnce({
      current: null,
    })
    .mockReturnValueOnce({
      current: null,
    });

  setup({});

  (useEffect as jest.Mock).mock.calls[0][0]()();

  expect(clearTimeout).toHaveBeenCalledTimes(0);
});
