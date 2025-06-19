import { getResult } from "krustykrab";
import { onLoadSuccess, setLoading, unsetLoading } from "../actions";
import { getInitialCache } from "../getInitialCache";
import type { State } from "../types/internal";
import { RequestOptionsCaller } from "../types/internal";
import type { Params } from "../types/public";
import type { Dispatch } from "../types/thunkHelpers";
import { sleep } from "../utils/sleep";
import { validateResponse } from "../validateResponse";

export const requestOptions =
	<OptionType, Additional>(caller: RequestOptionsCaller) =>
	async (
		dispatch: Dispatch<OptionType, Additional>,
		getState: () => State<OptionType, Additional>,
		getParams: () => Params<OptionType, Additional>,
	) => {
		const params = getParams();

		const {
			debounceTimeout = 0,
			loadOptions,
			reloadOnErrorTimeout = 0,
		} = params;

		const { cache, inputValue } = getState();

		const isCacheEmpty = !cache[inputValue];

		const currentCache = cache[inputValue] || getInitialCache(params);

		if (
			currentCache.isLoading ||
			!currentCache.hasMore ||
			currentCache.lockedUntil > Date.now()
		) {
			return;
		}

		dispatch(setLoading(inputValue));

		if (debounceTimeout > 0 && caller === RequestOptionsCaller.InputChange) {
			await sleep(debounceTimeout);

			const newInputValue = getState().inputValue;

			if (inputValue !== newInputValue) {
				dispatch(unsetLoading(inputValue, isCacheEmpty, 0));
				return;
			}
		}

		const result = await getResult(
			loadOptions(inputValue, currentCache.options, currentCache.additional),
		);

		if (result.isErr()) {
			dispatch(
				unsetLoading(inputValue, false, Date.now() + reloadOnErrorTimeout),
			);
			return;
		}

		const response = result.unwrap();

		if (!validateResponse(response)) {
			dispatch(unsetLoading(inputValue, false, 0));
			return;
		}

		dispatch(onLoadSuccess(inputValue, response));
	};
