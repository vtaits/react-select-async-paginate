import {
  useMemo,
} from 'react';
import type {
  ComponentType,
} from 'react';
import type {
  MenuListComponentProps,
  SelectComponentsConfig,
} from 'react-select';

import { components as defaultComponents } from 'react-select';

import { wrapMenuList } from './wrapMenuList';

export const MenuList = wrapMenuList(defaultComponents.MenuList);

export const useComponentsPure = <OptionType, IsMulti extends boolean>(
  useMemoParam: typeof useMemo,
  components: SelectComponentsConfig<OptionType, IsMulti>,
): SelectComponentsConfig<OptionType, IsMulti> => useMemoParam(() => ({
    MenuList: (MenuList as unknown as ComponentType<MenuListComponentProps<OptionType, IsMulti>>),
    ...components,
  }), [components]);

export const useComponents = <OptionType, IsMulti extends boolean>(
  components: SelectComponentsConfig<OptionType, IsMulti>,
): SelectComponentsConfig<OptionType, IsMulti> => useComponentsPure(
    useMemo,
    components,
  );
