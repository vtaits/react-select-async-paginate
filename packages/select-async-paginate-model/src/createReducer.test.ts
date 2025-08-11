import { beforeEach, describe, expect, test, vi } from "vitest";
import type { ActionType } from "./actions";
import {
	ON_LOAD_SUCCESS,
	RESET,
	SET_INPUT_VALUE,
	SET_LOADING,
	SET_MENU_IS_OPEN,
	UNSET_LOADING,
} from "./actionTypes";
import { createReducer } from "./createReducer";
import { onLoadSuccess } from "./stateMappers/onLoadSuccess";
import { reset } from "./stateMappers/reset";
import { setInputValue } from "./stateMappers/setInputValue";
import { setLoading } from "./stateMappers/setLoading";
import { setMenuIsOpen } from "./stateMappers/setMenuIsOpen";
import { unsetLoading } from "./stateMappers/unsetLoading";
import type { State } from "./types/internal";
import type { Params } from "./types/public";

vi.mock("./stateMappers/onLoadSuccess");
vi.mock("./stateMappers/setInputValue");
vi.mock("./stateMappers/setLoading");
vi.mock("./stateMappers/unsetLoading");
vi.mock("./stateMappers/setMenuIsOpen");
vi.mock("./stateMappers/reset");

const mockedOnLoadSuccess = vi.mocked(onLoadSuccess);
const mockedReset = vi.mocked(reset);
const mockedSetInputValue = vi.mocked(setInputValue);
const mockedSetLoading = vi.mocked(setLoading);
const mockedSetMenuIsOpen = vi.mocked(setMenuIsOpen);
const mockedUnsetLoading = vi.mocked(unsetLoading);

const initialState: State<unknown, unknown> = {
	cache: {
		initial: {
			hasMore: true,
			isFirstLoad: false,
			isLoading: false,
			options: [],
			additional: null,
			lockedUntil: 0,
		},
	},
	inputValue: "initial",
	menuIsOpen: true,
	optionsDict: {},
};

const currentState: State<unknown, unknown> = {
	cache: {
		current: {
			hasMore: true,
			isFirstLoad: false,
			isLoading: false,
			options: [1, 2, 3],
			additional: "not_null",
			lockedUntil: 0,
		},
	},
	inputValue: "current",
	menuIsOpen: true,
	optionsDict: {},
};

const nextState: State<unknown, unknown> = {
	cache: {
		next: {
			hasMore: true,
			isFirstLoad: false,
			isLoading: false,
			options: [1, 2, 3],
			additional: "not_null",
			lockedUntil: 0,
		},
	},
	inputValue: "next",
	menuIsOpen: true,
	optionsDict: {},
};

const params: Params<unknown, unknown> = {
	loadOptions: vi.fn(),
};

const reducer = createReducer(params, initialState);

beforeEach(() => {
	vi.resetAllMocks();
});

describe.each([
	{
		prevState: undefined,
		providedPrevState: initialState,
		testGroupName: "Initial state",
	},

	{
		prevState: currentState,
		providedPrevState: currentState,
		testGroupName: "Setted state",
	},
])("$testGroupName", ({ prevState, providedPrevState }) => {
	test("ON_LOAD_SUCCESS", () => {
		mockedOnLoadSuccess.mockReturnValue(nextState);

		const result = reducer(prevState, {
			type: ON_LOAD_SUCCESS,
			payload: {
				inputValue: "test",
				response: {
					options: [1, 2, 3],
				},
				optionsDict: {},
			},
		});

		expect(mockedOnLoadSuccess).toHaveBeenCalledTimes(1);
		expect(mockedOnLoadSuccess).toHaveBeenCalledWith(
			providedPrevState,
			params,
			{
				inputValue: "test",
				response: {
					options: [1, 2, 3],
				},
				optionsDict: {},
			},
		);

		expect(result).toBe(nextState);
	});

	test("RESET", () => {
		mockedReset.mockReturnValue(nextState);

		const result = reducer(prevState, {
			type: RESET,
		});

		expect(mockedReset).toHaveBeenCalledTimes(1);
		expect(mockedReset).toHaveBeenCalledWith(providedPrevState);

		expect(result).toBe(nextState);
	});

	test("SET_INPUT_VALUE", () => {
		mockedSetInputValue.mockReturnValue(nextState);

		const result = reducer(prevState, {
			type: SET_INPUT_VALUE,
			payload: {
				inputValue: "test",
				clearCacheOnSearchChange: false,
			},
		});

		expect(mockedSetInputValue).toHaveBeenCalledTimes(1);
		expect(mockedSetInputValue).toHaveBeenCalledWith(providedPrevState, {
			clearCacheOnSearchChange: false,
			inputValue: "test",
		});

		expect(result).toBe(nextState);
	});

	test("SET_LOADING", () => {
		mockedSetLoading.mockReturnValue(nextState);

		const result = reducer(prevState, {
			type: SET_LOADING,
			payload: {
				inputValue: "test",
			},
		});

		expect(mockedSetLoading).toHaveBeenCalledTimes(1);
		expect(mockedSetLoading).toHaveBeenCalledWith(providedPrevState, params, {
			inputValue: "test",
		});

		expect(result).toBe(nextState);
	});

	test("SET_MENU_IS_OPEN", () => {
		mockedSetMenuIsOpen.mockReturnValue(nextState);

		const result = reducer(prevState, {
			type: SET_MENU_IS_OPEN,
			payload: {
				menuIsOpen: true,
				clearCacheOnMenuClose: false,
			},
		});

		expect(mockedSetMenuIsOpen).toHaveBeenCalledTimes(1);
		expect(mockedSetMenuIsOpen).toHaveBeenCalledWith(providedPrevState, {
			menuIsOpen: true,
			clearCacheOnMenuClose: false,
		});

		expect(result).toBe(nextState);
	});

	test("UNSET_LOADING", () => {
		mockedUnsetLoading.mockReturnValue(nextState);

		const result = reducer(prevState, {
			type: UNSET_LOADING,
			payload: {
				inputValue: "test",
				isClean: true,
				lockedUntil: 0,
			},
		});

		expect(mockedUnsetLoading).toHaveBeenCalledTimes(1);
		expect(mockedUnsetLoading).toHaveBeenCalledWith(providedPrevState, {
			inputValue: "test",
			isClean: true,
			lockedUntil: 0,
		});

		expect(result).toBe(nextState);
	});

	test("should proxy unknown action", () => {
		expect(
			reducer(prevState, {
				type: "unknown",
			} as unknown as ActionType<unknown, unknown>),
		).toBe(prevState || initialState);
	});
});
