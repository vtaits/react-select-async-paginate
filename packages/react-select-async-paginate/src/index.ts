import Select from 'react-select';

import { withAsyncPaginate } from './withAsyncPaginate';

export { wrapMenuList } from './wrapMenuList';
export { reduceGroupedOptions } from './reduceGroupedOptions';

export { withAsyncPaginate };

export { useAsyncPaginateBase } from './useAsyncPaginateBase';
export { useAsyncPaginate } from './useAsyncPaginate';
export { useComponents } from './useComponents';

export const AsyncPaginate = withAsyncPaginate(Select);

export type {
  OptionsList,
  ReduceOptions,
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
