import type {
  State,
} from '../types/internal';

export const unsetLoading = <OptionType, Additional>(
  prevState: State<OptionType, Additional>,
  {
    inputValue,
    isClean,
  }: {
    inputValue: string;
    isClean: boolean;
  },
): State<OptionType, Additional> => {
  const prevCache = prevState.cache[inputValue];

  if (!prevCache) {
    return prevState;
  }

  if (isClean) {
    const {
      [inputValue]: itemForDelete,
      ...restCache
    } = prevState.cache;

    return {
      ...prevState,
      cache: restCache,
    };
  }

  return {
    ...prevState,

    cache: {
      ...prevState.cache,
      [inputValue]: {
        ...prevCache,
        isLoading: false,
      },
    },
  };
};
