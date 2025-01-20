import { useCallback, useEffect, useMemo, useRef } from "react";
import { defaultShouldLoadMore } from "./defaultShouldLoadMore";
import type { UseWatchMenuParams } from "./types";

export const CHECK_TIMEOUT = 300;

export function useWatchMenu({
	menuRef,
	shouldLoadMore = defaultShouldLoadMore,
	handleScrolledToBottom,
}: UseWatchMenuParams) {
	const checkTimeoutRef = useRef<number | null>(null);

	const shouldHandle = useCallback(() => {
		const el = menuRef.current;

		// menu is not rendered
		if (!el) {
			return false;
		}

		const { scrollTop, scrollHeight, clientHeight } = el;

		return shouldLoadMore(scrollHeight, clientHeight, scrollTop);
	}, [menuRef, shouldLoadMore]);

	const checkAndHandle = useCallback(() => {
		if (shouldHandle()) {
			if (handleScrolledToBottom) {
				handleScrolledToBottom();
			}
		}
	}, [shouldHandle, handleScrolledToBottom]);

	const setCheckAndHandleTimeout = useMemo(() => {
		const res = () => {
			checkAndHandle();

			checkTimeoutRef.current = setTimeout(
				res,
				CHECK_TIMEOUT,
			) as unknown as number;
		};

		return res;
	}, [checkAndHandle]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: call only on init
	useEffect(() => {
		setCheckAndHandleTimeout();

		return () => {
			if (checkTimeoutRef.current) {
				clearTimeout(checkTimeoutRef.current);
			}
		};
	}, []);
}
