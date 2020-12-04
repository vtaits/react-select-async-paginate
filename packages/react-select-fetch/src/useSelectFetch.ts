import {
  useAsyncPaginate,
} from 'react-select-async-paginate';
import type {
  UseAsyncPaginateResult,
} from 'react-select-async-paginate';

import { useMapToAsyncPaginate } from './useMapToAsyncPaginate';

import type {
  UseSelectFetchParams,
} from './types';

export const useSelectFetchPure = <OptionType>(
  useMapToAsyncPaginateParam: typeof useMapToAsyncPaginate,
  useAsyncPaginateParam: typeof useAsyncPaginate,
  params: UseSelectFetchParams<OptionType>,
  deps: ReadonlyArray<any> = [],
): UseAsyncPaginateResult<OptionType> => {
  const mappedParams = useMapToAsyncPaginateParam(params);

  const result = useAsyncPaginateParam(
    {
      ...params,
      ...mappedParams,
    },
    deps,
  );

  return result;
};

export const useSelectFetch = <OptionType>(
  params: UseSelectFetchParams<OptionType>,
  deps: ReadonlyArray<any> = [],
): UseAsyncPaginateResult<OptionType> => useSelectFetchPure(
    useMapToAsyncPaginate,
    useAsyncPaginate,
    params,
    deps,
  );
