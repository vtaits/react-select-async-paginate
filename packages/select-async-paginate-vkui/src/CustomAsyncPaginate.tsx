import {
	CustomSelect,
	type CustomSelectOptionInterface,
	type SelectProps,
} from "@vkontakte/vkui";
import { type ReactNode, useCallback, useEffect, useMemo, useRef } from "react";
import type { Params } from "select-async-paginate-model";
import {
	type ShouldLoadMore,
	useSelectAsyncPaginate,
	useWatchMenu,
} from "use-select-async-paginate";
import { defaultRenderDropdown } from "./defaultRenderDropdown";
import type { RenderDropdownProps } from "./types";

const defaultCacheUniqs: unknown[] = [];

type CustomAsyncPaginateProps<
	Option extends CustomSelectOptionInterface,
	Additional,
> = Omit<SelectProps<Option>, "options" | "onChange" | "renderDropdown"> &
	Params<Option, Additional> & {
		valueWithLabel?: Option | null;
		cacheUniqs?: readonly unknown[];
		shouldLoadMore?: ShouldLoadMore;
		onChange?: (
			e: React.ChangeEvent<HTMLSelectElement>,
			newValue: CustomSelectOptionInterface["value"] | null,
			newOption: Option | null,
		) => void;
		renderDropdown?: (renderProps: RenderDropdownProps) => ReactNode;
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
	valueWithLabel: valueWithLabelProp,
	onChange,
	renderDropdown: renderDropdownProp = defaultRenderDropdown,
	...rest
}: CustomAsyncPaginateProps<Option, Additional>) {
	const { currentCache, inputValue, model, optionsDict } =
		useSelectAsyncPaginate(
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
				getOptionValue: (option) => String(option.value),
			},
			cacheUniqs,
		);

	const rootRef = useRef<HTMLDivElement>(null);
	const menuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		let timeout: number | null = null;

		const handle = () => {
			const inputEl = rootRef.current?.querySelector(
				".vkuiCustomSelectInput__el",
			);

			if (inputEl?.ariaControlsElements?.[0]) {
				menuRef.current = inputEl.ariaControlsElements[0].querySelector(
					".vkuiCustomScrollView__box",
				) as HTMLDivElement | null;
			} else {
				menuRef.current = null;
			}

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

	const valueWithLabel = useMemo(() => {
		if (typeof valueWithLabelProp !== "undefined") {
			return valueWithLabelProp;
		}

		if (valueProp) {
			const valueFromCache = optionsDict[String(valueProp)];

			if (valueFromCache) {
				return valueFromCache;
			}
		}

		return undefined;
	}, [valueWithLabelProp, optionsDict, valueProp]);

	const value = useMemo(() => {
		if (typeof valueWithLabel === "undefined") {
			return valueProp;
		}

		return valueWithLabel?.value;
	}, [valueProp, valueWithLabel]);

	const { isLoading, options, hasMore } = currentCache;

	const renderDropdown = useCallback(
		({ defaultDropdownContent }: { defaultDropdownContent: ReactNode }) =>
			renderDropdownProp({
				defaultDropdownContent,
				hasMore,
				inputValue,
				isLoading,
			}),
		[hasMore, isLoading, inputValue, renderDropdownProp],
	);

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

			return [valueWithLabel, ...options];
		}

		return options as Option[];
	}, [options, valueWithLabel]);

	return (
		<CustomSelect
			searchable
			{...rest}
			getRootRef={rootRef}
			value={value}
			filterFn={rest.filterFn || false}
			options={allOptions}
			fetching={(isLoading && options.length === 0) || rest.fetching}
			onChange={(e) => {
				const newValue = e.target.value;

				const newOption = newValue ? optionsDict[newValue] : null;

				onChange?.(e, newValue, newOption ?? null);
				model.onChangeInputValue("");
			}}
			onInputChange={(e) => {
				model.onChangeInputValue((e.target as HTMLInputElement).value);
			}}
			renderDropdown={renderDropdown}
		/>
	);
}
