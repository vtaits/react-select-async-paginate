import {
  useState,
  useCallback,
} from 'react';
import type {
  GroupBase,
  InputActionMeta,
} from 'react-select';

import {
  useAsyncPaginateBase,
} from './useAsyncPaginateBase';

import type {
  UseAsyncPaginateParams,
  UseAsyncPaginateBaseResult,
  UseAsyncPaginateResult,
} from './types';

export const useAsyncPaginate = <OptionType, Group extends GroupBase<OptionType>, Additional>(
  params: UseAsyncPaginateParams<OptionType, Group, Additional>,
  deps: ReadonlyArray<any> = [],
): UseAsyncPaginateResult<OptionType, Group> => {
  const {
    inputValue: inputValueParam,
    menuIsOpen: menuIsOpenParam,
    defaultInputValue: defaultInputValueParam,
    defaultMenuIsOpen: defaultMenuIsOpenParam,
    onInputChange: onInputChangeParam,
    onMenuClose: onMenuCloseParam,
    onMenuOpen: onMenuOpenParam,
  } = params;

  const [inputValueState, setInputValue] = useState(
    defaultInputValueParam || '',
  );
  const [menuIsOpenState, setMenuIsOpen] = useState(
    !!defaultMenuIsOpenParam,
  );

  const inputValue: string = typeof inputValueParam === 'string'
    ? inputValueParam
    : inputValueState;

  const menuIsOpen: boolean = typeof menuIsOpenParam === 'boolean'
    ? menuIsOpenParam
    : menuIsOpenState;

  const onInputChange = useCallback((
    nextInputValue: string,
    actionMeta: InputActionMeta,
  ): void => {
    if (onInputChangeParam) {
      onInputChangeParam(nextInputValue, actionMeta);
    }

    setInputValue(nextInputValue);
  }, [onInputChangeParam]);

  const onMenuClose = useCallback((): void => {
    if (onMenuCloseParam) {
      onMenuCloseParam();
    }

    setMenuIsOpen(false);
  }, [onMenuCloseParam]);

  const onMenuOpen = useCallback((): void => {
    if (onMenuOpenParam) {
      onMenuOpenParam();
    }

    setMenuIsOpen(true);
  }, [onMenuOpenParam]);

  const baseResult: UseAsyncPaginateBaseResult<OptionType, Group> = useAsyncPaginateBase(
    {
      ...params,
      inputValue,
      menuIsOpen,
    },
    deps,
  );

  return {
    ...baseResult,
    inputValue,
    menuIsOpen,
    onInputChange,
    onMenuClose,
    onMenuOpen,
  };
};
