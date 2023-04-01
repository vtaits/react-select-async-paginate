import {
  setMenuIsOpen as setMenuIsOpenAction,
} from '../actions';

import { requestOptions } from './requestOptions';

import type {
  Dispatch,
} from '../types/thunkHelpers';

import {
  RequestOptionsCaller,
} from '../types/internal';
import type {
  State,
} from '../types/internal';
import type {
  Params,
} from '../types/public';

export const setMenuIsOpen = <OptionType, Additional>(
  menuIsOpen: boolean,
) => (
    dispatch: Dispatch<OptionType, Additional>,
    getState: () => State<OptionType, Additional>,
    getParams: () => Params<OptionType, Additional>,
  ) => {
    dispatch(setMenuIsOpenAction(menuIsOpen));

    const {
      loadOptionsOnMenuOpen = true,
    } = getParams();

    const {
      cache,
      inputValue,
    } = getState();

    const currentCache = cache[inputValue];

    if (
      menuIsOpen
      && !currentCache
      && loadOptionsOnMenuOpen
    ) {
      dispatch(requestOptions(RequestOptionsCaller.MenuToggle));
    }
  };
