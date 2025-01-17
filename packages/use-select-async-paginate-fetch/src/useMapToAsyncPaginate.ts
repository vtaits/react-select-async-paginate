import { useMemo } from "react";
import {
	type Additional,
	type SelectFetchParams,
	mapToAsyncPaginate,
} from "select-async-paginate-fetch";
import type { Params } from "select-async-paginate-model";

export const useMapToAsyncPaginate = <OptionType>(
	selectFetchParams: SelectFetchParams<OptionType>,
): Params<OptionType, Additional> => {
	const {
		url,
		queryParams,
		searchParamName,
		pageParamName,
		offsetParamName,
		mapResponse,
		get,
		initialPage,
		defaultInitialPage,
	} = selectFetchParams;

	const params = useMemo(
		() =>
			mapToAsyncPaginate({
				url,
				queryParams,
				searchParamName,
				pageParamName,
				offsetParamName,
				mapResponse,
				get,
				initialPage,
				defaultInitialPage,
			}),
		[
			url,
			queryParams,
			searchParamName,
			pageParamName,
			offsetParamName,
			mapResponse,
			get,
			initialPage,
			defaultInitialPage,
		],
	);

	return params;
};
