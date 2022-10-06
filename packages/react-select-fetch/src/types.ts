import type {
  ReactElement,
} from 'react';
import type {
  GroupBase,
  OptionsOrGroups,
  Props as SelectProps,
} from 'react-select';

import type {
  ComponentProps,
  Response,
  UseAsyncPaginateParams,
  UseAsyncPaginateBaseParams,
} from 'react-select-async-paginate';

export type Additional = {
  page: number;
};

export type MapResponsePayload<OptionType, Group extends GroupBase<OptionType>> = {
  search: string;
  prevPage: number;
  prevOptions: OptionsOrGroups<OptionType, Group>;
};

export type MapResponse<OptionType, Group extends GroupBase<OptionType>> = (
  responseRaw: unknown,
  payload: MapResponsePayload<OptionType, Group>,
) => Response<OptionType, Group, Additional>;

export type Get = (
  url: string,
  params: {
    [key: string]: any;
  },
) => any;

export type UseSelectFetchMapParams<OptionType, Group extends GroupBase<OptionType>> = {
  url: string;
  queryParams?: {
    [key: string]: any;
  };
  searchParamName?: string | null;
  pageParamName?: string | null;
  offsetParamName?: string | null;
  mapResponse?: MapResponse<OptionType, Group>;
  get?: Get;
  initialPage?: number;
  defaultInitialPage?: number;
};

export type UseSelectFetchParams<OptionType, Group extends GroupBase<OptionType>> =
  & UseSelectFetchMapParams<OptionType, Group>
  & Partial<UseAsyncPaginateParams<OptionType, Group, Additional>>;

export type UseSelectFetchBaseParams<OptionType, Group extends GroupBase<OptionType>> =
  & UseSelectFetchParams<OptionType, Group>
  & Partial<UseAsyncPaginateBaseParams<OptionType, Group, Additional>>
  & {
    inputValue: string;
    menuIsOpen: boolean;
  };

export type SelectFetchProps<
OptionType,
Group extends GroupBase<OptionType>,
IsMulti extends boolean,
> =
  & SelectProps<OptionType, IsMulti, Group>
  & UseSelectFetchParams<OptionType, Group>
  & ComponentProps<OptionType, Group, IsMulti>;

export type SelectFetchType = <
OptionType,
Group extends GroupBase<OptionType>,
IsMulti extends boolean = false,
>(props: SelectFetchProps<OptionType, Group, IsMulti>) => ReactElement;
