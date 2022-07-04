import type {
  ReactElement,
} from 'react';

import { createRenderer } from 'react-test-renderer/shallow';

import { wrapMenuList, CHECK_TIMEOUT } from '../wrapMenuList';
import type {
  Props,
} from '../wrapMenuList';
import { defaultShouldLoadMore } from '../defaultShouldLoadMore';

jest.useFakeTimers();

function TestComponent(): ReactElement {
  return <div />;
}

const WrappedMenuList = wrapMenuList(TestComponent);

const defaultProps: Props = {
  innerRef: null,

  selectProps: {
    handleScrolledToBottom: (): void => {},
    shouldLoadMore: defaultShouldLoadMore,
  },

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  setTimeout: () => 0,
  clearTimeout: () => {},

  useRef: () => ({
    current: null,
  }),

  useCallback: (callback) => callback,

  useEffect: () => {},
};

type PageObject = {
  getChildProps: () => Record<string, any>;
};

const setup = (props: Partial<Props>): PageObject => {
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
  const useCallback = jest.fn();

  setup({
    useRef: jest.fn()
      .mockReturnValue({
        current: null,
      })
      .mockReturnValue({
        current: null,
      }),

    useCallback,
  });

  const shouldHandle = useCallback.mock.calls[0][0];

  expect(shouldHandle()).toBe(false);
});

test('should handle if ref el is not scrollable', () => {
  const useCallback = jest.fn();

  setup({
    useRef: jest.fn()
      .mockReturnValue({
        current: null,
      })
      .mockReturnValue({
        current: {
          scrollTop: 0,
          scrollHeight: 100,
          clientHeight: 100,
        },
      }),

    useCallback,
  });

  const shouldHandle = useCallback.mock.calls[0][0];

  expect(shouldHandle()).toBe(true);
});

test('should call shouldLoadMore with correct arguments', () => {
  const useCallback = jest.fn();
  const shouldLoadMore = jest.fn();

  setup({
    useRef: jest.fn()
      .mockReturnValue({
        current: null,
      })
      .mockReturnValue({
        current: {
          scrollTop: 95,
          scrollHeight: 200,
          clientHeight: 100,
        },
      }),

    selectProps: {
      ...defaultProps.selectProps,
      shouldLoadMore,
    },

    useCallback,
  });

  const shouldHandle = useCallback.mock.calls[0][0];

  shouldHandle();

  expect(shouldLoadMore).toHaveBeenCalledTimes(1);
  expect(shouldLoadMore).toHaveBeenCalledWith(
    200,
    100,
    95,
  );
});

test('should not handle if ref el is scrollable and shouldLoadMore returns false', () => {
  const useCallback = jest.fn();

  setup({
    useRef: jest.fn()
      .mockReturnValue({
        current: null,
      })
      .mockReturnValue({
        current: {
          scrollTop: 30,
          scrollHeight: 200,
          clientHeight: 100,
        },
      }),

    selectProps: {
      ...defaultProps.selectProps,
      shouldLoadMore: (): boolean => false,
    },

    useCallback,
  });

  const shouldHandle = useCallback.mock.calls[0][0];

  expect(shouldHandle()).toBe(false);
});

test('should handle if ref el is scrollable and shouldLoadMore returns true', () => {
  const useCallback = jest.fn();

  setup({
    useRef: jest.fn()
      .mockReturnValue({
        current: null,
      })
      .mockReturnValue({
        current: {
          scrollTop: 95,
          scrollHeight: 200,
          clientHeight: 100,
        },
      }),

    selectProps: {
      ...defaultProps.selectProps,
      shouldLoadMore: (): boolean => true,
    },

    useCallback,
  });

  const shouldHandle = useCallback.mock.calls[0][0];

  expect(shouldHandle()).toBe(true);
});

test('should not call handleScrolledToBottom if should not handle', () => {
  const useCallback = jest.fn()
    .mockReturnValueOnce(() => false)
    .mockReturnValue(jest.fn());
  const handleScrolledToBottom = jest.fn();

  setup({
    useRef: jest.fn()
      .mockReturnValue({
        current: null,
      })
      .mockReturnValue({
        current: null,
      }),

    selectProps: {
      ...defaultProps.selectProps,
      handleScrolledToBottom,
    },

    useCallback,
  });

  const checkAndHandle = useCallback.mock.calls[1][0];

  checkAndHandle();

  expect(handleScrolledToBottom).toHaveBeenCalledTimes(0);
});

test('should call handleScrolledToBottom if should handle', () => {
  const useCallback = jest.fn()
    .mockReturnValueOnce(() => true)
    .mockReturnValue(jest.fn());
  const handleScrolledToBottom = jest.fn();

  setup({
    useRef: jest.fn()
      .mockReturnValueOnce({
        current: null,
      })
      .mockReturnValueOnce({
        current: {
          scrollTop: 0,
          scrollHeight: 100,
          clientHeight: 100,
        },
      }),

    selectProps: {
      ...defaultProps.selectProps,
      handleScrolledToBottom,
    },

    useCallback,
  });

  const checkAndHandle = useCallback.mock.calls[1][0];

  checkAndHandle();

  expect(handleScrolledToBottom).toHaveBeenCalledTimes(1);
});

test('should call checkAndLoad and start timer on mount', () => {
  const setCheckAndHandleTimeout = jest.fn();
  const useCallback = jest.fn()
    .mockReturnValueOnce(jest.fn())
    .mockReturnValueOnce(jest.fn())
    .mockReturnValueOnce(setCheckAndHandleTimeout);
  const useEffect = jest.fn();

  setup({
    useCallback,
    useEffect,
  });

  useEffect.mock.calls[0][0]();

  expect(setCheckAndHandleTimeout).toHaveBeenCalledTimes(1);
});

test('should call checkAndLoad and start on call setCheckAndHandleTimeout', () => {
  const checkAndHandle = jest.fn();
  const setCheckAndHandleTimeout = jest.fn();
  const useCallback = jest.fn()
    .mockReturnValueOnce(jest.fn())
    .mockReturnValueOnce(checkAndHandle)
    .mockReturnValueOnce(setCheckAndHandleTimeout);
  const setTimeout = jest.fn()
    .mockReturnValue(123);

  const timeoutRef = {
    current: null,
  };

  setup({
    useCallback,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setTimeout,

    useRef: jest.fn()
      .mockReturnValueOnce(timeoutRef)
      .mockReturnValueOnce({
        current: null,
      }),
  });

  useCallback.mock.calls[2][0]();

  expect(checkAndHandle.mock.calls.length).toBe(1);
  expect(setTimeout).toHaveBeenCalledTimes(1);
  expect(setTimeout).toHaveBeenLastCalledWith(
    setCheckAndHandleTimeout,
    CHECK_TIMEOUT,
  );

  expect(timeoutRef.current).toBe(123);
});

test('should stop timer on unmount', () => {
  const useEffect = jest.fn();
  const clearTimeout = jest.fn();
  const useCallback = jest.fn()
    .mockReturnValue(jest.fn());

  setup({
    useRef: jest.fn()
      .mockReturnValueOnce({
        current: 123,
      })
      .mockReturnValueOnce({
        current: null,
      }),

    useEffect,
    useCallback,
    clearTimeout,
  });

  useEffect.mock.calls[0][0]()();

  expect(clearTimeout).toHaveBeenCalledTimes(1);
  expect(clearTimeout).toHaveBeenLastCalledWith(123);
});

test('should not call extra clearTimeout', () => {
  const useEffect = jest.fn();
  const clearTimeout = jest.fn();
  const useCallback = jest.fn()
    .mockReturnValue(jest.fn());

  setup({
    useRef: jest.fn()
      .mockReturnValueOnce({
        current: null,
      })
      .mockReturnValueOnce({
        current: null,
      }),

    useEffect,
    useCallback,
  });

  useEffect.mock.calls[0][0]()();

  expect(clearTimeout).toHaveBeenCalledTimes(0);
});
