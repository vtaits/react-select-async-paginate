import type { GroupBase } from "react-select";
import { expect, test } from "vitest";
import { getInitialCache } from "./getInitialCache";
import type { UseAsyncPaginateBaseParams } from "./types";

const defaultParams: UseAsyncPaginateBaseParams<
	unknown,
	GroupBase<unknown>,
	unknown
> = {
	loadOptions: () => ({
		options: [],
	}),
	inputValue: "",
	menuIsOpen: false,
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
		isLoading: false,
		additional,
	});
});
