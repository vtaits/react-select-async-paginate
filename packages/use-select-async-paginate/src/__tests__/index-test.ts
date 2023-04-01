import { useSelectAsyncPaginate } from '../useSelectAsyncPaginate';

import * as lib from '../index';

test('should have correct exports', () => {
  expect(lib).toEqual({
    useSelectAsyncPaginate,
  });
});
