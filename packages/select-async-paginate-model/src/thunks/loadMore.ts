import { requestOptions } from './requestOptions';

import type {
  Dispatch,
} from '../thunkHelpers';

import {
  RequestOptionsCaller,
} from '../types';
import type {
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
    dispatch(requestOptions(RequestOptionsCaller.MenuScroll));
  }
};
