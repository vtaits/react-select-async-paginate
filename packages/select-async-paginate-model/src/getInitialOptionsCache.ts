import type { OptionsCache } from "./types/internal";
import type { Params } from "./types/public";

export const getInitialOptionsCache = <OptionType, Additional>({
	initialOptions,
	initialAdditional,
	getOptionValue,
}: Params<OptionType, Additional>): {
	cache: OptionsCache<OptionType, Additional>;
	optionsDict: Record<string, OptionType>;
} => {
	if (initialOptions) {
		const optionsDict: Record<string, OptionType> = {};

		if (getOptionValue) {
			for (const option of initialOptions) {
				optionsDict[getOptionValue(option)] = option;
			}
		}

		return {
			cache: {
				"": {
					isFirstLoad: false,
					isLoading: false,
					options: initialOptions,
					hasMore: true,
					lockedUntil: 0,
					additional: initialAdditional,
				},
			},
			optionsDict,
		};
	}

	return {
		cache: {},
		optionsDict: {},
	};
};
