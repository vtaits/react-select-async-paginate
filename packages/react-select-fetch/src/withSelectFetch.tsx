import type { ReactElement, Ref } from "react";
import type {
	GroupBase,
	SelectInstance,
	Props as SelectProps,
} from "react-select";
import type { UseAsyncPaginateResult } from "react-select-async-paginate";
import { useComponents } from "react-select-async-paginate";
import type { SelectFetchProps, SelectFetchType } from "./types";
import { useSelectFetch } from "./useSelectFetch";

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

export function withSelectFetch(
	SelectComponent: SelectComponentType,
): SelectFetchType {
	function WithSelectFetch<
		OptionType,
		Group extends GroupBase<OptionType>,
		IsMulti extends boolean = false,
	>(props: SelectFetchProps<OptionType, Group, IsMulti>): ReactElement {
		const {
			components = defaultComponents,
			selectRef = undefined,
			cacheUniqs = defaultCacheUniqs,
			...rest
		} = props;

		const asyncPaginateProps: UseAsyncPaginateResult<OptionType, Group> =
			useSelectFetch(rest, cacheUniqs);

		const processedComponents = useComponents<OptionType, Group, IsMulti>(
			components,
		);

		return (
			<SelectComponent
				{...props}
				{...asyncPaginateProps}
				components={processedComponents}
				ref={selectRef}
			/>
		);
	}

	return WithSelectFetch;
}
