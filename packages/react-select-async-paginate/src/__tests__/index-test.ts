import { wrapMenuList } from '../wrapMenuList';
import { reduceGroupedOptions } from '../reduceGroupedOptions';
import { withAsyncPaginate } from '../withAsyncPaginate';
import { useAsyncPaginateBase } from '../useAsyncPaginateBase';
import { useAsyncPaginate } from '../useAsyncPaginate';
import { useComponents } from '../useComponents';

import * as lib from '../index';

test('should export needed modules', () => {
  expect(lib.AsyncPaginate).toBeTruthy();
  expect(lib.wrapMenuList).toBe(wrapMenuList);
  expect(lib.reduceGroupedOptions).toBe(reduceGroupedOptions);
  expect(lib.withAsyncPaginate).toBe(withAsyncPaginate);
  expect(lib.useAsyncPaginateBase).toBe(useAsyncPaginateBase);
  expect(lib.useAsyncPaginate).toBe(useAsyncPaginate);
  expect(lib.useComponents).toBe(useComponents);
});
