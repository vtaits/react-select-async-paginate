import { stringifyParams } from "./stringifyParams";

export const get = async (
	url: string|undefined,
	params: Record<string, unknown>,
): Promise<unknown> => {
	if (url == null) {
		throw new Error("The `url` prop is required unless `get` is overridden.")
	}
	const paramsStr = stringifyParams(params);

	const response: Response = await fetch(`${url}?${paramsStr}`, {
		credentials: "same-origin",
	});

	if (response.status >= 400) {
		throw new Error("Failed to fetch");
	}

	const responseJSON = await response.json();

	return responseJSON;
};
