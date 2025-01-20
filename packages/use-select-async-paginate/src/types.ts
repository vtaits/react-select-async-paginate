import type { RefObject } from "react";

export type ShouldLoadMore = (
	scrollHeight: number,
	clientHeight: number,
	scrollTop: number,
) => boolean;

export type UseWatchMenuParams = {
	handleScrolledToBottom?: VoidFunction;
	shouldLoadMore?: ShouldLoadMore;
	menuRef: RefObject<HTMLDivElement>;
};
