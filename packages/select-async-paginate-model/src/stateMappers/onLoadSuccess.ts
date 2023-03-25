import { defaultReduceOptions } from '../defaultReduceOptions';

import type {
  Params,
  Response,
  State,
} from '../types';

export const onLoadSuccess = <OptionType, Additional>(
  prevState: State<OptionType, Additional>,
  params: Params<OptionType, Additional>,
  {
    inputValue,
    response,
  }: {
    inputValue: string;
    response: Response<OptionType, Additional>;
  },
): State<OptionType, Additional> => {
  const prevCache = prevState.cache[inputValue];

  if (!prevCache) {
    throw new Error(`[select-async-paginate-model] cache is not found for input value "${inputValue}"`);
  }

  const {
    reduceOptions = defaultReduceOptions,
  } = params;

  const {
    options,
    hasMore,
  } = response;

  // eslint-disable-next-line no-prototype-builtins
  const nextAdditional = response.hasOwnProperty('additional')
    ? response.additional
    : prevCache.additional;

  return {
    ...prevState,
    cache: {
      ...prevState.cache,
      [inputValue]: {
        ...prevCache,
        options: reduceOptions(prevCache.options, options, nextAdditional),
        hasMore: !!hasMore,
        isLoading: false,
        isFirstLoad: false,
        additional: nextAdditional,
      },
    },
  };
};
