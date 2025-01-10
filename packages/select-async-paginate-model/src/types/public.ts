import type { Unsubscribe } from "redux";

/**
 * Result of calling `loadOptions`
 */
export type Response<OptionType, Additional> = {
	/**
	 * Next page of options
	 */
	options: readonly OptionType[];
	/**
	 * Is there a next page of options that should be requested
	 */
	hasMore?: boolean;
	/**
	 * Additional payload (page number, request time, etc)
	 */
	additional?: Additional;
};

/**
 * Function that loads the next page of options
 */
export type LoadOptions<OptionType, Additional> = (
	/**
	 * Current value of the input
	 */
	inputValue: string,
	/**
	 * List of options that were loaded before for current input
	 */
	options: readonly OptionType[],
	/**
	 * Collected additional data e.g. current page number etc.
	 * For first load it is `additional` from params,
	 * for next is `additional` from previous response for current search.
	 * `undefined` by default.
	 */
	additional?: Additional,
) => Promise<Response<OptionType, Additional>>;

/**
 * Function that merges the old options with the new page of options
 */
export type ReduceOptions<OptionType, Additional> = (
	/**
	 * Cached options from previous requests
	 */
	prevOptions: readonly OptionType[],
	/**
	 * Page of loaded options
	 */
	loadedOptions: readonly OptionType[],
	/**
	 * Loaded additional payload
	 */
	additional: Additional | undefined,
) => readonly OptionType[];

/**
 * Parameters of the model
 */
export type Params<OptionType, Additional> = {
	/**
	 * Initial `additional` parameter of new cached options for each value of search input
	 */
	additional?: Additional;
	/**
	 * Request first page of options on init
	 * `false` by default
	 */
	autoload?: boolean;
	/**
	 * `Debounce timeout for requests after changing value of the search input`
	 */
	debounceTimeout?: number;
	/**
	 * Initial `additional` parameter of cached options for empty value of the search input
	 */
	initialAdditional?: Additional;
	/**
	 * Initial value of the search input
	 * `''` by default
	 */
	initialInputValue?: string;
	/**
	 * Is menu open on init
	 * `false` by default
	 */
	initialMenuIsOpen?: boolean;
	/**
	 * Initial list of cached options for empty value of the search input
	 */
	initialOptions?: readonly OptionType[];
	/**
	 * Load first page of options after call `model.onToggleMenu(true)`
	 * `true` by default
	 */
	loadOptionsOnMenuOpen?: boolean;
	/**
	 * Function that merges the old options with the new page of options
	 */
	reduceOptions?: ReduceOptions<OptionType, Additional>;
	/**
	 * Loader of the next page of options
	 */
	loadOptions: LoadOptions<OptionType, Additional>;
	/**
	 * Time in milliseconds to retry a request after an error
	 */
	reloadOnErrorTimeout?: number;
};

/**
 * Cached options and payload for one value of the search input
 */
export type OptionsCacheItem<OptionType, Additional> = {
	/**
	 * Is the first page of options will be requested
	 */
	isFirstLoad: boolean;
	/**
	 * Is options loading
	 */
	isLoading: boolean;
	/**
	 * Timestamp until which loading of options is blocked
	 */
	lockedUntil: number;
	/**
	 * List of cached options
	 */
	options: readonly OptionType[];
	/**
	 * Is there a next page of options
	 */
	hasMore: boolean;
	/**
	 * Additional payload
	 */
	additional?: Additional;
};

/**
 * Model of asyncronous select that supports pagination on menu scroll
 */
export type Model<OptionType, Additional> = {
	/**
	 * @returns Cached options and payload for current value of the search input
	 */
	getCurrentCache: () => OptionsCacheItem<OptionType, Additional>;
	/**
	 * Load the next page of options for current value of search input
	 */
	handleLoadMore: () => void;
	/**
	 * Reset all cached options. Then load the first page if `autoload` is `true`
	 */
	handleReset: () => void;
	/**
	 * Handling change of the value of search input
	 * @param inputValue next value of the input
	 */
	onChangeInputValue: (inputValue: string) => void;
	/**
	 * Handling menu opening or closing
	 * @param menuIsOpen menu is open
	 */
	onToggleMenu: (menuIsOpen: boolean) => void;
	/**
	 * Subscribe to changes of the model
	 * @param listener callback
	 * @returns unsubscribe function
	 */
	subscribe: (listener: () => void) => Unsubscribe;
	/**
	 * Update parameters of the model
	 * @param nextParams updated parameters
	 */
	updateParams: (nextParams: Params<OptionType, Additional>) => void;
};
