import {
	CustomSelect,
	type CustomSelectOptionInterface,
	type SelectProps,
} from "@vkontakte/vkui";
import type { Params } from "select-async-paginate-model";
import { useSelectAsyncPaginate } from "use-select-async-paginate";

const defaultCacheUniqs: unknown[] = [];

type CustomAsyncPaginateProps<
	Option extends CustomSelectOptionInterface,
	Additional,
> = Omit<SelectProps<Option>, "options"> &
	Params<Option, Additional> & {
		cacheUniqs?: readonly unknown[];
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

	const { isLoading, options } = currentCache;

	return (
		<CustomSelect
			searchable
			{...rest}
			options={options as Option[]}
			fetching={isLoading || rest.fetching}
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
