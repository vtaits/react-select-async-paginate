import {
  useState,
  useCallback,
} from 'react';

import {
  useAsyncPaginateBase,
} from './useAsyncPaginateBase';

import type {
  UseAsyncPaginateParams,
  UseAsyncPaginateBaseResult,
  UseAsyncPaginateResult,
} from './types';

export const useAsyncPaginatePure = <OptionType, Additional>(
  useStateParam: typeof useState,
  useCallbackParam: typeof useCallback,
  useAsyncPaginateBaseParam: typeof useAsyncPaginateBase,
  params: UseAsyncPaginateParams<OptionType>,
  deps: ReadonlyArray<any> = [],
): UseAsyncPaginateResult<OptionType> => {
  const [inputValue, setInputValue] = useStateParam('');
  const [menuIsOpen, setMenuIsOpen] = useStateParam(false);

  const onInputChange = useCallbackParam((nextInputValue: string): void => {
    setInputValue(nextInputValue);
  }, []);

  const onMenuClose = useCallbackParam((): void => {
    setMenuIsOpen(false);
  }, []);

  const onMenuOpen = useCallbackParam((): void => {
    setMenuIsOpen(true);
  }, []);

  const baseResult: UseAsyncPaginateBaseResult<OptionType> = useAsyncPaginateBaseParam<
  OptionType,
  Additional
  >(
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

export const useAsyncPaginate = <OptionType = any, Additional = any>(
  params: UseAsyncPaginateParams<OptionType, Additional>,
  deps: ReadonlyArray<any> = [],
): UseAsyncPaginateResult<OptionType> => useAsyncPaginatePure<OptionType, Additional>(
    useState,
    useCallback,
    useAsyncPaginateBase,
    params,
    deps,
  );
