import type {
  MutableRefObject,
} from 'react';

import type {
  GroupBase,
} from 'react-select';
import sleep from 'sleep-promise';

import { getInitialCache } from './getInitialCache';
import { validateResponse } from './validateResponse';

import type {
  OptionsCache,
  OptionsCacheItem,
  UseAsyncPaginateBaseParams,
  ReduceOptions,
  RequestOptionsCallerType,
} from './types';

type MapOptionsCache<OptionType, Group extends GroupBase<OptionType>, Additional> = (
  prevCache: OptionsCache<OptionType, Group, Additional>,
) => OptionsCache<OptionType, Group, Additional>;

type SetOptionsCache<OptionType, Group extends GroupBase<OptionType>, Additional> = (
  stateMapper: MapOptionsCache<OptionType, Group, Additional>,
) => void;

export const requestOptions = async <OptionType, Group extends GroupBase<OptionType>, Additional>(
  caller: RequestOptionsCallerType,
  paramsRef: MutableRefObject<UseAsyncPaginateBaseParams<OptionType, Group, Additional>>,
  optionsCacheRef: MutableRefObject<OptionsCache<OptionType, Group, Additional>>,
  debounceTimeout: number,
  setOptionsCache: SetOptionsCache<OptionType, Group, Additional>,
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

  if (debounceTimeout > 0 && caller === 'input-change') {
    await sleep(debounceTimeout);

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
  let hasError = false;

  try {
    const {
      loadOptions,
    } = paramsRef.current;

    response = await loadOptions(
      currentInputValue,
      currentOptions.options,
      currentOptions.additional,
    );
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

  if (validateResponse(response)) {
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
  }
};
