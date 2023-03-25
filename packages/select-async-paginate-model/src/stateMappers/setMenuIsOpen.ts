import type {
  State,
} from '../types';

export const setMenuIsOpen = <OptionType, Additional>(
  prevState: State<OptionType, Additional>,
  {
    menuIsOpen,
  }: {
    menuIsOpen: boolean;
  },
): State<OptionType, Additional> => ({
    ...prevState,
    menuIsOpen,
  });
