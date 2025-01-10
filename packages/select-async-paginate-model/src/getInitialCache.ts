import type { OptionsCacheItem, Params } from "./types/public";

export const getInitialCache = <OptionType, Additional>(
	params: Params<OptionType, Additional>,
): OptionsCacheItem<OptionType, Additional> => ({
	isFirstLoad: true,
	options: [],
	hasMore: true,
	isLoading: false,
	lockedUntil: 0,
	additional: params.additional,
});
