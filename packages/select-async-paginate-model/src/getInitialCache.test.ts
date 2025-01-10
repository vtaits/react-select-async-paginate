import { expect, test } from "vitest";
import { getInitialCache } from "./getInitialCache";
import type { Params } from "./types/public";

const defaultParams: Params<unknown, unknown> = {
	loadOptions: () =>
		Promise.resolve({
			options: [],
		}),
};

test("should return initial cache", () => {
	const additional = Symbol("additional");

	const params = {
		...defaultParams,
		additional,
		defautAdditional: {
			page: 2,
		},
	};

	expect(getInitialCache(params)).toEqual({
		isFirstLoad: true,
		options: [],
		hasMore: true,
		lockedUntil: 0,
		isLoading: false,
		additional,
	});
});
