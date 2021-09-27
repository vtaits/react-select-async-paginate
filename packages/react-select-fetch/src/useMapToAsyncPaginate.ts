import {
  useCallback,
  useMemo,
} from 'react';

import type {
  GroupBase,
} from 'react-select';

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

export const defaultResponseMapper: MapResponse<any, any> = (response) => response;

export const useMapToAsyncPaginatePure = <OptionType, Group extends GroupBase<OptionType>>(
  useCallbackParam: typeof useCallback,
  useMemoParam: typeof useMemo,
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

  const additional = useMemoParam<Additional>(() => ({
    page: initialPage,
  }), [initialPage]);

  const defaultAdditional = useMemoParam<Additional>(() => ({
    page: defaultInitialPage,
  }), [defaultInitialPage]);

  const loadOptions = useCallbackParam<LoadOptions<OptionType, Group, Additional>>(
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
    additional,
    defaultAdditional,
  };
};

export const useMapToAsyncPaginate = <OptionType, Group extends GroupBase<OptionType>>(
  params: UseSelectFetchMapParams<OptionType, Group>,
): UseAsyncPaginateParams<OptionType, Group, Additional> => useMapToAsyncPaginatePure<
  OptionType,
  Group
  >(
    useCallback,
    useMemo,
    params,
  );
