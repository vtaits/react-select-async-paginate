import type { GroupBase } from "react-select";
import type { OptionsCacheItem, UseAsyncPaginateBaseParams } from "./types";

export const getInitialCache = <
	OptionType,
	Group extends GroupBase<OptionType>,
	Additional,
>(
	params: UseAsyncPaginateBaseParams<OptionType, Group, Additional>,
): OptionsCacheItem<OptionType, Group, Additional> => ({
	isFirstLoad: true,
	options: [],
	hasMore: true,
	isLoading: false,
	lockedUntil: 0,
	additional: params.additional,
});
