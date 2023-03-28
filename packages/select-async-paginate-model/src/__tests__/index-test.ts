import { createAsyncPaginateModel } from '../createAsyncPaginateModel';
import {
  RequestOptionsCaller,
} from '../types';

import * as lib from '../index';

test('should have correct exports', () => {
  expect(lib).toEqual({
    createAsyncPaginateModel,
    RequestOptionsCaller,
  });
});
