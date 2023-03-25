import { requestOptions } from './requestOptions';

import type {
  Dispatch,
  State,
} from '../types';

export const loadMore = <OptionType, Additional>() => (
  dispatch: Dispatch<OptionType, Additional>,
  getState: () => State<OptionType, Additional>,
) => {
  const {
    cache,
    inputValue,
  } = getState();

  const currentCache = cache[inputValue];

  if (currentCache) {
    dispatch(requestOptions('menu-scroll'));
  }
};
