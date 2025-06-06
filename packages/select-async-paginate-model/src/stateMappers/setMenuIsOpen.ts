import type { State } from "../types/internal";

export const setMenuIsOpen = <OptionType, Additional>(
	prevState: State<OptionType, Additional>,
	{
		clearCacheOnMenuClose,
		menuIsOpen,
	}: {
		clearCacheOnMenuClose: boolean;
		menuIsOpen: boolean;
	},
): State<OptionType, Additional> => ({
	...prevState,
	menuIsOpen,

	cache: !menuIsOpen && clearCacheOnMenuClose ? {} : prevState.cache,
});
