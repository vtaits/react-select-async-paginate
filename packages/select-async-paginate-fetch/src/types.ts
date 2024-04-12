import type { Params, Response } from "select-async-paginate-model";

export type Additional = {
	page: number;
};

export type MapResponsePayload<OptionType> = {
	search: string;
	prevPage: number;
	prevOptions: readonly OptionType[];
};

export type MapResponse<OptionType> = (
	responseRaw: unknown,
	payload: MapResponsePayload<OptionType>,
) => Response<OptionType, Additional>;

export type Get = <GetResponse>(
	url: string,
	params: {
		[key: string]: unknown;
	},
) => Promise<GetResponse>;

export type SelectFetchMapParams<OptionType> = {
	url: string;
	queryParams?: {
		[key: string]: unknown;
	};
	searchParamName?: string | null;
	pageParamName?: string | null;
	offsetParamName?: string | null;
	mapResponse?: MapResponse<OptionType>;
	get?: Get;
	initialPage?: number;
	defaultInitialPage?: number;
};

export type SelectFetchParams<OptionType> = SelectFetchMapParams<OptionType> &
	Partial<
		Omit<
			Params<OptionType, Additional>,
			"loadOptions" | "additional" | "defaultAdditional"
		>
	>;
