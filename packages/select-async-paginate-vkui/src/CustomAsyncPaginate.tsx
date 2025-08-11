import {
	CustomSelect,
	type CustomSelectOptionInterface,
	type SelectProps,
} from "@vkontakte/vkui";
import { useCallback, useEffect, useMemo, useRef } from "react";
import type { Params } from "select-async-paginate-model";
import {
	type ShouldLoadMore,
	useSelectAsyncPaginate,
	useWatchMenu,
} from "use-select-async-paginate";

const defaultCacheUniqs: unknown[] = [];

type CustomAsyncPaginateProps<
	Option extends CustomSelectOptionInterface,
	Additional,
> = Omit<SelectProps<Option>, "options"> &
	Params<Option, Additional> & {
		valueWithLabel?: Option | null;
		cacheUniqs?: readonly unknown[];
		shouldLoadMore?: ShouldLoadMore;
	};

export function CustomAsyncPaginate<
	Option extends CustomSelectOptionInterface,
	Additional,
>({
	additional,
	autoload,
	clearCacheOnMenuClose,
	clearCacheOnSearchChange,
	debounceTimeout,
	initialAdditional,
	initialInputValue,
	initialMenuIsOpen,
	initialOptions,
	loadOptionsOnMenuOpen,
	reduceOptions,
	loadOptions,
	reloadOnErrorTimeout,
	cacheUniqs = defaultCacheUniqs,
	shouldLoadMore,
	value: valueProp,
	valueWithLabel,
	...rest
}: CustomAsyncPaginateProps<Option, Additional>) {
	const [currentCache, model] = useSelectAsyncPaginate(
		{
			additional,
			autoload,
			clearCacheOnMenuClose,
			clearCacheOnSearchChange,
			debounceTimeout,
			initialAdditional,
			initialInputValue,
			initialMenuIsOpen,
			initialOptions,
			loadOptionsOnMenuOpen,
			reduceOptions,
			loadOptions,
		},
		cacheUniqs,
	);

	const menuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		let timeout: number | null = null;

		const handle = () => {
			menuRef.current = document.querySelector(".vkuiCustomScrollView__host");

			timeout = setTimeout(handle, 100) as unknown as number;
		};

		timeout = setTimeout(handle, 100) as unknown as number;

		return () => {
			if (timeout !== null) {
				clearTimeout(timeout);
			}
		};
	}, []);

	const handleScrolledToBottom = useCallback(() => {
		model.handleLoadMore();
	}, [model]);

	useWatchMenu({
		menuRef,
		shouldLoadMore,
		handleScrolledToBottom,
	});

	const value = useMemo(() => {
		if (typeof valueWithLabel === "undefined") {
			return valueProp;
		}

		return valueWithLabel?.value;
	}, [valueProp, valueWithLabel]);

	const { isLoading, options } = currentCache;

	/**
	 * Add selected option to option list to show label of selected value
	 */
	const allOptions = useMemo(() => {
		if (valueWithLabel) {
			const hasSelectedOption = options.some(
				(option) => option.value === valueWithLabel.value,
			);

			if (hasSelectedOption) {
				return options as Option[];
			}

			return [...options, valueWithLabel];
		}

		return options as Option[];
	}, [options, valueWithLabel]);

	return (
		<CustomSelect
			searchable
			{...rest}
			value={value}
			filterFn={rest.filterFn || false}
			options={allOptions}
			fetching={(isLoading && options.length === 0) || rest.fetching}
			onInputChange={(e) => {
				model.onChangeInputValue(e.target.value);
			}}
			onClose={() => {
				model.onToggleMenu(false);
			}}
			onOpen={() => {
				model.onToggleMenu(true);
			}}
		/>
	);
}
