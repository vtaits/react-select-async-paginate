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

export const useSelectFetchBasePure = <OptionType>(
  useMapToAsyncPaginateParam: typeof useMapToAsyncPaginate,
  useAsyncPaginateParam: typeof useAsyncPaginateBase,
  params: UseSelectFetchBaseParams<OptionType>,
  deps: ReadonlyArray<any> = [],
): UseAsyncPaginateBaseResult<OptionType> => {
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

export const useSelectFetchBase = <OptionType>(
  params: UseSelectFetchBaseParams<OptionType>,
  deps: ReadonlyArray<any> = [],
): UseAsyncPaginateBaseResult<OptionType> => useSelectFetchBasePure(
    useMapToAsyncPaginate,
    useAsyncPaginateBase,
    params,
    deps,
  );
