import { expect, test } from "vitest";
import { getInitialOptionsCache } from "./getInitialOptionsCache";
import type { Params } from "./types/public";

const defaultParams: Params<unknown, unknown> = {
	loadOptions: () =>
		Promise.resolve({
			options: [],
		}),
};

test("should return empty options cache", () => {
	const initialOptionsCache = getInitialOptionsCache(defaultParams);

	expect(initialOptionsCache).toEqual({
		cache: {},
		optionsDict: {},
	});
});

test('should return options cache with "initialOptions" param', () => {
	const options = [
		{
			label: "label 1",
			value: "value 1",
		},
		{
			label: "label 2",
			value: "value 2",
		},
	];

	const initialOptionsCache = getInitialOptionsCache({
		...defaultParams,
		initialOptions: options,
	});

	expect(initialOptionsCache).toEqual({
		cache: {
			"": {
				isFirstLoad: false,
				isLoading: false,
				hasMore: true,
				options,
				additional: undefined,
				lockedUntil: 0,
			},
		},
		optionsDict: {},
	});
});

test('should set "additional" with "initialAdditional" param in initialOptionsCache', () => {
	const options = [
		{
			label: "label 1",
			value: "value 1",
		},
	];

	const initialOptionsCache = getInitialOptionsCache({
		...defaultParams,
		initialOptions: options,
		initialAdditional: {
			page: 2,
		},
	});

	expect(initialOptionsCache).toEqual({
		cache: {
			"": {
				isFirstLoad: false,
				isLoading: false,
				hasMore: true,
				options,
				additional: {
					page: 2,
				},
				lockedUntil: 0,
			},
		},
		optionsDict: {},
	});
});
