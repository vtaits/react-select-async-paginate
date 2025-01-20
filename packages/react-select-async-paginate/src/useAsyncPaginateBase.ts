import { useCallback, useEffect, useMemo } from "react";
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
		initialAdditional,
		debounceTimeout = 0,
		filterOption = null,
		inputValue,
		loadOptions,
		loadOptionsOnMenuOpen = true,
		menuIsOpen,
		options: optionsParam,
		reduceOptions = undefined,
		shouldLoadMore = defaultShouldLoadMore,
		mapOptionsForMenu = undefined,
	} = params;

	const [currentCache, model] = useSelectAsyncPaginate(
		{
			additional,
			autoload: defaultOptions === true,
			debounceTimeout,
			initialAdditional: initialAdditional,
			initialInputValue: inputValue,
			initialMenuIsOpen: menuIsOpen,
			initialOptions:
				defaultOptions === true
					? undefined
					: Array.isArray(defaultOptions)
						? (defaultOptions as OptionsOrGroups<OptionType, Group>)
						: optionsParam,
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

	const options = useMemo(() => {
		if (!mapOptionsForMenu) {
			return currentCache.options;
		}

		return mapOptionsForMenu(currentCache.options);
	}, [currentCache.options, mapOptionsForMenu]);

	return {
		handleScrolledToBottom,
		shouldLoadMore,
		filterOption,
		isLoading: currentCache.isLoading || currentCache.lockedUntil > Date.now(),
		isFirstLoad: currentCache.isFirstLoad,
		options,
	};
}
