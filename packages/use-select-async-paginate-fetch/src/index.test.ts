import { expect, test } from "vitest";
import * as lib from "./index";
import { useMapToAsyncPaginate } from "./useMapToAsyncPaginate";

test("should export needed modules", () => {
	expect(lib.useMapToAsyncPaginate).toBe(useMapToAsyncPaginate);
});
