import type { OptionsCache } from "./types/internal";
import type { Params } from "./types/public";

export const getInitialOptionsCache = <OptionType, Additional>({
	initialOptions,
	initialAdditional,
}: Params<OptionType, Additional>): OptionsCache<OptionType, Additional> => {
	if (initialOptions) {
		return {
			"": {
				isFirstLoad: false,
				isLoading: false,
				options: initialOptions,
				hasMore: true,
				additional: initialAdditional,
			},
		};
	}

	return {};
};
