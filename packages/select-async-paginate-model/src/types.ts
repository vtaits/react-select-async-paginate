import type {
  ThunkDispatch,
} from 'redux-thunk';

import type {
  ActionType,
} from './actions';

export type RequestOptionsCallerType = 'autoload' | 'menu-toggle' | 'input-change' | 'menu-scroll';

export type Response<OptionType, Additional> = {
  options: readonly OptionType[];
  hasMore?: boolean;
  additional?: Additional;
};

export type LoadOptions<OptionType, Additional> = (
  inputValue: string,
  options: readonly OptionType[],
  additional?: Additional,
) => Response<OptionType, Additional> | Promise<Response<OptionType, Additional>>;

export type ReduceOptions<OptionType, Additional> = (
  prevOptions: readonly OptionType[],
  loadedOptions: readonly OptionType[],
  additional: Additional | undefined,
) => readonly OptionType[];

export type Params<OptionType, Additional> = {
  additional?: Additional;
  autoload?: boolean;
  debounceTimeout?: number;
  initialAdditional?: Additional;
  initialInputValue?: string;
  initialMenuIsOpen?: boolean;
  initialOptions?: readonly OptionType[];
  loadOptionsOnMenuOpen?: boolean;
  reduceOptions?: ReduceOptions<OptionType, Additional>;
  loadOptions: LoadOptions<OptionType, Additional>;
};

export type OptionsCacheItem<OptionType, Additional> = {
  isFirstLoad: boolean;
  isLoading: boolean;
  options: readonly OptionType[];
  hasMore: boolean;
  additional?: Additional;
};

export type OptionsCache<OptionType, Additional> = {
  [key: string]: OptionsCacheItem<OptionType, Additional>;
};

export type State<OptionType, Additional> = {
  cache: OptionsCache<OptionType, Additional>;
  inputValue: string;
  menuIsOpen: boolean;
};

export type Dispatch<OptionType, Additional> = ThunkDispatch<
State<OptionType, Additional>,
() => Params<OptionType, Additional>,
ActionType<OptionType, Additional>
>;
