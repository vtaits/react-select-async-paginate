import { setInputValue as setInputValueAction } from "../actions";
import type { State } from "../types/internal";
import { RequestOptionsCaller } from "../types/internal";
import type { Params } from "../types/public";
import type { Dispatch } from "../types/thunkHelpers";
import { requestOptions } from "./requestOptions";

export const setInputValue =
	<OptionType, Additional>(inputValue: string) =>
	(
		dispatch: Dispatch<OptionType, Additional>,
		getState: () => State<OptionType, Additional>,
		getParams: () => Params<OptionType, Additional>,
	) => {
		const { clearCacheOnSearchChange = false } = getParams();

		dispatch(setInputValueAction(inputValue, clearCacheOnSearchChange));

		const { cache, menuIsOpen } = getState();

		const currentCache = cache[inputValue];

		if (menuIsOpen && !currentCache) {
			dispatch(requestOptions(RequestOptionsCaller.InputChange));
		}
	};
