import { getInitialCache } from '../getInitialCache';

import type {
  Params,
  State,
} from '../types';

export const setLoading = <OptionType, Additional>(
  prevState: State<OptionType, Additional>,
  params: Params<OptionType, Additional>,
  {
    inputValue,
  }: {
    inputValue: string;
  },
): State<OptionType, Additional> => {
  const prevCache = prevState.cache[inputValue];

  const currentOptions = prevCache || getInitialCache(params);

  return {
    ...prevState,

    cache: {
      ...prevState.cache,
      [inputValue]: {
        ...currentOptions,
        isLoading: true,
      },
    },
  };
};
