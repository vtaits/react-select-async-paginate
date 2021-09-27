import type {
  GroupBase,
} from 'react-select';

import {
  useAsyncPaginateBase,
} from 'react-select-async-paginate';
import type {
  UseAsyncPaginateBaseResult,
} from 'react-select-async-paginate';

import { useMapToAsyncPaginate } from './useMapToAsyncPaginate';

import type {
  UseSelectFetchBaseParams,
} from './types';

export const useSelectFetchBasePure = <OptionType, Group extends GroupBase<OptionType>>(
  useMapToAsyncPaginateParam: typeof useMapToAsyncPaginate,
  useAsyncPaginateParam: typeof useAsyncPaginateBase,
  params: UseSelectFetchBaseParams<OptionType, Group>,
  deps: ReadonlyArray<any> = [],
): UseAsyncPaginateBaseResult<OptionType, Group> => {
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

export const useSelectFetchBase = <OptionType, Group extends GroupBase<OptionType>>(
  params: UseSelectFetchBaseParams<OptionType, Group>,
  deps: ReadonlyArray<any> = [],
): UseAsyncPaginateBaseResult<OptionType, Group> => useSelectFetchBasePure(
    useMapToAsyncPaginate,
    useAsyncPaginateBase,
    params,
    deps,
  );
