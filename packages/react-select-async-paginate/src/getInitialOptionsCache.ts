import type { GroupBase } from "react-select";
import type { OptionsCache, UseAsyncPaginateBaseParams } from "./types";

export const getInitialOptionsCache = <
	OptionType,
	Group extends GroupBase<OptionType>,
	Additional,
>({
	options,
	defaultOptions,
	additional,
	defaultAdditional,
}: UseAsyncPaginateBaseParams<OptionType, Group, Additional>): OptionsCache<
	OptionType,
	Group,
	Additional
> => {
	const initialOptions =
		defaultOptions === true
			? null
			: Array.isArray(defaultOptions)
				? defaultOptions
				: options;

	if (initialOptions) {
		return {
			"": {
				isFirstLoad: false,
				isLoading: false,
				options: initialOptions,
				hasMore: true,
				lockedUntil: 0,
				additional: defaultAdditional || additional,
			},
		};
	}

	return {};
};
