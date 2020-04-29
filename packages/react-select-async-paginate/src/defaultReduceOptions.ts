import type {
  ReduceOptions,
} from './types';

export const defaultReduceOptions: ReduceOptions = (
  prevOptions,
  loadedOptions,
) => [...prevOptions, ...loadedOptions];
