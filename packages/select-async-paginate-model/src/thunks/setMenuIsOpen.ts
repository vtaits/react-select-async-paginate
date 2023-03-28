import {
  setMenuIsOpen as setMenuIsOpenAction,
} from '../actions';

import { requestOptions } from './requestOptions';

import type {
  Dispatch,
} from '../thunkHelpers';

import {
  RequestOptionsCaller,
} from '../types';
import type {
  Params,
  State,
} from '../types';

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
