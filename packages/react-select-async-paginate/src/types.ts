import type {
  Ref,
} from 'react';
import type {
  GroupedOptionsType,
  InputActionMeta,
  OptionsType,
} from 'react-select';

export type OptionsList<OptionType = any> =
  | GroupedOptionsType<OptionType>
  | OptionsType<OptionType>;

export type ReduceOptions<OptionType = any, Additional = any> = (
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

export type OptionsCache<OptionType = any, Additional = any> = {
  [key: string]: OptionsCacheItem<OptionType, Additional>;
};

export type ShouldLoadMore = (
  scrollHeight: number,
  clientHeight: number,
  scrollTop: number,
) => boolean;

export type Response<OptionType = any, Additional = any> = {
  options: OptionsList<OptionType>;
  hasMore?: boolean;
  additional?: Additional;
};

export type LoadOptions<OptionType = any, Additional = any> = (
  inputValue: string,
  options: OptionsList<OptionType>,
  additional?: Additional,
) => Response<OptionType> | Promise<Response<OptionType>>;

export type FilterOption = ((
  option: any,
  rawInput: string
) => boolean) | null;

export type UseAsyncPaginateBaseResult<OptionType = any> = {
  handleScrolledToBottom: () => void;
  shouldLoadMore: ShouldLoadMore;
  isLoading: boolean;
  isFirstLoad: boolean;
  options: OptionsList<OptionType>;
  filterOption: FilterOption;
};

export type UseAsyncPaginateResult<OptionsParamType = any> =
  & UseAsyncPaginateBaseResult<OptionsParamType>
  & {
    inputValue: string;
    menuIsOpen: boolean;
    onInputChange: (inputValue: string, actionMeta: InputActionMeta) => void;
    onMenuClose: () => void;
    onMenuOpen: () => void;
  };

export type UseAsyncPaginateParams<OptionType = any, Additional = any> = {
  loadOptions: LoadOptions<OptionType>;
  options?: OptionsList<OptionType>;
  defaultOptions?: boolean | OptionsList<OptionType>;
  additional?: Additional;
  defaultAdditional?: Additional;
  loadOptionsOnMenuOpen?: boolean;
  debounceTimeout?: number;
  reduceOptions?: ReduceOptions<OptionType>;
  shouldLoadMore?: ShouldLoadMore;
  filterOption?: FilterOption;
  inputValue?: string;
  menuIsOpen?: boolean;
  onInputChange?: (newValue: string, actionMeta: InputActionMeta) => void;
  onMenuClose?: () => void;
  onMenuOpen?: () => void;
};

export type UseAsyncPaginateBaseParams<
  OptionType = any,
  Additional = any
> = UseAsyncPaginateParams<OptionType, Additional> & {
  inputValue: string;
  menuIsOpen: boolean;
};

export type ComponentProps = {
  selectRef?: Ref<any>;
  cacheUniqs?: ReadonlyArray<any>;
};
