import { sleep } from '../utils/sleep';

import {
  onLoadSuccess,
  setLoading,
  unsetLoading,
} from '../actions';

import { getInitialCache } from '../getInitialCache';
import { validateResponse } from '../validateResponse';

import type {
  Dispatch,
  Params,
  RequestOptionsCallerType,
  State,
} from '../types';

export const requestOptions = <OptionType, Additional>(
  caller: RequestOptionsCallerType,
) => async (
    dispatch: Dispatch<OptionType, Additional>,
    getState: () => State<OptionType, Additional>,
    getParams: () => Params<OptionType, Additional>,
  ) => {
    const params = getParams();

    const {
      debounceTimeout = 0,
      loadOptions,
    } = params;

    const {
      cache,
      inputValue,
    } = getState();

    const isCacheEmpty = !cache[inputValue];

    const currentCache = cache[inputValue] || getInitialCache(params);

    if (currentCache.isLoading || !currentCache.hasMore) {
      return;
    }

    dispatch(setLoading(inputValue));

    if (debounceTimeout > 0 && caller === 'input-change') {
      await sleep(debounceTimeout);

      const newInputValue = getState().inputValue;

      if (inputValue !== newInputValue) {
        dispatch(unsetLoading(inputValue, isCacheEmpty));
        return;
      }
    }

    let response;
    let hasError = false;

    try {
      response = await loadOptions(
        inputValue,
        currentCache.options,
        currentCache.additional,
      );
    } catch (e) {
      hasError = true;
    }

    if (hasError) {
      dispatch(unsetLoading(inputValue, false));
      return;
    }

    if (!validateResponse(response)) {
      dispatch(unsetLoading(inputValue, false));
      return;
    }

    dispatch(onLoadSuccess(inputValue, response));
  };
