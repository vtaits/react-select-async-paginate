import Select from 'react-select';

import { withSelectFetchBase } from './withSelectFetchBase';
import { withSelectFetch } from './withSelectFetch';

export { withSelectFetchBase };
export { withSelectFetch };

export { useSelectFetchBase } from './useSelectFetchBase';
export { useSelectFetch } from './useSelectFetch';
export { useMapToAsyncPaginate } from './useMapToAsyncPaginate';

export const SelectFetchBase = withSelectFetchBase(Select);
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
