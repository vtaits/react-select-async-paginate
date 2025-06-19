import { beforeEach, expect, test, vi } from "vitest";
import {
	type SetInputValueAction,
	setInputValue as setInputValueAction,
} from "../actions";
import { SET_INPUT_VALUE } from "../actionTypes";
import { RequestOptionsCaller } from "../types/internal";
import { requestOptions } from "./requestOptions";
import { setInputValue } from "./setInputValue";

vi.mock("../actions");
const mockedSetInputValueAction = vi.mocked(setInputValueAction);

vi.mock("./requestOptions");
const mockedRequestOptions = vi.mocked(requestOptions);

beforeEach(() => {
	vi.clearAllMocks();
});

const setInputValueThunkAction = setInputValue("testInput");

const action: SetInputValueAction = {
	type: SET_INPUT_VALUE,
	payload: {
		inputValue: "testInput",
		clearCacheOnSearchChange: false,
	},
};

mockedSetInputValueAction.mockReturnValue(action);

const getParams = vi.fn().mockReturnValue({
	clearCacheOnSearchChange: false,
});

test("should not load options if menu is closed", () => {
	const dispatch = vi.fn();

	setInputValueThunkAction(
		dispatch,
		vi.fn().mockReturnValue({
			cache: {},
			inputValue: "",
			menuIsOpen: false,
		}),
		getParams,
	);

	expect(mockedSetInputValueAction).toHaveBeenCalledTimes(1);
	expect(mockedSetInputValueAction).toHaveBeenCalledWith("testInput", false);

	expect(mockedRequestOptions).toHaveBeenCalledTimes(0);

	expect(dispatch).toHaveBeenCalledTimes(1);
	expect(dispatch).toHaveBeenCalledWith(action);
});

test("should not load options if cache for input value is not empty", () => {
	const dispatch = vi.fn();

	setInputValueThunkAction(
		dispatch,
		vi.fn().mockReturnValue({
			cache: {
				testInput: {
					isFirstLoad: false,
					isLoading: false,
					hasMore: true,
					options: [],
					additional: undefined,
				},
			},
			inputValue: "",
			menuIsOpen: true,
		}),
		getParams,
	);

	expect(mockedSetInputValueAction).toHaveBeenCalledTimes(1);
	expect(mockedSetInputValueAction).toHaveBeenCalledWith("testInput", false);

	expect(mockedRequestOptions).toHaveBeenCalledTimes(0);

	expect(dispatch).toHaveBeenCalledTimes(1);
	expect(dispatch).toHaveBeenCalledWith(action);
});

test("should load options", () => {
	const requestOptionsThunkAction = vi.fn();
	mockedRequestOptions.mockReturnValue(requestOptionsThunkAction);

	const dispatch = vi.fn();

	setInputValueThunkAction(
		dispatch,
		vi.fn().mockReturnValue({
			cache: {},
			inputValue: "",
			menuIsOpen: true,
		}),
		getParams,
	);

	expect(mockedSetInputValueAction).toHaveBeenCalledTimes(1);
	expect(mockedSetInputValueAction).toHaveBeenCalledWith("testInput", false);

	expect(mockedRequestOptions).toHaveBeenCalledTimes(1);
	expect(mockedRequestOptions).toHaveBeenCalledWith(
		RequestOptionsCaller.InputChange,
	);

	expect(dispatch).toHaveBeenCalledTimes(2);
	expect(dispatch).toHaveBeenNthCalledWith(1, action);
	expect(dispatch).toHaveBeenNthCalledWith(2, requestOptionsThunkAction);
});
