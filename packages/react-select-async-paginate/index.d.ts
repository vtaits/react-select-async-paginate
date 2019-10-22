import * as React from 'react';
import { InputActionMeta, OptionsType } from 'react-select/src/types';
import { Props as SelectProps } from 'react-select/base';

export type AsyncResult<OptionType, Additional = any> = {
  options: OptionType[];
  hasMore: boolean;
  additional?: Additional;
};

export type AsyncPaginateProps<OptionType, Additional = any> = {
  loadOptions: (inputValue: string, prevOptions: OptionType[], additional: Additional) => Promise<AsyncResult<OptionType, Additional>>;
  debounceTimeout?: number;
  additional?: Additional;
  shouldLoadMore?: (scrollHeight: number, clientHeight: number, scrollTop: number) => boolean;
  reduceOptions?: (previous: OptionType[], loaded: OptionType[], next: any) => any;
  cacheUniq?: any;
  selectRef?: React.Ref<any>;
  SelectComponent?: JSX.Element;
};

export type Props<OptionType, Additional = any> = SelectProps<OptionType> & AsyncPaginateProps<OptionType, Additional>;

export type State = {
  inputValue: string;
  menuIsOpen: boolean;
};

export class AsyncPaginate<OptionType, Additional = any> extends React.Component<Props<OptionType, Additional>, State> {
  onInputChange: (inputValue: string) => Promise<void>;
  onMenuClose: () => Promise<void>;
  onMenuOpen: () => Promise<void>;
}

export type BaseState = {
  optionsCache: { [key: string]: any };
}

export class AsyncPaginateBase<OptionType, Additional = any> extends React.Component<Props<OptionType, Additional>, BaseState> {
  onInputChange: (inputValue: string) => Promise<void>;
  onMenuClose: () => Promise<void>;
  onMenuOpen: () => Promise<void>;
}

export default AsyncPaginate;
