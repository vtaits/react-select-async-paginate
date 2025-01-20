import composeRefs from "@seznam/compose-react-refs";
import {
	CustomSelect,
	type CustomSelectOptionInterface,
	type SelectProps,
} from "@vkontakte/vkui";
import { useCallback, useRef } from "react";
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

	const getRootRef = useRef<HTMLDivElement>(null);

	const handleScrolledToBottom = useCallback(() => {
		model.handleLoadMore();
	}, [model]);

	useWatchMenu({
		menuRef: getRootRef,
		shouldLoadMore,
		handleScrolledToBottom,
	});

	const { isLoading, options } = currentCache;

	return (
		<CustomSelect
			searchable
			{...rest}
			getRootRef={composeRefs(getRootRef, rest.getRootRef)}
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
