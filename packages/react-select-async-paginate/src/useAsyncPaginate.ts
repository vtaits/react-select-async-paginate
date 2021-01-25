import {
  useState,
  useCallback,
} from 'react';
import type {
  InputActionMeta,
} from 'react-select';

import {
  useAsyncPaginateBase,
} from './useAsyncPaginateBase';

import type {
  UseAsyncPaginateParams,
  UseAsyncPaginateBaseParams,
  UseAsyncPaginateBaseResult,
  UseAsyncPaginateResult,
} from './types';

export const useAsyncPaginatePure = <OptionType, Additional>(
  useStateParam: typeof useState,
  useCallbackParam: typeof useCallback,

  useAsyncPaginateBaseParam: (
    params: UseAsyncPaginateBaseParams<OptionType, Additional>,
    deps: ReadonlyArray<any>,
  ) => UseAsyncPaginateBaseResult<OptionType>,

  params: UseAsyncPaginateParams<OptionType, Additional>,
  deps: ReadonlyArray<any> = [],
): UseAsyncPaginateResult<OptionType> => {
  const {
    inputValue: inputValueParam,
    menuIsOpen: menuIsOpenParam,
    defaultInputValue: defaultInputValueParam,
    defaultMenuIsOpen: defaultMenuIsOpenParam,
    onInputChange: onInputChangeParam,
    onMenuClose: onMenuCloseParam,
    onMenuOpen: onMenuOpenParam,
  } = params;

  const [inputValueState, setInputValue] = useStateParam(
    defaultInputValueParam || '',
  );
  const [menuIsOpenState, setMenuIsOpen] = useStateParam(
    !!defaultMenuIsOpenParam
  );

  const inputValue: string = typeof inputValueParam === 'string'
    ? inputValueParam
    : inputValueState;

  const menuIsOpen: boolean = typeof menuIsOpenParam === 'boolean'
    ? menuIsOpenParam
    : menuIsOpenState;

  const onInputChange = useCallbackParam((
    nextInputValue: string,
    actionMeta: InputActionMeta,
  ): void => {
    if (onInputChangeParam) {
      onInputChangeParam(nextInputValue, actionMeta);
    }

    setInputValue(nextInputValue);
  }, [onInputChangeParam]);

  const onMenuClose = useCallbackParam((): void => {
    if (onMenuCloseParam) {
      onMenuCloseParam();
    }

    setMenuIsOpen(false);
  }, [onMenuCloseParam]);

  const onMenuOpen = useCallbackParam((): void => {
    if (onMenuOpenParam) {
      onMenuOpenParam();
    }

    setMenuIsOpen(true);
  }, [onMenuOpenParam]);

  const baseResult: UseAsyncPaginateBaseResult<OptionType> = useAsyncPaginateBaseParam(
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

export const useAsyncPaginate = <OptionType, Additional>(
  params: UseAsyncPaginateParams<OptionType, Additional>,
  deps: ReadonlyArray<any> = [],
): UseAsyncPaginateResult<OptionType> => useAsyncPaginatePure<OptionType, Additional>(
    useState,
    useCallback,
    useAsyncPaginateBase,
    params,
    deps,
  );
