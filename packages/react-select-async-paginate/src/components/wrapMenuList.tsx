import composeRefs from "@seznam/compose-react-refs";
import { useRef } from "react";
import type { ComponentType, ReactElement } from "react";
import type { GroupBase, MenuListProps } from "react-select";
import { useWatchMenu } from "use-select-async-paginate";
import type { ShouldLoadMore } from "../types";

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

		const menuRef = useRef<HTMLDivElement>(null);

		useWatchMenu({
			menuRef,
			shouldLoadMore,
			handleScrolledToBottom,
		});

		return (
			<MenuList
				{...props}
				innerRef={composeRefs<HTMLDivElement>(innerRef, menuRef)}
			/>
		);
	}

	return WrappedMenuList;
}
