import { getInitialOptionsCache } from './getInitialOptionsCache';

import type {
  Params,
  State,
} from './types';

export const getInitialState = <OptionType, Additional>(
  params: Params<OptionType, Additional>,
): State<OptionType, Additional> => {
  const {
    initialInputValue = '',
    initialMenuIsOpen = false,
  } = params;

  return {
    cache: getInitialOptionsCache(params),
    inputValue: initialInputValue,
    menuIsOpen: initialMenuIsOpen,
  };
};
