import {
  useAsyncPaginateBase,
} from 'react-select-async-paginate';
import type {
  UseAsyncPaginateParams,
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
  const mappedParams: UseAsyncPaginateParams<OptionType> = useMapToAsyncPaginateParam(params);

  const result: UseAsyncPaginateBaseResult<OptionType> = useAsyncPaginateParam(
    {
      ...params,
      ...mappedParams,
    },
    deps,
  );

  return result;
};

export const useSelectFetchBase = <OptionType = any>(
  params: UseSelectFetchBaseParams<OptionType>,
  deps: ReadonlyArray<any> = [],
): UseAsyncPaginateBaseResult<OptionType> => useSelectFetchBasePure(
    useMapToAsyncPaginate,
    useAsyncPaginateBase,
    params,
    deps,
  );
