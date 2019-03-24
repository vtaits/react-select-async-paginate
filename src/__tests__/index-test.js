import AsyncPaginate from '../async-paginate';
import AsyncPaginateBase from '../async-paginate-base';
import wrapMenuList from '../wrap-menu-list';
import reduceGroupedOptions from '../reduce-grouped-options';

import * as lib from '../index';

test('should export needed modules', () => {
  expect(lib.default).toBe(AsyncPaginate);
  expect(lib.AsyncPaginateBase).toBe(AsyncPaginateBase);
  expect(lib.wrapMenuList).toBe(wrapMenuList);
  expect(lib.reduceGroupedOptions).toBe(reduceGroupedOptions);
});
