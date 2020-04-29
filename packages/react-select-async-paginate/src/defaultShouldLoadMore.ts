import type {
  ShouldLoadMore,
} from './types';

const AVAILABLE_DELTA = 10;

export const defaultShouldLoadMore: ShouldLoadMore = (scrollHeight, clientHeight, scrollTop) => {
  const bottomBorder = scrollHeight - clientHeight - AVAILABLE_DELTA;

  return bottomBorder < scrollTop;
};
