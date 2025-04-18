import composeRefs from "@seznam/compose-react-refs";
import { useCallback, useEffect, useMemo, useRef } from "react";
import type { ComponentType, ReactElement } from "react";
import type { GroupBase, MenuListProps } from "react-select";
import type { ShouldLoadMore } from "../types";

export const CHECK_TIMEOUT = 300;

export type BaseSelectProps = {
	handleScrolledToBottom?: () => void;
	shouldLoadMore: ShouldLoadMore;
};

type MenuListType<
	Option = unknown,
	IsMulti extends boolean = boolean,
	Group extends GroupBase<Option> = GroupBase<Option>,
> = ComponentType<MenuListProps<Option, IsMulti, Group>>;

export function wrapMenuList<
	Option = unknown,
	IsMulti extends boolean = boolean,
	Group extends GroupBase<Option> = GroupBase<Option>,
>(MenuList: MenuListType<Option, IsMulti, Group>) {
	function WrappedMenuList(
		props: MenuListProps<Option, IsMulti, Group>,
	): ReactElement {
		const { selectProps, innerRef } = props;

		const { handleScrolledToBottom, shouldLoadMore } =
			selectProps as unknown as BaseSelectProps;

		const checkTimeoutRef = useRef<number | null>(null);
		const menuListRef = useRef<HTMLDivElement>(null);

		const shouldHandle = useCallback(() => {
			const el = menuListRef.current;

			// menu is not rendered
			if (!el) {
				return false;
			}

			const { scrollTop, scrollHeight, clientHeight } = el;

			return shouldLoadMore(scrollHeight, clientHeight, scrollTop);
		}, [shouldLoadMore]);

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

		return (
			<MenuList
				{...props}
				innerRef={composeRefs<HTMLDivElement>(innerRef, menuListRef)}
			/>
		);
	}

	return WrappedMenuList;
}
