import Select from 'react-select';

import { withSelectFetch } from './withSelectFetch';

export { withSelectFetch };

export { useSelectFetchBase } from './useSelectFetchBase';
export { useSelectFetch } from './useSelectFetch';
export { useMapToAsyncPaginate } from './useMapToAsyncPaginate';

export const SelectFetch = withSelectFetch(Select);

export type {
  Additional,
  MapResponsePayload,
  MapResponse,
  Get,
  UseSelectFetchMapParams,
  UseSelectFetchParams,
  UseSelectFetchBaseParams,
} from './types';
