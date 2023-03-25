import type {
  Params,
  OptionsCacheItem,
} from './types';

export const getInitialCache = <OptionType, Additional>(
  params: Params<OptionType, Additional>,
): OptionsCacheItem<OptionType, Additional> => ({
    isFirstLoad: true,
    options: [],
    hasMore: true,
    isLoading: false,
    additional: params.additional,
  });
