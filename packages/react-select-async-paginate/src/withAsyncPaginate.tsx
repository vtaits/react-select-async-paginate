import type { ReactElement, Ref } from "react";
import type {
	GroupBase,
	SelectInstance,
	Props as SelectProps,
} from "react-select";
import { useComponents } from "./components/useComponents";
import type {
	AsyncPaginateProps,
	UseAsyncPaginateResult,
	WithAsyncPaginateType,
} from "./types";
import { useAsyncPaginate } from "./useAsyncPaginate";

const defaultCacheUniqs: unknown[] = [];
const defaultComponents = {};

type SelectComponentType = <
	Option = unknown,
	IsMulti extends boolean = boolean,
	Group extends GroupBase<Option> = GroupBase<Option>,
>(
	props: SelectProps<Option, IsMulti, Group> & {
		ref?: Ref<SelectInstance<Option, IsMulti, Group>>;
	},
) => ReactElement;

export function withAsyncPaginate(
	SelectComponent: SelectComponentType,
): WithAsyncPaginateType {
	function WithAsyncPaginate<
		OptionType,
		Group extends GroupBase<OptionType>,
		Additional,
		IsMulti extends boolean = false,
	>(
		props: AsyncPaginateProps<OptionType, Group, Additional, IsMulti>,
	): ReactElement {
		const {
			components = defaultComponents,
			selectRef = undefined,
			isLoading: isLoadingProp,
			cacheUniqs = defaultCacheUniqs,
			menuPlacement,
			menuShouldScrollIntoView,
			...rest
		} = props;

		const asyncPaginateProps: UseAsyncPaginateResult<OptionType, Group> =
			useAsyncPaginate(rest, cacheUniqs);

		const processedComponents = useComponents<OptionType, Group, IsMulti>(
			components,
		);

		const isLoading =
			typeof isLoadingProp === "boolean"
				? isLoadingProp
				: asyncPaginateProps.isLoading;

		return (
			<SelectComponent
				{...props}
				{...asyncPaginateProps}
				menuPlacement={menuPlacement}
				// Recount menu position on load options
				menuShouldScrollIntoView={
					menuPlacement === "auto"
						? isLoading
							? false
							: menuShouldScrollIntoView
						: menuShouldScrollIntoView
				}
				isLoading={isLoading}
				components={processedComponents}
				ref={selectRef}
			/>
		);
	}

	return WithAsyncPaginate;
}
