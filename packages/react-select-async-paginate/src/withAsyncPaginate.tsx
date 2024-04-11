import type { ReactElement, Ref } from "react";
import type {
	GroupBase,
	SelectInstance,
	Props as SelectProps,
} from "react-select";
import type {
	AsyncPaginateProps,
	UseAsyncPaginateResult,
	WithAsyncPaginateType,
} from "./types";
import { useAsyncPaginate } from "./useAsyncPaginate";
import { useComponents } from "./useComponents";

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
				isLoading={isLoading}
				components={processedComponents}
				ref={selectRef}
			/>
		);
	}

	return WithAsyncPaginate;
}
