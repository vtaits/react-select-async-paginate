import type { ReactElement, Ref } from "react";
import type {
	GroupBase,
	InputActionMeta,
	OptionsOrGroups,
	SelectInstance,
	Props as SelectProps,
} from "react-select";
import type { FilterOptionOption } from "react-select/dist/declarations/src/filters";

export type RequestOptionsCallerType =
	| "autoload"
	| "menu-toggle"
	| "input-change"
	| "menu-scroll";

export type ReduceOptions<
	OptionType,
	Group extends GroupBase<OptionType>,
	Additional,
> = (
	prevOptions: OptionsOrGroups<OptionType, Group>,
	loadedOptions: OptionsOrGroups<OptionType, Group>,
	additional: Additional | undefined,
) => OptionsOrGroups<OptionType, Group>;

export type OptionsCacheItem<
	OptionType,
	Group extends GroupBase<OptionType>,
	Additional,
> = {
	isFirstLoad: boolean;
	isLoading: boolean;
	lockedUntil: number;
	options: OptionsOrGroups<OptionType, Group>;
	hasMore: boolean;
	additional?: Additional;
};

export type OptionsCache<
	OptionType,
	Group extends GroupBase<OptionType>,
	Additional,
> = {
	[key: string]: OptionsCacheItem<OptionType, Group, Additional>;
};

export type ShouldLoadMore = (
	scrollHeight: number,
	clientHeight: number,
	scrollTop: number,
) => boolean;

export type Response<
	OptionType,
	Group extends GroupBase<OptionType>,
	Additional,
> = {
	options: OptionsOrGroups<OptionType, Group>;
	hasMore?: boolean;
	additional?: Additional;
};

export type LoadOptions<
	OptionType,
	Group extends GroupBase<OptionType>,
	Additional,
> = (
	inputValue: string,
	options: OptionsOrGroups<OptionType, Group>,
	additional?: Additional,
) =>
	| Response<OptionType, Group, Additional>
	| Promise<Response<OptionType, Group, Additional>>;

export type FilterOption<OptionType> =
	| ((option: FilterOptionOption<OptionType>, rawInput: string) => boolean)
	| null;

export type UseAsyncPaginateBaseResult<
	OptionType,
	Group extends GroupBase<OptionType>,
> = {
	handleScrolledToBottom: () => void;
	shouldLoadMore: ShouldLoadMore;
	isLoading: boolean;
	isFirstLoad: boolean;
	options: OptionsOrGroups<OptionType, Group>;
	filterOption: FilterOption<OptionType>;
};

export type UseAsyncPaginateResult<
	OptionType,
	Group extends GroupBase<OptionType>,
> = UseAsyncPaginateBaseResult<OptionType, Group> & {
	inputValue: string;
	menuIsOpen: boolean;
	onInputChange: (inputValue: string, actionMeta: InputActionMeta) => void;
	onMenuClose: () => void;
	onMenuOpen: () => void;
};

export type UseAsyncPaginateParams<
	OptionType,
	Group extends GroupBase<OptionType>,
	Additional,
> = {
	loadOptions: LoadOptions<OptionType, Group, Additional>;
	options?: OptionsOrGroups<OptionType, Group>;
	defaultOptions?: boolean | OptionsOrGroups<OptionType, Group>;
	additional?: Additional;
	defaultAdditional?: Additional;
	loadOptionsOnMenuOpen?: boolean;
	debounceTimeout?: number;
	reduceOptions?: ReduceOptions<OptionType, Group, Additional>;
	shouldLoadMore?: ShouldLoadMore;
	filterOption?: FilterOption<OptionType>;
	inputValue?: string;
	menuIsOpen?: boolean;
	defaultInputValue?: string;
	defaultMenuIsOpen?: boolean;
	/**
	 * Post-mapping of loaded options to display them in the menu
	 * @param options loaded options
	 * @returns options to display in the menu
	 */
	mapOptionsForMenu?: (
		options: OptionsOrGroups<OptionType, Group>,
	) => OptionsOrGroups<OptionType, Group>;
	onInputChange?: (newValue: string, actionMeta: InputActionMeta) => void;
	onMenuClose?: () => void;
	onMenuOpen?: () => void;
	reloadOnErrorTimeout?: number;
};

export type UseAsyncPaginateBaseParams<
	OptionType,
	Group extends GroupBase<OptionType>,
	Additional,
> = UseAsyncPaginateParams<OptionType, Group, Additional> & {
	inputValue: string;
	menuIsOpen: boolean;
};

export type ComponentProps<
	OptionType,
	Group extends GroupBase<OptionType>,
	IsMulti extends boolean,
> = {
	selectRef?: Ref<SelectInstance<OptionType, IsMulti, Group>>;
	cacheUniqs?: ReadonlyArray<unknown>;
};

export type AsyncPaginateProps<
	OptionType,
	Group extends GroupBase<OptionType>,
	Additional,
	IsMulti extends boolean,
> = SelectProps<OptionType, IsMulti, Group> &
	UseAsyncPaginateParams<OptionType, Group, Additional> &
	ComponentProps<OptionType, Group, IsMulti>;

export type WithAsyncPaginateType = <
	OptionType,
	Group extends GroupBase<OptionType>,
	Additional,
	IsMulti extends boolean = false,
>(
	props: AsyncPaginateProps<OptionType, Group, Additional, IsMulti>,
) => ReactElement;
