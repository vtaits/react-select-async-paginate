import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createAsyncPaginateModel } from "select-async-paginate-model";
import type { Params } from "select-async-paginate-model";

const defaultDeps: unknown[] = [];

/**
 * Creates `select-async-paginate-model` instance
 * and listen cache of current value of the search input
 * @param params parameters of `select-async-paginate-model`
 * @param deps if one of dependencies changes then model will be resetted
 * @returns the cache for current value of the search input
 * and the instance of `select-async-paginate-model`
 */
export function useSelectAsyncPaginate<OptionType, Additional>(
	params: Params<OptionType, Additional>,
	deps: readonly unknown[] = defaultDeps,
) {
	const [model] = useState(() => createAsyncPaginateModel(params));

	const currentCache = useSyncExternalStore(
		model.subscribe,
		model.getCurrentCache,
	);

	const isInitRef = useRef(true);

	// biome-ignore lint/correctness/useExhaustiveDependencies: model is permanent
	useEffect(() => {
		if (isInitRef.current) {
			isInitRef.current = false;
		} else {
			model.handleReset();
		}
	}, deps);

	return [currentCache, model] as const;
}
