import type {
  State,
} from '../types/internal';

export const reset = <OptionType, Additional>(
  prevState: State<OptionType, Additional>,
): State<OptionType, Additional> => ({
    ...prevState,
    cache: {},
  });
