import { beforeEach, expect, test, vi } from "vitest";
import {
	type SetMenuIsOpenAction,
	setMenuIsOpen as setMenuIsOpenAction,
} from "../actions";
import { SET_MENU_IS_OPEN } from "../actionTypes";
import { RequestOptionsCaller } from "../types/internal";
import { requestOptions } from "./requestOptions";
import { setMenuIsOpen } from "./setMenuIsOpen";

vi.mock("../actions");
const mockedSetMenuIsOpenAction = vi.mocked(setMenuIsOpenAction);

vi.mock("./requestOptions");
const mockedRequestOptions = vi.mocked(requestOptions);

beforeEach(() => {
	vi.clearAllMocks();
});

const action: SetMenuIsOpenAction = {
	type: SET_MENU_IS_OPEN,
	payload: {
		menuIsOpen: true,
		clearCacheOnMenuClose: false,
	},
};

mockedSetMenuIsOpenAction.mockReturnValue(action);

test("should not load options if menu is closed", () => {
	const setMenuIsOpenThunkAction = setMenuIsOpen(false);

	const dispatch = vi.fn();

	setMenuIsOpenThunkAction(
		dispatch,
		vi.fn().mockReturnValue({
			cache: {},
			inputValue: "",
			menuIsOpen: true,
		}),
		vi.fn().mockReturnValue({}),
	);

	expect(mockedSetMenuIsOpenAction).toHaveBeenCalledTimes(1);
	expect(mockedSetMenuIsOpenAction).toHaveBeenCalledWith(false, false);

	expect(mockedRequestOptions).toHaveBeenCalledTimes(0);

	expect(dispatch).toHaveBeenCalledTimes(1);
	expect(dispatch).toHaveBeenCalledWith(action);
});

test("should not load options if cache for input value is not empty", () => {
	const setMenuIsOpenThunkAction = setMenuIsOpen(true);

	const dispatch = vi.fn();

	setMenuIsOpenThunkAction(
		dispatch,
		vi.fn().mockReturnValue({
			cache: {
				test: {
					isFirstLoad: false,
					isLoading: false,
					hasMore: true,
					options: [],
					additional: undefined,
				},
			},
			inputValue: "test",
			menuIsOpen: true,
		}),
		vi.fn().mockReturnValue({}),
	);

	expect(mockedSetMenuIsOpenAction).toHaveBeenCalledTimes(1);
	expect(mockedSetMenuIsOpenAction).toHaveBeenCalledWith(true, false);

	expect(mockedRequestOptions).toHaveBeenCalledTimes(0);

	expect(dispatch).toHaveBeenCalledTimes(1);
	expect(dispatch).toHaveBeenCalledWith(action);
});

test("should not load options if `loadOptionsOnMenuOpen` is false", () => {
	const setMenuIsOpenThunkAction = setMenuIsOpen(true);

	const dispatch = vi.fn();

	setMenuIsOpenThunkAction(
		dispatch,
		vi.fn().mockReturnValue({
			cache: {},
			inputValue: "",
			menuIsOpen: true,
		}),
		vi.fn().mockReturnValue({
			loadOptionsOnMenuOpen: false,
		}),
	);

	expect(mockedSetMenuIsOpenAction).toHaveBeenCalledTimes(1);
	expect(mockedSetMenuIsOpenAction).toHaveBeenCalledWith(true, false);

	expect(mockedRequestOptions).toHaveBeenCalledTimes(0);

	expect(dispatch).toHaveBeenCalledTimes(1);
	expect(dispatch).toHaveBeenCalledWith(action);
});

test("should load options", () => {
	const requestOptionsThunkAction = vi.fn();
	mockedRequestOptions.mockReturnValue(requestOptionsThunkAction);

	const setMenuIsOpenThunkAction = setMenuIsOpen(true);

	const dispatch = vi.fn();

	setMenuIsOpenThunkAction(
		dispatch,
		vi.fn().mockReturnValue({
			cache: {},
			inputValue: "",
			menuIsOpen: true,
		}),
		vi.fn().mockReturnValue({}),
	);

	expect(mockedSetMenuIsOpenAction).toHaveBeenCalledTimes(1);
	expect(mockedSetMenuIsOpenAction).toHaveBeenCalledWith(true, false);

	expect(mockedRequestOptions).toHaveBeenCalledTimes(1);
	expect(mockedRequestOptions).toHaveBeenCalledWith(
		RequestOptionsCaller.MenuToggle,
	);

	expect(dispatch).toHaveBeenCalledTimes(2);
	expect(dispatch).toHaveBeenNthCalledWith(1, action);
	expect(dispatch).toHaveBeenNthCalledWith(2, requestOptionsThunkAction);
});
