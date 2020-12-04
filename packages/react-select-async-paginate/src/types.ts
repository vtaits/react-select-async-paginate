import type {
  Ref,
} from 'react';
import type {
  GroupedOptionsType,
  InputActionMeta,
  OptionsType,
} from 'react-select';

export type OptionsList<OptionType> =
  | GroupedOptionsType<OptionType>
  | OptionsType<OptionType>;

export type ReduceOptions<OptionType, Additional> = (
  prevOptions: OptionsList<OptionType>,
  loadedOptions: OptionsList<OptionType>,
  additional: Additional,
) => OptionsList<OptionType>;

export type OptionsCacheItem<OptionType, Additional> = {
  isFirstLoad: boolean;
  isLoading: boolean;
  options: OptionsList<OptionType>;
  hasMore: boolean;
  additional?: Additional;
};

export type OptionsCache<OptionType, Additional> = {
  [key: string]: OptionsCacheItem<OptionType, Additional>;
};

export type ShouldLoadMore = (
  scrollHeight: number,
  clientHeight: number,
  scrollTop: number,
) => boolean;

export type Response<OptionType, Additional> = {
  options: OptionsList<OptionType>;
  hasMore?: boolean;
  additional?: Additional;
};

export type LoadOptions<OptionType, Additional> = (
  inputValue: string,
  options: OptionsList<OptionType>,
  additional?: Additional,
) => Response<OptionType, Additional> | Promise<Response<OptionType, Additional>>;

export type FilterOption = ((
  option: any,
  rawInput: string
) => boolean) | null;

export type UseAsyncPaginateBaseResult<OptionType> = {
  handleScrolledToBottom: () => void;
  shouldLoadMore: ShouldLoadMore;
  isLoading: boolean;
  isFirstLoad: boolean;
  options: OptionsList<OptionType>;
  filterOption: FilterOption;
};

export type UseAsyncPaginateResult<OptionsParamType> =
  & UseAsyncPaginateBaseResult<OptionsParamType>
  & {
    inputValue: string;
    menuIsOpen: boolean;
    onInputChange: (inputValue: string, actionMeta: InputActionMeta) => void;
    onMenuClose: () => void;
    onMenuOpen: () => void;
  };

export type UseAsyncPaginateParams<OptionType, Additional> = {
  loadOptions: LoadOptions<OptionType, Additional>;
  options?: OptionsList<OptionType>;
  defaultOptions?: boolean | OptionsList<OptionType>;
  additional?: Additional;
  defaultAdditional?: Additional;
  loadOptionsOnMenuOpen?: boolean;
  debounceTimeout?: number;
  reduceOptions?: ReduceOptions<OptionType, Additional>;
  shouldLoadMore?: ShouldLoadMore;
  filterOption?: FilterOption;
  inputValue?: string;
  menuIsOpen?: boolean;
  onInputChange?: (newValue: string, actionMeta: InputActionMeta) => void;
  onMenuClose?: () => void;
  onMenuOpen?: () => void;
};

export type UseAsyncPaginateBaseParams<
  OptionType,
  Additional,
> = UseAsyncPaginateParams<OptionType, Additional> & {
  inputValue: string;
  menuIsOpen: boolean;
};

export type ComponentProps = {
  selectRef?: Ref<any>;
  cacheUniqs?: ReadonlyArray<any>;
};
