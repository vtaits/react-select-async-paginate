import type {
  GroupBase,
  OptionsOrGroups,
} from 'react-select';

import type {
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
  responseRaw: any,
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
  searchParamName?: string;
  pageParamName?: string;
  offsetParamName?: string;
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
