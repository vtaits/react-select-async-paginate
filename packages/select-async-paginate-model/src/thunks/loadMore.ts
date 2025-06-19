import type { State } from "../types/internal";
import { RequestOptionsCaller } from "../types/internal";
import type { Dispatch } from "../types/thunkHelpers";
import { requestOptions } from "./requestOptions";

export const loadMore =
	<OptionType, Additional>() =>
	(
		dispatch: Dispatch<OptionType, Additional>,
		getState: () => State<OptionType, Additional>,
	) => {
		const { cache, inputValue } = getState();

		const currentCache = cache[inputValue];

		if (currentCache) {
			dispatch(requestOptions(RequestOptionsCaller.MenuScroll));
		}
	};
