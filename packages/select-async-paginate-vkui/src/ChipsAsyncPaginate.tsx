import {
	type ChipOption,
	unstable_ChipsSelect as ChipsSelect,
} from "@vkontakte/vkui";
import type { ChipsSelectProps } from "@vkontakte/vkui/dist/components/ChipsSelect/ChipsSelect";
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

	const menuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		let timeout: number | null = null;

		const handle = () => {
			menuRef.current = document.querySelector(".vkuiCustomScrollView__box");

			model.onToggleMenu(Boolean(menuRef.current));

			timeout = setTimeout(handle, 100) as unknown as number;
		};

		timeout = setTimeout(handle, 100) as unknown as number;

		return () => {
			if (timeout !== null) {
				clearTimeout(timeout);
			}
		};
	}, [model]);

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
			filterFn={rest.filterFn || false}
			options={options as Option[]}
			fetching={(isLoading && options.length === 0) || rest.fetching}
			onInputChange={(e) => {
				model.onChangeInputValue(e?.target.value || "");
			}}
		/>
	);
}
