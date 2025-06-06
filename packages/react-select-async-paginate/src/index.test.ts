import { expect, test } from "vitest";
import { useComponents } from "./components/useComponents";
import { wrapMenuList } from "./components/wrapMenuList";
import * as lib from "./index";
import { reduceGroupedOptions } from "./reduceGroupedOptions";
import { useAsyncPaginate } from "./useAsyncPaginate";
import { useAsyncPaginateBase } from "./useAsyncPaginateBase";
import { withAsyncPaginate } from "./withAsyncPaginate";

test("should export needed modules", () => {
	expect(lib.AsyncPaginate).toBeTruthy();
	expect(lib.wrapMenuList).toBe(wrapMenuList);
	expect(lib.reduceGroupedOptions).toBe(reduceGroupedOptions);
	expect(lib.withAsyncPaginate).toBe(withAsyncPaginate);
	expect(lib.useAsyncPaginateBase).toBe(useAsyncPaginateBase);
	expect(lib.useAsyncPaginate).toBe(useAsyncPaginate);
	expect(lib.useComponents).toBe(useComponents);
});
