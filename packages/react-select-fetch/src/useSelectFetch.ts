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

export const useSelectFetch = <OptionType, Group extends GroupBase<OptionType>>(
  params: UseSelectFetchParams<OptionType, Group>,
  deps: ReadonlyArray<unknown> = [],
): UseAsyncPaginateResult<OptionType, Group> => {
  const mappedParams = useMapToAsyncPaginate(params);

  const result = useAsyncPaginate(
    {
      ...params,
      ...mappedParams,
    },
    deps,
  );

  return result;
};
