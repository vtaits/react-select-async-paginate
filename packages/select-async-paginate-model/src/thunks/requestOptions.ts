import { getResult } from "krustykrab";
import { onLoadSuccess, setLoading, unsetLoading } from "../actions";
import { getInitialCache } from "../getInitialCache";
import { RequestOptionsCaller } from "../types/internal";
import type { State } from "../types/internal";
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

		const { debounceTimeout = 0, loadOptions } = params;

		const { cache, inputValue } = getState();

		const isCacheEmpty = !cache[inputValue];

		const currentCache = cache[inputValue] || getInitialCache(params);

		if (currentCache.isLoading || !currentCache.hasMore) {
			return;
		}

		dispatch(setLoading(inputValue));

		if (debounceTimeout > 0 && caller === RequestOptionsCaller.InputChange) {
			await sleep(debounceTimeout);

			const newInputValue = getState().inputValue;

			if (inputValue !== newInputValue) {
				dispatch(unsetLoading(inputValue, isCacheEmpty));
				return;
			}
		}

		const result = await getResult(
			loadOptions(inputValue, currentCache.options, currentCache.additional),
		);

		if (result.isErr()) {
			dispatch(unsetLoading(inputValue, false));
			return;
		}

		const response = result.unwrap();

		if (!validateResponse(response)) {
			dispatch(unsetLoading(inputValue, false));
			return;
		}

		dispatch(onLoadSuccess(inputValue, response));
	};
