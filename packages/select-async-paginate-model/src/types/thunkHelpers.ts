import type {
  ThunkDispatch,
} from 'redux-thunk';

import type {
  ActionType,
} from '../actions';

import type {
  State,
} from './internal';
import type {
  Params,
} from './public';

export type Dispatch<OptionType, Additional> = ThunkDispatch<
State<OptionType, Additional>,
() => Params<OptionType, Additional>,
ActionType<OptionType, Additional>
>;
