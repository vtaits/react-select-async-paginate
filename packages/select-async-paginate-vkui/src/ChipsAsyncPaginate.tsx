import {
	type ChipOption,
	ChipsSelect,
	type ChipsSelectProps,
} from "@vkontakte/vkui";
import { useCallback, useEffect, useRef } from "react";
import type { Params } from "select-async-paginate-model";
import {
	type ShouldLoadMore,
	useSelectAsyncPaginate,
	useWatchMenu,
} from "use-select-async-paginate";

const defaultCacheUniqs: unknown[] = [];

type ChipsAsyncPaginateProps<Option extends ChipOption, Additional> = Omit<
	ChipsSelectProps<Option>,
	"options"
> &
	Params<Option, Additional> & {
		cacheUniqs?: readonly unknown[];
		shouldLoadMore?: ShouldLoadMore;
	};

export function ChipsAsyncPaginate<Option extends ChipOption, Additional>({
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
	...rest
}: ChipsAsyncPaginateProps<Option, Additional>) {
	const { currentCache, model } = useSelectAsyncPaginate(
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

	const inputRef = useRef<HTMLInputElement>(null);
	const menuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		let timeout: number | null = null;

		const handle = () => {
			const inputEl = inputRef.current;

			if (inputEl?.ariaExpanded) {
				menuRef.current = document.querySelector(
					".vkuiCustomScrollView__host",
				) as HTMLDivElement | null;
			} else {
				menuRef.current = null;
			}

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
		<ChipsSelect
			{...rest}
			getRef={inputRef}
			filterFn={rest.filterFn || false}
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
