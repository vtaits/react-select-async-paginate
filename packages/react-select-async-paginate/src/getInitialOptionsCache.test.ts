import type { GroupBase } from "react-select";
import { expect, test } from "vitest";
import { getInitialOptionsCache } from "./getInitialOptionsCache";
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

test("should return empty options cache", () => {
	const initialOptionsCache = getInitialOptionsCache(defaultParams);

	expect(initialOptionsCache).toEqual({});
});

test('should return options cache with "options" prop', () => {
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
		options,
	});

	expect(initialOptionsCache).toEqual({
		"": {
			isFirstLoad: false,
			isLoading: false,
			hasMore: true,
			options,
			additional: undefined,
		},
	});
});

test('should return options cache with "defaultOptions" prop', () => {
	const options = [
		{
			label: "label 1",
			value: "value 1",
		},
	];

	const defaultOptions = [
		{
			label: "label 2",
			value: "value 2",
		},
		{
			label: "label 3",
			value: "value 3",
		},
	];

	const initialOptionsCache = getInitialOptionsCache({
		...defaultParams,
		options,
		defaultOptions,
	});

	expect(initialOptionsCache).toEqual({
		"": {
			isFirstLoad: false,
			isLoading: false,
			hasMore: true,
			options: defaultOptions,
			additional: undefined,
		},
	});
});

test('should set "additional" with "additional" param in initialOptionsCache', () => {
	const options = [
		{
			label: "label 1",
			value: "value 1",
		},
	];

	const defaultOptions = [
		{
			label: "label 2",
			value: "value 2",
		},
		{
			label: "label 3",
			value: "value 3",
		},
	];

	const initialOptionsCache = getInitialOptionsCache({
		...defaultParams,
		options,
		defaultOptions,
		additional: {
			page: 1,
		},
	});

	expect(initialOptionsCache).toEqual({
		"": {
			isFirstLoad: false,
			isLoading: false,
			hasMore: true,
			options: defaultOptions,
			additional: {
				page: 1,
			},
		},
	});
});

test('should set "additional" with "defaultAdditional" param in initialOptionsCache', () => {
	const options = [
		{
			label: "label 1",
			value: "value 1",
		},
	];

	const defaultOptions = [
		{
			label: "label 2",
			value: "value 2",
		},
		{
			label: "label 3",
			value: "value 3",
		},
	];

	const initialOptionsCache = getInitialOptionsCache({
		...defaultParams,
		options,
		defaultOptions,
		additional: {
			page: 1,
		},
		defaultAdditional: {
			page: 2,
		},
	});

	expect(initialOptionsCache).toEqual({
		"": {
			isFirstLoad: false,
			isLoading: false,
			hasMore: true,
			options: defaultOptions,
			additional: {
				page: 2,
			},
		},
	});
});

test('should not set options cache if "defaultOptions" is true', () => {
	const options = [
		{
			label: "label 1",
			value: "value 1",
		},
	];

	const initialOptionsCache = getInitialOptionsCache({
		...defaultParams,
		options,
		defaultOptions: true,
	});

	expect(initialOptionsCache).toEqual({});
});
