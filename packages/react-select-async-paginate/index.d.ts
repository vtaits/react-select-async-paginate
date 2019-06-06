import * as React from 'react';
import { InputActionMeta, OptionsType } from 'react-select/lib/types';
import { Props as SelectProps } from 'react-select/lib/Select';

export type AsyncResult<OptionType, Additional> = {
  options: OptionType[];
  hasMore: boolean;
  additional?: Additional;
};

export type AsyncPaginateProps<OptionType, Additional> = {
  loadOptions: (inputValue: string, prevOptions: OptionType[], additional: Additional) => Promise<AsyncResult<OptionType>>;
  debounceTimeout?: number;
  additional?: Additional;
  shouldLoadMore?: (scrollHeight: number, clientHeight: number, scrollTop: number) => boolean;
  reduceOptions?: (previous: OptionType[], loaded: OptionType[], next: any) => any;
  cacheUniq?: any;
  selectRef?: React.Ref<any>;
  SelectComponent?: JSX.Element;
};

export type Props<OptionType, Additional> = SelectProps<OptionType> & AsyncPaginateProps<OptionType, Additional>;

export type State = {
  inputValue: string;
  menuIsOpen: boolean;
};

export class AsyncPaginate<OptionType, Additional> extends React.Component<Props<OptionType, Additional>, State> {
  onInputChange: (inputValue: string) => Promise<void>;
  onMenuClose: () => Promise<void>;
  onMenuOpen: () => Promise<void>;
}

export default AsyncPaginate;
