import type {
  GroupBase,
} from 'react-select';

import type {
  ReduceOptions,
} from './types';

export const defaultReduceOptions: ReduceOptions<unknown, GroupBase<unknown>, unknown> = (
  prevOptions,
  loadedOptions,
) => [...prevOptions, ...loadedOptions];
