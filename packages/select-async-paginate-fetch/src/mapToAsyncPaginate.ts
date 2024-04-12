import { getResult } from "krustykrab";
import {
	type LoadOptions,
	type Params,
	checkIsResponse,
} from "select-async-paginate-model";
import { get as defaultGet } from "./get";
import type {
	Additional,
	SelectFetchMapParams,
	SelectFetchParams,
} from "./types";

export const errorText =
	'[react-select-fetch] response should be an object with "options" prop, which contains array of options. Also you can use `mapResponse` param';

export const defaultResponseMapper = <OptionType>(response: unknown) => {
	if (checkIsResponse<OptionType, Additional>(response)) {
		return response;
	}

	throw new Error(errorText);
};

export const mapToAsyncPaginate = <OptionType>(
	selectFetchParams: SelectFetchMapParams<OptionType>,
): Params<OptionType, Additional> => {
	const {
		url,
		queryParams = {},
		searchParamName = "search",
		pageParamName = "page",
		offsetParamName = "offset",
		mapResponse = defaultResponseMapper,
		get = defaultGet,
		initialPage = 1,
		defaultInitialPage = 2,
	} = selectFetchParams;

	const additional: Additional = {
		page: initialPage,
	};

	const defaultAdditional: Additional = {
		page: defaultInitialPage,
	};

	const loadOptions: LoadOptions<OptionType, Additional> = async (
		search,
		prevOptions,
		currentAdditional,
	) => {
		if (currentAdditional === undefined) {
			throw new Error();
		}

		const { page } = currentAdditional;

		const params: Record<string, unknown> = {
			...queryParams,
		};

		if (searchParamName) {
			params[searchParamName] = search;
		}

		if (pageParamName) {
			params[pageParamName] = page;
		}

		if (offsetParamName) {
			params[offsetParamName] = prevOptions.length;
		}

		const result = await getResult(get(url, params));

		if (result.isErr()) {
			return {
				options: [],
				hasMore: false,
			};
		}

		const response = mapResponse(result.unwrap(), {
			search,
			prevPage: page,
			prevOptions,
		});

		return {
			...response,

			additional: {
				page: page + 1,
			},
		};
	};

	return {
		loadOptions,
		additional,
		defaultAdditional,
	};
};
