import type { GroupBase } from "react-select";
import type { UseAsyncPaginateBaseResult } from "react-select-async-paginate";
import { useAsyncPaginateBase } from "react-select-async-paginate";
import type { UseSelectFetchBaseParams } from "./types";
import { useMapToAsyncPaginate } from "./useMapToAsyncPaginate";

export const useSelectFetchBase = <
	OptionType,
	Group extends GroupBase<OptionType>,
>(
	params: UseSelectFetchBaseParams<OptionType, Group>,
	deps: ReadonlyArray<unknown> = [],
): UseAsyncPaginateBaseResult<OptionType, Group> => {
	const mappedParams = useMapToAsyncPaginate(params);

	const result = useAsyncPaginateBase(
		{
			...params,
			...mappedParams,
		},
		deps,
	);

	return result;
};
