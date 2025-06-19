import type { ActionType } from "./actions";
import {
	ON_LOAD_SUCCESS,
	RESET,
	SET_INPUT_VALUE,
	SET_LOADING,
	SET_MENU_IS_OPEN,
	UNSET_LOADING,
} from "./actionTypes";
import { onLoadSuccess } from "./stateMappers/onLoadSuccess";
import { reset } from "./stateMappers/reset";
import { setInputValue } from "./stateMappers/setInputValue";
import { setLoading } from "./stateMappers/setLoading";
import { setMenuIsOpen } from "./stateMappers/setMenuIsOpen";
import { unsetLoading } from "./stateMappers/unsetLoading";
import type { State } from "./types/internal";
import type { Params } from "./types/public";

export function createReducer<OptionType, Additional>(
	params: Params<OptionType, Additional>,
	initialState: State<OptionType, Additional>,
) {
	return (
		stateArg: State<OptionType, Additional> | undefined,
		action: ActionType<OptionType, Additional>,
	): State<OptionType, Additional> => {
		const state = stateArg || initialState;

		switch (action.type) {
			case ON_LOAD_SUCCESS:
				return onLoadSuccess(state, params, action.payload);

			case RESET:
				return reset(state);

			case SET_INPUT_VALUE:
				return setInputValue(state, action.payload);

			case SET_LOADING:
				return setLoading(state, params, action.payload);

			case SET_MENU_IS_OPEN:
				return setMenuIsOpen(state, action.payload);

			case UNSET_LOADING:
				return unsetLoading(state, action.payload);

			default:
				return state;
		}
	};
}
