import { expect, test } from "vitest";
import * as lib from "./index";
import { useSelectAsyncPaginate } from "./useSelectAsyncPaginate";

test("should have correct exports", () => {
	expect(lib.useSelectAsyncPaginate).toBe(useSelectAsyncPaginate);
});
