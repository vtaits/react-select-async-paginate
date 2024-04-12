/**
 * Default merge function. Adds new options to the end
 * @param prevOptions Cached options from previous requests
 * @param loadedOptions Page of loaded options
 * @returns Concatenated array of options
 */
export const defaultReduceOptions = <OptionType>(
	prevOptions: readonly OptionType[],
	loadedOptions: readonly OptionType[],
) => [...prevOptions, ...loadedOptions];
