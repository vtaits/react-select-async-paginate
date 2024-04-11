import * as lib from "../index";
import { reduceGroupedOptions } from "../reduceGroupedOptions";
import { useAsyncPaginate } from "../useAsyncPaginate";
import { useAsyncPaginateBase } from "../useAsyncPaginateBase";
import { useComponents } from "../useComponents";
import { withAsyncPaginate } from "../withAsyncPaginate";
import { wrapMenuList } from "../wrapMenuList";

test("should export needed modules", () => {
	expect(lib.AsyncPaginate).toBeTruthy();
	expect(lib.wrapMenuList).toBe(wrapMenuList);
	expect(lib.reduceGroupedOptions).toBe(reduceGroupedOptions);
	expect(lib.withAsyncPaginate).toBe(withAsyncPaginate);
	expect(lib.useAsyncPaginateBase).toBe(useAsyncPaginateBase);
	expect(lib.useAsyncPaginate).toBe(useAsyncPaginate);
	expect(lib.useComponents).toBe(useComponents);
});
