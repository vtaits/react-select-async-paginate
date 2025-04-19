import { useLazyRef } from "@vtaits/use-lazy-ref";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { GroupBase } from "react-select";
import useIsMountedRef from "use-is-mounted-ref";
import useLatest from "use-latest";
import { defaultReduceOptions } from "./defaultReduceOptions";
import { defaultShouldLoadMore } from "./defaultShouldLoadMore";
import { getInitialCache } from "./getInitialCache";
import { getInitialOptionsCache } from "./getInitialOptionsCache";
import { requestOptions } from "./requestOptions";
import type {
	OptionsCacheItem,
	RequestOptionsCallerType,
	UseAsyncPaginateBaseParams,
	UseAsyncPaginateBaseResult,
} from "./types";

export const increaseStateId = (prevStateId: number): number => prevStateId + 1;

export const useAsyncPaginateBase = <
	OptionType,
	Group extends GroupBase<OptionType>,
	Additional,
>(
	params: UseAsyncPaginateBaseParams<OptionType, Group, Additional>,
	deps: ReadonlyArray<unknown> = [],
): UseAsyncPaginateBaseResult<OptionType, Group> => {
	const {
		clearCacheOnSearchChange = false,
		defaultOptions,
		loadOptionsOnMenuOpen = true,
		debounceTimeout = 0,
		inputValue,
		menuIsOpen,
		filterOption = null,
		reduceOptions = defaultReduceOptions,
		shouldLoadMore = defaultShouldLoadMore,
		mapOptionsForMenu = undefined,
	} = params;

	const menuIsOpenRef = useLatest(menuIsOpen);
	const isMountedRef = useIsMountedRef();
	const reduceOptionsRef = useLatest(reduceOptions);
	const loadOptionsOnMenuOpenRef = useLatest(loadOptionsOnMenuOpen);

	const isInitRef = useRef<boolean>(true);
	const paramsRef =
		useRef<UseAsyncPaginateBaseParams<OptionType, Group, Additional>>(params);

	paramsRef.current = params;

	const [_stateId, setStateId] = useState(0);

	const optionsCacheRef = useLazyRef(() => getInitialOptionsCache(params));

	const callRequestOptionsRef = useLatest(
		(caller: RequestOptionsCallerType) => {
			requestOptions(
				caller,
				paramsRef,
				optionsCacheRef,
				debounceTimeout,
				(reduceState) => {
					optionsCacheRef.current = reduceState(optionsCacheRef.current);

					if (isMountedRef.current) {
						setStateId(increaseStateId);
					}
				},
				reduceOptionsRef.current,
				isMountedRef,
				clearCacheOnSearchChange,
			);
		},
	);

	const handleScrolledToBottom = useCallback(() => {
		const currentInputValue = paramsRef.current.inputValue;
		const currentOptions = optionsCacheRef.current[currentInputValue];

		if (currentOptions) {
			callRequestOptionsRef.current("menu-scroll");
		}
	}, [callRequestOptionsRef, optionsCacheRef]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: `callRequestOptionsRef` is a ref
	useEffect(() => {
		if (isInitRef.current) {
			isInitRef.current = false;
		} else {
			optionsCacheRef.current = {};
			setStateId(increaseStateId);
		}

		if (defaultOptions === true) {
			callRequestOptionsRef.current("autoload");
		}
	}, deps);

	useEffect(() => {
		if (menuIsOpenRef.current && !optionsCacheRef.current[inputValue]) {
			callRequestOptionsRef.current("input-change");
		}
	}, [callRequestOptionsRef, inputValue, menuIsOpenRef, optionsCacheRef]);

	useEffect(() => {
		if (
			menuIsOpen &&
			!optionsCacheRef.current[""] &&
			loadOptionsOnMenuOpenRef.current
		) {
			callRequestOptionsRef.current("menu-toggle");
		}
	}, [
		callRequestOptionsRef,
		loadOptionsOnMenuOpenRef,
		menuIsOpen,
		optionsCacheRef,
	]);

	const currentOptions: OptionsCacheItem<OptionType, Group, Additional> =
		optionsCacheRef.current[inputValue] || getInitialCache(params);

	const options = useMemo(() => {
		if (!mapOptionsForMenu) {
			return currentOptions.options;
		}

		return mapOptionsForMenu(currentOptions.options);
	}, [currentOptions.options, mapOptionsForMenu]);

	return {
		handleScrolledToBottom,
		shouldLoadMore,
		filterOption,
		isLoading:
			currentOptions.isLoading || currentOptions.lockedUntil > Date.now(),
		isFirstLoad: currentOptions.isFirstLoad,
		options,
	};
};
