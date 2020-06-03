import React, {
  useEffect,
  useRef,
  useCallback,
} from 'react';
import type {
  ComponentType,
  FC,
  Ref,
} from 'react';
import composeRefs from '@seznam/compose-react-refs';

import type {
  ShouldLoadMore,
} from './types';

export const CHECK_TIMEOUT = 300;

export type Props = {
  selectProps: {
    handleScrolledToBottom?: () => void;
    shouldLoadMore: ShouldLoadMore;
  };

  innerRef: Ref<HTMLElement>;

  useEffect?: typeof useEffect;
  useRef?: typeof useRef;
  useCallback?: typeof useCallback;
  setTimeout?: typeof setTimeout;
  clearTimeout?: typeof clearTimeout;

  [key: string]: any;
};

type ComponentProps = {
  innerRef: Ref<HTMLElement>;
};

// eslint-disable-next-line @typescript-eslint/naming-convention
export const wrapMenuList = (MenuList: ComponentType<ComponentProps>): FC<Props> => {
  const WrappedMenuList: FC<Props> = (props) => {
    const {
      selectProps: {
        handleScrolledToBottom,
        shouldLoadMore,
      },
      innerRef,

      useEffect: useEffectProp,
      useRef: useRefProp,
      useCallback: useCallbackProp,

      setTimeout: setTimeoutProp,
      clearTimeout: clearTimeoutProp,
    } = props;

    const checkTimeoutRef = useRefProp(null);
    const menuListRef = useRefProp<HTMLElement>(null);

    const shouldHandle = useCallbackProp(() => {
      const el = menuListRef.current;

      // menu not rendered
      if (!el) {
        return false;
      }

      const {
        scrollTop,
        scrollHeight,
        clientHeight,
      } = el;

      return shouldLoadMore(scrollHeight, clientHeight, scrollTop);
    }, [shouldLoadMore]);

    const checkAndHandle = useCallbackProp(() => {
      if (shouldHandle()) {
        if (handleScrolledToBottom) {
          handleScrolledToBottom();
        }
      }
    }, [shouldHandle, handleScrolledToBottom]);

    const setCheckAndHandleTimeout = useCallbackProp(() => {
      checkAndHandle();

      checkTimeoutRef.current = setTimeoutProp(setCheckAndHandleTimeout, CHECK_TIMEOUT);
    }, [checkAndHandle]);

    useEffectProp(() => {
      setCheckAndHandleTimeout();

      return (): void => {
        if (checkTimeoutRef.current) {
          clearTimeoutProp(checkTimeoutRef.current);
        }
      };
    }, []);

    return (
      <MenuList
        {...props}
        innerRef={composeRefs<HTMLElement>(innerRef, menuListRef)}
      />
    );
  };

  WrappedMenuList.defaultProps = {
    useEffect,
    useRef,
    useCallback,
    setTimeout,
    clearTimeout,
  };

  return WrappedMenuList;
};
