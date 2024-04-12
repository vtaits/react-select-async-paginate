import { reset as resetAction } from "../actions";
import { RequestOptionsCaller } from "../types/internal";
import type { State } from "../types/internal";
import type { Params } from "../types/public";
import type { Dispatch } from "../types/thunkHelpers";
import { requestOptions } from "./requestOptions";

export const reset =
	<OptionType, Additional>() =>
	(
		dispatch: Dispatch<OptionType, Additional>,
		getState: () => State<OptionType, Additional>,
		getParams: () => Params<OptionType, Additional>,
	) => {
		dispatch(resetAction());

		const { autoload } = getParams();

		if (autoload) {
			dispatch(requestOptions(RequestOptionsCaller.Autoload));
		}
	};
