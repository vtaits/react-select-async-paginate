import { type ComponentType, useMemo } from "react";
import type {
	GroupBase,
	MenuListProps,
	SelectComponentsConfig,
} from "react-select";
import { components as defaultComponents } from "react-select";
import { wrapMenuList } from "./wrapMenuList";

export const MenuList = wrapMenuList(
	// biome-ignore lint/suspicious/noExplicitAny: fix types
	defaultComponents.MenuList as ComponentType<MenuListProps<any, any, any>>,
);

export const useComponents = <
	OptionType,
	Group extends GroupBase<OptionType>,
	IsMulti extends boolean,
>(
	components: SelectComponentsConfig<OptionType, IsMulti, Group>,
): SelectComponentsConfig<OptionType, IsMulti, Group> =>
	useMemo(
		() => ({
			MenuList: MenuList as unknown as SelectComponentsConfig<
				OptionType,
				IsMulti,
				Group
			>["MenuList"],
			...components,
		}),
		[components],
	);
