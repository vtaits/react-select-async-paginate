import type {
  ThunkDispatch,
} from 'redux-thunk';

import type {
  ActionType,
} from './actions';

import type {
  Params,
  State,
} from './types';

export type Dispatch<OptionType, Additional> = ThunkDispatch<
State<OptionType, Additional>,
() => Params<OptionType, Additional>,
ActionType<OptionType, Additional>
>;
