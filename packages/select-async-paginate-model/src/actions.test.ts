import { expect, test } from "vitest";
import {
	ON_LOAD_SUCCESS,
	RESET,
	SET_INPUT_VALUE,
	SET_LOADING,
	SET_MENU_IS_OPEN,
	UNSET_LOADING,
} from "./actionTypes";
import {
	onLoadSuccess,
	reset,
	setInputValue,
	setLoading,
	setMenuIsOpen,
	unsetLoading,
} from "./actions";
import type { Response } from "./types/public";

test("onLoadSuccess", () => {
	const response: Response<number, unknown> = {
		options: [1, 2, 3],
		hasMore: true,
	};

	expect(onLoadSuccess("test", response)).toEqual({
		type: ON_LOAD_SUCCESS,
		payload: {
			inputValue: "test",
			response,
		},
	});
});

test("reset", () => {
	expect(reset()).toEqual({
		type: RESET,
	});
});

test("setInputValue", () => {
	expect(setInputValue("test")).toEqual({
		type: SET_INPUT_VALUE,
		payload: {
			inputValue: "test",
		},
	});
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
	expect(setMenuIsOpen(true)).toEqual({
		type: SET_MENU_IS_OPEN,
		payload: {
			menuIsOpen: true,
		},
	});
});

test("unsetLoading", () => {
	expect(unsetLoading("test", true)).toEqual({
		type: UNSET_LOADING,
		payload: {
			inputValue: "test",
			isClean: true,
		},
	});
});
