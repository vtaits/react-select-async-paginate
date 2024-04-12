import { getInitialOptionsCache } from "./getInitialOptionsCache";

import type { State } from "./types/internal";
import type { Params } from "./types/public";

export const getInitialState = <OptionType, Additional>(
	params: Params<OptionType, Additional>,
): State<OptionType, Additional> => {
	const { initialInputValue = "", initialMenuIsOpen = false } = params;

	return {
		cache: getInitialOptionsCache(params),
		inputValue: initialInputValue,
		menuIsOpen: initialMenuIsOpen,
	};
};
