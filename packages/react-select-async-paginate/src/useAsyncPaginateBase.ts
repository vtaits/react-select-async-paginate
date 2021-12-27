import {
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import type {
  GroupBase,
} from 'react-select';
import sleep from 'sleep-promise';
import useIsMounted from 'react-is-mounted-hook';

import { defaultShouldLoadMore } from './defaultShouldLoadMore';
import { defaultReduceOptions } from './defaultReduceOptions';

import type {
  OptionsCache,
  OptionsCacheItem,
  UseAsyncPaginateBaseResult,
  UseAsyncPaginateBaseParams,
  ReduceOptions,
} from './types';

const errorText = '[react-select-async-paginate] response of "loadOptions" should be an object with "options" prop, which contains array of options.';

export const validateResponse = (
  console: Console,
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  response: any,
): void => {
  if (!response) {
    console.error(errorText, 'Received:', response);
    throw new Error(errorText);
  }

  if (!Array.isArray(response.options)) {
    console.error(errorText, 'Received:', response);
    throw new Error(errorText);
  }
};

export const getInitialOptionsCache = <
OptionType,
Group extends GroupBase<OptionType>,
Additional>(
    {
      options,
      defaultOptions,
      additional,
      defaultAdditional,
    }: UseAsyncPaginateBaseParams<OptionType, Group, Additional>,
  ): OptionsCache<OptionType, Group, Additional> => {
  const initialOptions = defaultOptions === true
    ? null
    : (defaultOptions instanceof Array)
      ? defaultOptions
      : options;

  if (initialOptions) {
    return {
      '': {
        isFirstLoad: false,
        isLoading: false,
        options: initialOptions,
        hasMore: true,
        additional: defaultAdditional || additional,
      },
    };
  }

  return {};
};

export const getInitialCache = <OptionType, Group extends GroupBase<OptionType>, Additional>(
  params: UseAsyncPaginateBaseParams<OptionType, Group, Additional>,
): OptionsCacheItem<OptionType, Group, Additional> => ({
    isFirstLoad: true,
    options: [],
    hasMore: true,
    isLoading: false,
    additional: params.additional,
  });

type MapOptionsCache<OptionType, Group extends GroupBase<OptionType>, Additional> = (
  prevCache: OptionsCache<OptionType, Group, Additional>,
) => OptionsCache<OptionType, Group, Additional>;

type SetOptionsCache<OptionType, Group extends GroupBase<OptionType>, Additional> = (
  stateMapper: MapOptionsCache<OptionType, Group, Additional>,
) => void;

export const requestOptions = async <OptionType, Group extends GroupBase<OptionType>, Additional>(
  paramsRef: {
    current: UseAsyncPaginateBaseParams<OptionType, Group, Additional>;
  },
  optionsCacheRef: {
    current: OptionsCache<OptionType, Group, Additional>;
  },
  debounceTimeout: number,
  sleepParam: typeof sleep,
  setOptionsCache: SetOptionsCache<OptionType, Group, Additional>,
  validateResponseParam: typeof validateResponse,
  reduceOptions: ReduceOptions<OptionType, Group, Additional>,
): Promise<void> => {
  const currentInputValue = paramsRef.current.inputValue;

  const isCacheEmpty = !optionsCacheRef.current[currentInputValue];

  const currentOptions: OptionsCacheItem<OptionType, Group, Additional> = isCacheEmpty
    ? getInitialCache(paramsRef.current)
    : optionsCacheRef.current[currentInputValue];

  if (currentOptions.isLoading || !currentOptions.hasMore) {
    return;
  }

  setOptionsCache((
    prevOptionsCache: OptionsCache<OptionType, Group, Additional>,
  ): OptionsCache<OptionType, Group, Additional> => ({
    ...prevOptionsCache,
    [currentInputValue]: {
      ...currentOptions,
      isLoading: true,
    },
  }));

  if (debounceTimeout > 0) {
    await sleepParam(debounceTimeout);

    const newInputValue = paramsRef.current.inputValue;

    if (currentInputValue !== newInputValue) {
      setOptionsCache((prevOptionsCache) => {
        if (isCacheEmpty) {
          const {
            [currentInputValue]: itemForDelete,
            ...restCache
          } = prevOptionsCache;

          return restCache;
        }

        return {
          ...prevOptionsCache,
          [currentInputValue]: {
            ...currentOptions,
            isLoading: false,
          },
        };
      });

      return;
    }
  }

  let response;
  let hasError;

  try {
    const {
      loadOptions,
    } = paramsRef.current;

    response = await loadOptions(
      currentInputValue,
      currentOptions.options,
      currentOptions.additional,
    );

    hasError = false;
  } catch (e) {
    hasError = true;
  }

  if (hasError) {
    setOptionsCache((prevOptionsCache) => ({
      ...prevOptionsCache,
      [currentInputValue]: {
        ...currentOptions,
        isLoading: false,
      },
    }));

    return;
  }

  validateResponseParam(console, response);

  const {
    options,
    hasMore,
  } = response;

  // eslint-disable-next-line no-prototype-builtins
  const newAdditional = response.hasOwnProperty('additional')
    ? response.additional
    : currentOptions.additional;

  setOptionsCache((prevOptionsCache) => ({
    ...prevOptionsCache,
    [currentInputValue]: {
      ...currentOptions,
      options: reduceOptions(currentOptions.options, options, newAdditional),
      hasMore: !!hasMore,
      isLoading: false,
      isFirstLoad: false,
      additional: newAdditional,
    },
  }));
};

export const increaseStateId = (prevStateId: number): number => prevStateId + 1;

export const useAsyncPaginateBasePure = <
OptionType,
Group extends GroupBase<OptionType>,
Additional,
  >(
    useRefParam: typeof useRef,
    useStateParam: typeof useState,
    useEffectParam: typeof useEffect,
    useCallbackParam: typeof useCallback,
    useIsMountedParam: typeof useIsMounted,
    validateResponseParam: typeof validateResponse,
    getInitialOptionsCacheParam: typeof getInitialOptionsCache,
    requestOptionsParam: typeof requestOptions,
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

  const isMounted = useIsMountedParam();

  const isInitRef = useRefParam<boolean>(true);
  const paramsRef = useRefParam<UseAsyncPaginateBaseParams<OptionType, Group, Additional>>(params);

  paramsRef.current = params;

  const setStateId = useStateParam(0)[1];

  const optionsCacheRef = useRefParam<OptionsCache<OptionType, Group, Additional>>(null);

  if (optionsCacheRef.current === null) {
    optionsCacheRef.current = getInitialOptionsCacheParam(params);
  }

  const callRequestOptions = useCallbackParam((): void => {
    requestOptionsParam(
      paramsRef,
      optionsCacheRef,
      debounceTimeout,
      sleep,
      (reduceState) => {
        optionsCacheRef.current = reduceState(optionsCacheRef.current);

        if (isMounted()) {
          setStateId(increaseStateId);
        }
      },
      validateResponseParam,
      reduceOptions,
    );
  }, [debounceTimeout]);

  const handleScrolledToBottom = useCallbackParam((): void => {
    const currentInputValue = paramsRef.current.inputValue;
    const currentOptions = optionsCacheRef.current[currentInputValue];

    if (currentOptions) {
      callRequestOptions();
    }
  }, []);

  useEffectParam(() => {
    if (isInitRef.current) {
      isInitRef.current = false;
    } else {
      optionsCacheRef.current = {};
      setStateId(increaseStateId);
    }

    if (defaultOptions === true) {
      callRequestOptions();
    }
  }, deps);

  useEffectParam(() => {
    if (menuIsOpen && !optionsCacheRef.current[inputValue]) {
      callRequestOptions();
    }
  }, [inputValue]);

  useEffectParam(() => {
    if (
      menuIsOpen
      && !optionsCacheRef.current['']
      && loadOptionsOnMenuOpen
    ) {
      callRequestOptions();
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

export const useAsyncPaginateBase = <OptionType, Group extends GroupBase<OptionType>, Additional>(
  params: UseAsyncPaginateBaseParams<OptionType, Group, Additional>,
  deps: ReadonlyArray<any> = [],
): UseAsyncPaginateBaseResult<OptionType, Group> => useAsyncPaginateBasePure<
  OptionType,
  Group,
  Additional>(
    useRef,
    useState,
    useEffect,
    useCallback,
    useIsMounted,
    validateResponse,
    getInitialOptionsCache,
    requestOptions,
    params,
    deps,
  );
