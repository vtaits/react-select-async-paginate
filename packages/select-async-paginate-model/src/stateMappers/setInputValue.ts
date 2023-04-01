import type {
  State,
} from '../types/internal';

export const setInputValue = <OptionType, Additional>(
  prevState: State<OptionType, Additional>,
  {
    inputValue,
  }: {
    inputValue: string;
  },
): State<OptionType, Additional> => ({
    ...prevState,
    inputValue,
  });
