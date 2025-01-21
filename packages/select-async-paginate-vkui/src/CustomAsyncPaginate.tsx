import {
	CustomSelect,
	type CustomSelectOptionInterface,
	type SelectProps,
} from "@vkontakte/vkui";
import { useCallback, useEffect, useRef } from "react";
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
		cacheUniqs?: readonly unknown[];
		shouldLoadMore?: ShouldLoadMore;
	};

export function CustomAsyncPaginate<
	Option extends CustomSelectOptionInterface,
	Additional,
>({
	additional,
	autoload,
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
	...rest
}: CustomAsyncPaginateProps<Option, Additional>) {
	const [currentCache, model] = useSelectAsyncPaginate(
		{
			additional,
			autoload,
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

	const { isLoading, options } = currentCache;

	return (
		<CustomSelect
			searchable
			{...rest}
			options={options as Option[]}
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
