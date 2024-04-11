import qs from "qs";

export const stringifyParams = (params: Record<string, unknown>): string =>
	qs.stringify(params, {
		arrayFormat: "repeat",
	});
