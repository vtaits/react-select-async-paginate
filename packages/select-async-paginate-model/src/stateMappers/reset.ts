import type {
  State,
} from '../types';

export const reset = <OptionType, Additional>(
  prevState: State<OptionType, Additional>,
): State<OptionType, Additional> => ({
    ...prevState,
    cache: {},
  });
