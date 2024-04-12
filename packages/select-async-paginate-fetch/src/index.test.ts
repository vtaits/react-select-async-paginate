import { expect, test } from "vitest";
import { get } from "./get";
import * as lib from "./index";
import { mapToAsyncPaginate } from "./mapToAsyncPaginate";

test("should have correct exports", () => {
	expect(lib.get).toBe(get);
	expect(lib.mapToAsyncPaginate).toBe(mapToAsyncPaginate);
});
