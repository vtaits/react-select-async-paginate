import { expect, test } from "vitest";
import { createAsyncPaginateModel } from "./createAsyncPaginateModel";
import * as lib from "./index";
import { checkIsResponse, validateResponse } from "./validateResponse";

test("should have correct exports", () => {
	expect(lib.checkIsResponse).toBe(checkIsResponse);
	expect(lib.createAsyncPaginateModel).toBe(createAsyncPaginateModel);
	expect(lib.validateResponse).toBe(validateResponse);
});
