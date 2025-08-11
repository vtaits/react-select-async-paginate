import { expect, test } from "vitest";
import {
	onLoadSuccess,
	reset,
	type SetInputValueAction,
	type SetMenuIsOpenAction,
	setInputValue,
	setLoading,
	setMenuIsOpen,
	unsetLoading,
} from "./actions";
import {
	ON_LOAD_SUCCESS,
	RESET,
	SET_INPUT_VALUE,
	SET_LOADING,
	SET_MENU_IS_OPEN,
	UNSET_LOADING,
} from "./actionTypes";
import type { Response } from "./types/public";

test("onLoadSuccess", () => {
	const response: Response<number, unknown> = {
		options: [1, 2, 3],
		hasMore: true,
	};

	expect(onLoadSuccess("test", response, {})).toEqual({
		type: ON_LOAD_SUCCESS,
		payload: {
			inputValue: "test",
			response,
			optionsDict: {},
		},
	});
});

test("reset", () => {
	expect(reset()).toEqual({
		type: RESET,
	});
});

test("setInputValue", () => {
	expect(setInputValue("test", false)).toEqual({
		type: SET_INPUT_VALUE,
		payload: {
			inputValue: "test",
			clearCacheOnSearchChange: false,
		},
	} satisfies SetInputValueAction);
});

test("setLoading", () => {
	expect(setLoading("test")).toEqual({
		type: SET_LOADING,
		payload: {
			inputValue: "test",
		},
	});
});

test("setMenuIsOpen", () => {
	expect(setMenuIsOpen(true, false)).toEqual({
		type: SET_MENU_IS_OPEN,
		payload: {
			menuIsOpen: true,
			clearCacheOnMenuClose: false,
		},
	} satisfies SetMenuIsOpenAction);
});

test("unsetLoading", () => {
	expect(unsetLoading("test", true, 5)).toEqual({
		type: UNSET_LOADING,
		payload: {
			inputValue: "test",
			isClean: true,
			lockedUntil: 5,
		},
	});
});
