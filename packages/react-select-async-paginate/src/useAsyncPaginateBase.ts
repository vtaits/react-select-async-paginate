import {
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';

import type {
  GroupBase,
} from 'react-select';

import useIsMountedRef from 'use-is-mounted-ref';

import { getInitialCache } from './getInitialCache';
import { getInitialOptionsCache } from './getInitialOptionsCache';
import { defaultShouldLoadMore } from './defaultShouldLoadMore';
import { defaultReduceOptions } from './defaultReduceOptions';
import { requestOptions } from './requestOptions';

import type {
  OptionsCache,
  OptionsCacheItem,
  UseAsyncPaginateBaseResult,
  UseAsyncPaginateBaseParams,
  RequestOptionsCallerType,
} from './types';

export const increaseStateId = (prevStateId: number): number => prevStateId + 1;

export const useAsyncPaginateBase = <
OptionType,
Group extends GroupBase<OptionType>,
Additional,
  >(
    params: UseAsyncPaginateBaseParams<OptionType, Group, Additional>,
    deps: ReadonlyArray<any> = [],
  ): UseAsyncPaginateBaseResult<OptionType, Group> => {
  const {
    defaultOptions,
    loadOptionsOnMenuOpen = true,
    debounceTimeout = 0,
    inputValue,
    menuIsOpen,
    filterOption = null,
    reduceOptions = defaultReduceOptions,
    shouldLoadMore = defaultShouldLoadMore,
  } = params;

  const isMountedRef = useIsMountedRef();

  const isInitRef = useRef<boolean>(true);
  const paramsRef = useRef<UseAsyncPaginateBaseParams<OptionType, Group, Additional>>(params);

  paramsRef.current = params;

  const setStateId = useState(0)[1];

  const optionsCacheRef = useRef<OptionsCache<OptionType, Group, Additional>>(null);

  if (optionsCacheRef.current === null) {
    optionsCacheRef.current = getInitialOptionsCache(params);
  }

  const callRequestOptions = useCallback((caller: RequestOptionsCallerType): void => {
    requestOptions(
      caller,
      paramsRef,
      optionsCacheRef,
      debounceTimeout,
      (reduceState) => {
        optionsCacheRef.current = reduceState(optionsCacheRef.current);

        if (isMountedRef.current) {
          setStateId(increaseStateId);
        }
      },
      reduceOptions,
    );
  }, [debounceTimeout]);

  const handleScrolledToBottom = useCallback((): void => {
    const currentInputValue = paramsRef.current.inputValue;
    const currentOptions = optionsCacheRef.current[currentInputValue];

    if (currentOptions) {
      callRequestOptions('menu-scroll');
    }
  }, [callRequestOptions]);

  useEffect(() => {
    if (isInitRef.current) {
      isInitRef.current = false;
    } else {
      optionsCacheRef.current = {};
      setStateId(increaseStateId);
    }

    if (defaultOptions === true) {
      callRequestOptions('autoload');
    }
  }, deps);

  useEffect(() => {
    if (menuIsOpen && !optionsCacheRef.current[inputValue]) {
      callRequestOptions('input-change');
    }
  }, [inputValue]);

  useEffect(() => {
    if (
      menuIsOpen
      && !optionsCacheRef.current['']
      && loadOptionsOnMenuOpen
    ) {
      callRequestOptions('menu-toggle');
    }
  }, [menuIsOpen]);

  const currentOptions: OptionsCacheItem<
  OptionType,
  Group,
  Additional
  > = optionsCacheRef.current[inputValue]
    || getInitialCache(params);

  return {
    handleScrolledToBottom,
    shouldLoadMore,
    filterOption,
    isLoading: currentOptions.isLoading,
    isFirstLoad: currentOptions.isFirstLoad,
    options: currentOptions.options,
  };
};
