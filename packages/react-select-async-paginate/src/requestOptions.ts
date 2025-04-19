import { getResult } from "krustykrab";
import type { RefObject } from "react";
import type { GroupBase } from "react-select";
import sleep from "sleep-promise";
import { getInitialCache } from "./getInitialCache";
import type {
	OptionsCache,
	OptionsCacheItem,
	ReduceOptions,
	RequestOptionsCallerType,
	UseAsyncPaginateBaseParams,
} from "./types";
import { validateResponse } from "./validateResponse";

type MapOptionsCache<
	OptionType,
	Group extends GroupBase<OptionType>,
	Additional,
> = (
	prevCache: OptionsCache<OptionType, Group, Additional>,
) => OptionsCache<OptionType, Group, Additional>;

type SetOptionsCache<
	OptionType,
	Group extends GroupBase<OptionType>,
	Additional,
> = (stateMapper: MapOptionsCache<OptionType, Group, Additional>) => void;

export const requestOptions = async <
	OptionType,
	Group extends GroupBase<OptionType>,
	Additional,
>(
	caller: RequestOptionsCallerType,
	paramsRef: RefObject<
		UseAsyncPaginateBaseParams<OptionType, Group, Additional>
	>,
	optionsCacheRef: RefObject<OptionsCache<OptionType, Group, Additional>>,
	debounceTimeout: number,
	setOptionsCache: SetOptionsCache<OptionType, Group, Additional>,
	reduceOptions: ReduceOptions<OptionType, Group, Additional>,
	isMountedRef: {
		current: boolean;
	},
	clearCacheOnSearchChange: boolean,
): Promise<void> => {
	const currentInputValue = paramsRef.current.inputValue;

	const isCacheEmpty = !optionsCacheRef.current[currentInputValue];

	const currentOptions: OptionsCacheItem<OptionType, Group, Additional> =
		isCacheEmpty
			? getInitialCache(paramsRef.current)
			: optionsCacheRef.current[currentInputValue];

	if (
		currentOptions.isLoading ||
		!currentOptions.hasMore ||
		currentOptions.lockedUntil > Date.now()
	) {
		return;
	}

	setOptionsCache(
		(
			prevOptionsCache: OptionsCache<OptionType, Group, Additional>,
		): OptionsCache<OptionType, Group, Additional> => {
			if (clearCacheOnSearchChange && caller === "input-change") {
				return {
					[currentInputValue]: {
						...currentOptions,
						isLoading: true,
					},
				};
			}

			return {
				...prevOptionsCache,
				[currentInputValue]: {
					...currentOptions,
					isLoading: true,
				},
			};
		},
	);

	if (debounceTimeout > 0 && caller === "input-change") {
		await sleep(debounceTimeout);

		const newInputValue = paramsRef.current.inputValue;

		if (currentInputValue !== newInputValue) {
			setOptionsCache((prevOptionsCache) => {
				if (isCacheEmpty) {
					const { [currentInputValue]: itemForDelete, ...restCache } =
						prevOptionsCache;

					return restCache;
				}

				return {
					...prevOptionsCache,
					[currentInputValue]: {
						...currentOptions,
						isLoading: false,
					},
				};
			});

			return;
		}
	}

	const { loadOptions, reloadOnErrorTimeout = 0 } = paramsRef.current;

	const result = await getResult(
		Promise.resolve().then(() =>
			loadOptions(
				currentInputValue,
				currentOptions.options,
				currentOptions.additional,
			),
		),
	);

	if (!isMountedRef.current) {
		return;
	}

	if (result.isErr()) {
		setOptionsCache((prevOptionsCache) => ({
			...prevOptionsCache,
			[currentInputValue]: {
				...currentOptions,
				isLoading: false,
				lockedUntil: Date.now() + reloadOnErrorTimeout,
			},
		}));

		return;
	}

	const response = result.unwrap();

	if (validateResponse(response)) {
		const { options, hasMore } = response;

		const newAdditional = Object.hasOwn(response, "additional")
			? response.additional
			: currentOptions.additional;

		setOptionsCache((prevOptionsCache) => ({
			...prevOptionsCache,
			[currentInputValue]: {
				...currentOptions,
				options: reduceOptions(currentOptions.options, options, newAdditional),
				hasMore: !!hasMore,
				isLoading: false,
				isFirstLoad: false,
				additional: newAdditional,
			},
		}));
	}
};
