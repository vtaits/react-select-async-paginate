import { withSelectFetchBase } from '../withSelectFetchBase';
import { withSelectFetch } from '../withSelectFetch';
import { useSelectFetchBase } from '../useSelectFetchBase';
import { useSelectFetch } from '../useSelectFetch';
import { useMapToAsyncPaginate } from '../useMapToAsyncPaginate';

import * as lib from '../index';

test('should export needed modules', () => {
  expect(lib.SelectFetchBase).toBeTruthy();
  expect(lib.SelectFetch).toBeTruthy();
  expect(lib.withSelectFetchBase).toBe(withSelectFetchBase);
  expect(lib.withSelectFetch).toBe(withSelectFetch);
  expect(lib.useSelectFetchBase).toBe(useSelectFetchBase);
  expect(lib.useSelectFetch).toBe(useSelectFetch);
  expect(lib.useMapToAsyncPaginate).toBe(useMapToAsyncPaginate);
});
