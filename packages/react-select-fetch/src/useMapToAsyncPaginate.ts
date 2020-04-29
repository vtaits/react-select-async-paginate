import { useCallback } from 'react';

import type {
  LoadOptions,
  UseAsyncPaginateParams,
} from 'react-select-async-paginate';

import {
  get as defaultGet,
} from './get';

import type {
  Additional,
  MapResponse,
  UseSelectFetchMapParams,
} from './types';

export const defaultAdditional: Additional = {
  page: 1,
};

export const defaultResponseMapper: MapResponse = (response) => response;

export const useMapToAsyncPaginatePure = <OptionType>(
  useCallbackParam: typeof useCallback,
  selectFetchParams: UseSelectFetchMapParams<OptionType>,
): UseAsyncPaginateParams<OptionType, Additional> => {
  const {
    url,
    queryParams = {},
    searchParamName = 'search',
    pageParamName = 'page',
    offsetParamName = 'offset',
    mapResponse = defaultResponseMapper,
    get = defaultGet,
  } = selectFetchParams;

  const loadOptions = useCallbackParam<LoadOptions<OptionType, Additional>>(
    async (search, prevOptions, { page }) => {
      const params = {
        ...queryParams,
        [searchParamName]: search,
      };

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
    additional: defaultAdditional,
  };
};

export const useMapToAsyncPaginate = <OptionType>(
  params: UseSelectFetchMapParams<OptionType>,
): UseAsyncPaginateParams<OptionType, Additional> => useMapToAsyncPaginatePure<OptionType>(
    useCallback,
    params,
  );
