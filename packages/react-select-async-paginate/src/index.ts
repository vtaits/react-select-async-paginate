import Select from 'react-select';

import { withAsyncPaginateBase } from './withAsyncPaginateBase';
import { withAsyncPaginate } from './withAsyncPaginate';

export { wrapMenuList } from './wrapMenuList';
export { reduceGroupedOptions } from './reduceGroupedOptions';

export { withAsyncPaginateBase };
export { withAsyncPaginate };

export { useAsyncPaginateBase } from './useAsyncPaginateBase';
export { useAsyncPaginate } from './useAsyncPaginate';
export { useComponents } from './useComponents';

export const AsyncPaginateBase = withAsyncPaginateBase(Select);
export const AsyncPaginate = withAsyncPaginate(Select);

export type {
  OptionsList,
  ReduceOptions,
  GetInitialOptionsCacheParams,
  OptionsCacheItem,
  OptionsCache,
  ShouldLoadMore,
  Response,
  LoadOptions,
  FilterOption,
  UseAsyncPaginateBaseResult,
  UseAsyncPaginateResult,
  UseAsyncPaginateParams,
  UseAsyncPaginateBaseParams,
  ComponentProps,
} from './types';
