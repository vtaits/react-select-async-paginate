import { expect, test } from "vitest";
import * as lib from "./index";
import { useMapToAsyncPaginate } from "./useMapToAsyncPaginate";
import { useSelectFetch } from "./useSelectFetch";
import { useSelectFetchBase } from "./useSelectFetchBase";
import { withSelectFetch } from "./withSelectFetch";

test("should export needed modules", () => {
	expect(lib.SelectFetch).toBeTruthy();
	expect(lib.withSelectFetch).toBe(withSelectFetch);
	expect(lib.useSelectFetchBase).toBe(useSelectFetchBase);
	expect(lib.useSelectFetch).toBe(useSelectFetch);
	expect(lib.useMapToAsyncPaginate).toBe(useMapToAsyncPaginate);
});
