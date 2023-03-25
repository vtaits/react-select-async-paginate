export const defaultReduceOptions = <OptionType>(
  prevOptions: readonly OptionType[],
  loadedOptions: readonly OptionType[],
) => [...prevOptions, ...loadedOptions];
