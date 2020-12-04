import type {
  OptionsList,
  Response,
  UseAsyncPaginateParams,
  UseAsyncPaginateBaseParams,
} from 'react-select-async-paginate';

export type Additional = {
  page: number;
};

export type MapResponsePayload<OptionType> = {
  search: string;
  prevPage: number;
  prevOptions: OptionsList<OptionType>;
};

export type MapResponse<OptionType> = (
  responseRaw: any,
  payload: MapResponsePayload<OptionType>,
) => Response<OptionType, Additional>;

export type Get = (
  url: string,
  params: {
    [key: string]: any;
  },
) => any;

export type UseSelectFetchMapParams<OptionType> = {
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

export type UseSelectFetchParams<OptionType> =
  & UseSelectFetchMapParams<OptionType>
  & Partial<UseAsyncPaginateParams<OptionType, Additional>>;

export type UseSelectFetchBaseParams<OptionType> =
  & UseSelectFetchParams<OptionType>
  & Partial<UseAsyncPaginateBaseParams<OptionType, Additional>>
  & {
    inputValue: string;
    menuIsOpen: boolean;
  };
