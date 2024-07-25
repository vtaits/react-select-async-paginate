import { useCallback, useEffect } from "react";
import type { GroupBase, OptionsOrGroups } from "react-select";
import { useSelectAsyncPaginate } from "use-select-async-paginate";
import { defaultShouldLoadMore } from "./defaultShouldLoadMore";
import type {
	UseAsyncPaginateBaseParams,
	UseAsyncPaginateBaseResult,
} from "./types";

export function useAsyncPaginateBase<
	OptionType,
	Group extends GroupBase<OptionType>,
	Additional,
>(
	params: UseAsyncPaginateBaseParams<OptionType, Group, Additional>,
	deps: readonly unknown[] = [],
): UseAsyncPaginateBaseResult<OptionType, Group> {
	const {
		additional,
		defaultOptions,
		defaultAdditional,
		debounceTimeout = 0,
		filterOption = null,
		inputValue,
		loadOptions,
		loadOptionsOnMenuOpen = true,
		menuIsOpen,
		options,
		reduceOptions = undefined,
		shouldLoadMore = defaultShouldLoadMore,
	} = params;

	const [currentCache, model] = useSelectAsyncPaginate(
		{
			additional,
			autoload: defaultOptions === true,
			debounceTimeout,
			initialAdditional: defaultAdditional,
			initialInputValue: inputValue,
			initialMenuIsOpen: menuIsOpen,
			initialOptions:
				defaultOptions === true
					? undefined
					: Array.isArray(defaultOptions)
						? (defaultOptions as OptionsOrGroups<OptionType, Group>)
						: options,
			loadOptionsOnMenuOpen,
			reduceOptions,
			loadOptions,
		},
		deps,
	);

	const handleScrolledToBottom = useCallback(() => {
		model.handleLoadMore();
	}, [model]);

	useEffect(() => {
		model.onChangeInputValue(inputValue);
	}, [model, inputValue]);

	useEffect(() => {
		model.onToggleMenu(menuIsOpen);
	}, [model, menuIsOpen]);

	return {
		handleScrolledToBottom,
		shouldLoadMore,
		filterOption,
		isLoading: currentCache.isLoading,
		isFirstLoad: currentCache.isFirstLoad,
		options: currentCache.options,
	};
}
