import qs from "qs";

export function stringifyParams(params: Record<string, unknown>): string {
	return qs.stringify(params, {
		arrayFormat: "repeat",
	});
}
