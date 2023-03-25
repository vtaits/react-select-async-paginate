import {
  reset as resetAction,
} from '../actions';

import { requestOptions } from './requestOptions';

import type {
  Dispatch,
  Params,
  State,
} from '../types';

export const reset = <OptionType, Additional>() => (
  dispatch: Dispatch<OptionType, Additional>,
  getState: () => State<OptionType, Additional>,
  getParams: () => Params<OptionType, Additional>,
) => {
  dispatch(resetAction());

  const {
    autoload,
  } = getParams();

  if (autoload) {
    dispatch(requestOptions('autoload'));
  }
};
