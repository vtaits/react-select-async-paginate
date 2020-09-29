import type {
  OptionsList,
  Response,
  UseAsyncPaginateParams,
  UseAsyncPaginateBaseParams,
} from 'react-select-async-paginate';

export type Additional = {
  page: number;
};

export type MapResponsePayload<OptionType = any> = {
  search: string;
  prevPage: number;
  prevOptions: OptionsList<OptionType>;
};

export type MapResponse<OptionType = any> = (
  responseRaw: any,
  payload: MapResponsePayload<OptionType>,
) => Response<OptionType, Additional>;

export type Get = (
  url: string,
  params: {
    [key: string]: any;
  },
) => any;

export type UseSelectFetchMapParams<OptionType = any> = {
  url: string;
  queryParams?: {
    [key: string]: any;
  };
  searchParamName?: string;
  pageParamName?: string;
  offsetParamName?: string;
  mapResponse?: MapResponse<OptionType>;
  get?: Get;
  initialPage?: number;
  defaultInitialPage?: number;
};

export type UseSelectFetchParams<OptionType = any> =
  & UseSelectFetchMapParams<OptionType>
  & Partial<UseAsyncPaginateParams<OptionType, Additional>>;

export type UseSelectFetchBaseParams<OptionType = any> =
  & UseSelectFetchParams<OptionType>
  & Partial<UseAsyncPaginateBaseParams<OptionType, Additional>>
  & {
    inputValue: string;
    menuIsOpen: boolean;
  };
