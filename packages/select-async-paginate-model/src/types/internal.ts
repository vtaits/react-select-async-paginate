import type { OptionsCacheItem } from "./public";

export enum RequestOptionsCaller {
	Autoload = 0,
	MenuToggle = 1,
	InputChange = 2,
	MenuScroll = 3,
}

/**
 * Key-value store of cached options by value of the search input
 */
export type OptionsCache<OptionType, Additional> = {
	[key: string]: OptionsCacheItem<OptionType, Additional>;
};

/**
 * Full state of the model
 */
export type State<OptionType, Additional> = {
	/**
	 * All cached options and payloads
	 */
	cache: OptionsCache<OptionType, Additional>;
	/**
	 * Current value of the search input
	 */
	inputValue: string;
	/**
	 * Current state of the menu opening
	 */
	menuIsOpen: boolean;
};
