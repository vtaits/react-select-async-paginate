import { setInputValue as setInputValueAction } from "../actions";
import { RequestOptionsCaller } from "../types/internal";
import type { State } from "../types/internal";
import type { Dispatch } from "../types/thunkHelpers";
import { requestOptions } from "./requestOptions";

export const setInputValue =
	<OptionType, Additional>(inputValue: string) =>
	(
		dispatch: Dispatch<OptionType, Additional>,
		getState: () => State<OptionType, Additional>,
	) => {
		dispatch(setInputValueAction(inputValue));

		const { cache, menuIsOpen } = getState();

		const currentCache = cache[inputValue];

		if (menuIsOpen && !currentCache) {
			dispatch(requestOptions(RequestOptionsCaller.InputChange));
		}
	};
