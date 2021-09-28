import type {
  GroupBase,
} from 'react-select';

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

export const useSelectFetchPure = <OptionType, Group extends GroupBase<OptionType>>(
  useMapToAsyncPaginateParam: typeof useMapToAsyncPaginate,
  useAsyncPaginateParam: typeof useAsyncPaginate,
  params: UseSelectFetchParams<OptionType, Group>,
  deps: ReadonlyArray<any> = [],
): UseAsyncPaginateResult<OptionType, Group> => {
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

export const useSelectFetch = <OptionType, Group extends GroupBase<OptionType>>(
  params: UseSelectFetchParams<OptionType, Group>,
  deps: ReadonlyArray<any> = [],
): UseAsyncPaginateResult<OptionType, Group> => useSelectFetchPure(
    useMapToAsyncPaginate,
    useAsyncPaginate,
    params,
    deps,
  );
