import type { State } from "../types/internal";

export const unsetLoading = <OptionType, Additional>(
	prevState: State<OptionType, Additional>,
	{
		inputValue,
		isClean,
		lockedUntil,
	}: {
		inputValue: string;
		isClean: boolean;
		lockedUntil: number;
	},
): State<OptionType, Additional> => {
	const prevCache = prevState.cache[inputValue];

	if (!prevCache) {
		return prevState;
	}

	if (isClean) {
		const { [inputValue]: _itemForDelete, ...restCache } = prevState.cache;

		return {
			...prevState,
			cache: restCache,
		};
	}

	return {
		...prevState,

		cache: {
			...prevState.cache,
			[inputValue]: {
				...prevCache,
				isLoading: false,
				lockedUntil,
			},
		},
	};
};
