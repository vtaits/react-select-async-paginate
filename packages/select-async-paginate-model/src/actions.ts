import type { Action } from "redux";

import {
	ON_LOAD_SUCCESS,
	RESET,
	SET_INPUT_VALUE,
	SET_LOADING,
	SET_MENU_IS_OPEN,
	UNSET_LOADING,
} from "./actionTypes";

import type { Response } from "./types/public";

export type SetLoadingAction = Action<typeof SET_LOADING> & {
	payload: {
		inputValue: string;
	};
};

export const setLoading = (inputValue: string): SetLoadingAction => ({
	type: SET_LOADING,
	payload: {
		inputValue,
	},
});

export type UnsetLoadingAction = Action<typeof UNSET_LOADING> & {
	payload: {
		inputValue: string;
		/**
		 * Should remove current item of cache
		 */
		isClean: boolean;
		lockedUntil: number;
	};
};

export const unsetLoading = (
	inputValue: string,
	isClean: boolean,
	lockedUntil: number,
): UnsetLoadingAction => ({
	type: UNSET_LOADING,
	payload: {
		inputValue,
		isClean,
		lockedUntil,
	},
});

export type OnLoadSuccessAction<OptionType, Additional> = Action<
	typeof ON_LOAD_SUCCESS
> & {
	payload: {
		inputValue: string;
		response: Response<OptionType, Additional>;
	};
};

export const onLoadSuccess = <OptionType, Additional>(
	inputValue: string,
	response: Response<OptionType, Additional>,
): OnLoadSuccessAction<OptionType, Additional> => ({
	type: ON_LOAD_SUCCESS,
	payload: {
		inputValue,
		response,
	},
});

export type SetInputValueAction = Action<typeof SET_INPUT_VALUE> & {
	payload: {
		clearCacheOnSearchChange: boolean;
		inputValue: string;
	};
};

export const setInputValue = (
	inputValue: string,
	clearCacheOnSearchChange: boolean,
): SetInputValueAction => ({
	type: SET_INPUT_VALUE,
	payload: {
		clearCacheOnSearchChange,
		inputValue,
	},
});

export type SetMenuIsOpenAction = Action<typeof SET_MENU_IS_OPEN> & {
	payload: {
		clearCacheOnMenuClose: boolean;
		menuIsOpen: boolean;
	};
};

export const setMenuIsOpen = (
	menuIsOpen: boolean,
	clearCacheOnMenuClose: boolean,
): SetMenuIsOpenAction => ({
	type: SET_MENU_IS_OPEN,
	payload: {
		clearCacheOnMenuClose,
		menuIsOpen,
	},
});

export type ResetAction = Action<typeof RESET>;

export const reset = (): ResetAction => ({
	type: RESET,
});

export type ActionType<OptionType, Additional> =
	| OnLoadSuccessAction<OptionType, Additional>
	| ResetAction
	| SetInputValueAction
	| SetLoadingAction
	| SetMenuIsOpenAction
	| UnsetLoadingAction;
