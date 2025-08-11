import { defaultReduceOptions } from "../defaultReduceOptions";

import type { State } from "../types/internal";
import type { Params, Response } from "../types/public";

export const onLoadSuccess = <OptionType, Additional>(
	prevState: State<OptionType, Additional>,
	params: Params<OptionType, Additional>,
	{
		inputValue,
		response,
		optionsDict,
	}: {
		inputValue: string;
		response: Response<OptionType, Additional>;
		optionsDict: Record<string, OptionType>;
	},
): State<OptionType, Additional> => {
	const prevCache = prevState.cache[inputValue];

	if (!prevCache) {
		// Cache has cleared
		return prevState;
	}

	const { reduceOptions = defaultReduceOptions } = params;

	const { options, hasMore } = response;

	const nextAdditional = Object.hasOwn(response, "additional")
		? response.additional
		: prevCache.additional;

	return {
		...prevState,
		cache: {
			...prevState.cache,
			[inputValue]: {
				...prevCache,
				options: reduceOptions(prevCache.options, options, nextAdditional),
				hasMore: !!hasMore,
				isLoading: false,
				isFirstLoad: false,
				additional: nextAdditional,
			},
		},
		optionsDict: {
			...prevState.optionsDict,
			...optionsDict,
		},
	};
};
