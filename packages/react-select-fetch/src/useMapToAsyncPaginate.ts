import {
  useCallback,
  useMemo,
} from 'react';

import type {
  GroupBase,
} from 'react-select';

import {
  checkIsResponse,
} from 'react-select-async-paginate';
import type {
  LoadOptions,
  UseAsyncPaginateParams,
} from 'react-select-async-paginate';

import {
  get as defaultGet,
} from './get';

import type {
  Additional,
  UseSelectFetchMapParams,
} from './types';

export const errorText = '[react-select-fetch] response should be an object with "options" prop, which contains array of options. Also you can use `mapResponse` param';

export const defaultResponseMapper = <OptionType, Group extends GroupBase<OptionType>>(
  response: unknown,
) => {
  if (checkIsResponse<OptionType, Group, Additional>(response)) {
    return response;
  }

  throw new Error(errorText);
};

export const useMapToAsyncPaginate = <OptionType, Group extends GroupBase<OptionType>>(
  selectFetchParams: UseSelectFetchMapParams<OptionType, Group>,
): UseAsyncPaginateParams<OptionType, Group, Additional> => {
  const {
    url,
    queryParams = {},
    searchParamName = 'search',
    pageParamName = 'page',
    offsetParamName = 'offset',
    mapResponse = defaultResponseMapper,
    get = defaultGet,
    initialPage = 1,
    defaultInitialPage = 2,
  } = selectFetchParams;

  const additional = useMemo<Additional>(() => ({
    page: initialPage,
  }), [initialPage]);

  const defaultAdditional = useMemo<Additional>(() => ({
    page: defaultInitialPage,
  }), [defaultInitialPage]);

  const loadOptions = useCallback<LoadOptions<OptionType, Group, Additional>>(
    async (search, prevOptions, currentAdditional) => {
      if (currentAdditional === undefined) {
        throw new Error();
      }

      const { page } = currentAdditional;

      const params: Record<string, unknown> = {
        ...queryParams,
      };

      if (searchParamName) {
        params[searchParamName] = search;
      }

      if (pageParamName) {
        params[pageParamName] = page;
      }

      if (offsetParamName) {
        params[offsetParamName] = prevOptions.length;
      }

      let responseRaw;
      let hasError = false;

      try {
        responseRaw = await get(url, params);
      } catch (e) {
        hasError = true;
      }

      if (hasError) {
        return {
          options: [],
          hasMore: false,
        };
      }

      const response = mapResponse(responseRaw, {
        search,
        prevPage: page,
        prevOptions,
      });

      return {
        ...response,

        additional: {
          page: page + 1,
        },
      };
    },

    [
      url,
      queryParams,
      searchParamName,
      pageParamName,
      offsetParamName,
      mapResponse,
      get,
    ],
  );

  return {
    loadOptions,
    additional,
    defaultAdditional,
  };
};
