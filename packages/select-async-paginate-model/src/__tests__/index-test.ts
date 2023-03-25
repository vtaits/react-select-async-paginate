import { createAsyncPaginateModel } from '../createAsyncPaginateModel';

import * as lib from '../index';

test('should have correct exports', () => {
  expect(lib).toEqual({
    createAsyncPaginateModel,
  });
});
