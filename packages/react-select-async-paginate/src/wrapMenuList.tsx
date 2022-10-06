import {
  useEffect,
  useRef,
  useCallback,
} from 'react';
import type {
  ReactElement,
} from 'react';

import type {
  GroupBase,
  MenuListProps,
} from 'react-select';

import composeRefs from '@seznam/compose-react-refs';

import type {
  ShouldLoadMore,
} from './types';

export const CHECK_TIMEOUT = 300;

export type BaseSelectProps = {
  handleScrolledToBottom?: () => void;
  shouldLoadMore: ShouldLoadMore;
};

type MenuListType <
Option = unknown,
IsMulti extends boolean = boolean,
Group extends GroupBase<Option> = GroupBase<Option>,
> = (props: MenuListProps<Option, IsMulti, Group>) => ReactElement;

export function wrapMenuList<
Option = unknown,
IsMulti extends boolean = boolean,
Group extends GroupBase<Option> = GroupBase<Option>,
>(
  // eslint-disable-next-line @typescript-eslint/naming-convention
  MenuList: MenuListType<Option, IsMulti, Group>,
) {
  function WrappedMenuList(props: MenuListProps<Option, IsMulti, Group>) {
    const {
      selectProps,
      innerRef,
    } = props;

    const {
      handleScrolledToBottom,
      shouldLoadMore,
    } = selectProps as unknown as BaseSelectProps;

    const checkTimeoutRef = useRef<NodeJS.Timeout>();
    const menuListRef = useRef<HTMLElement>(null);

    const shouldHandle = useCallback(() => {
      const el = menuListRef.current;

      // menu is not rendered
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
}
