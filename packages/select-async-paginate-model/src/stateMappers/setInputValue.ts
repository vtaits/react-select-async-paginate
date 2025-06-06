import type { State } from "../types/internal";

export const setInputValue = <OptionType, Additional>(
	prevState: State<OptionType, Additional>,
	{
		clearCacheOnSearchChange,
		inputValue,
	}: {
		clearCacheOnSearchChange: boolean;
		inputValue: string;
	},
): State<OptionType, Additional> => ({
	...prevState,
	inputValue,

	cache: clearCacheOnSearchChange
		? {
				[inputValue]: prevState.cache[inputValue],
			}
		: prevState.cache,
});
