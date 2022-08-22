import {
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

export type WrappedMenuListProps = {
  selectProps: {
    handleScrolledToBottom?: () => void;
    shouldLoadMore: ShouldLoadMore;
  };

  innerRef: Ref<HTMLElement>;

  [key: string]: any;
};

type ComponentProps = {
  innerRef: Ref<HTMLElement>;
};

// eslint-disable-next-line @typescript-eslint/naming-convention
export const wrapMenuList = (MenuList: ComponentType<ComponentProps>): FC<WrappedMenuListProps> => {
  function WrappedMenuList(props: WrappedMenuListProps) {
    const {
      selectProps: {
        handleScrolledToBottom,
        shouldLoadMore,
      },
      innerRef,
    } = props;

    const checkTimeoutRef = useRef(null);
    const menuListRef = useRef<HTMLElement>(null);

    const shouldHandle = useCallback(() => {
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

    const checkAndHandle = useCallback(() => {
      if (shouldHandle()) {
        if (handleScrolledToBottom) {
          handleScrolledToBottom();
        }
      }
    }, [shouldHandle, handleScrolledToBottom]);

    const setCheckAndHandleTimeout = useCallback(() => {
      checkAndHandle();

      checkTimeoutRef.current = setTimeout(setCheckAndHandleTimeout, CHECK_TIMEOUT);
    }, [checkAndHandle]);

    useEffect(() => {
      setCheckAndHandleTimeout();

      return (): void => {
        if (checkTimeoutRef.current) {
          clearTimeout(checkTimeoutRef.current);
        }
      };
    }, []);

    return (
      <MenuList
        {...props}
        innerRef={composeRefs<HTMLElement>(innerRef, menuListRef)}
      />
    );
  }

  return WrappedMenuList;
};
