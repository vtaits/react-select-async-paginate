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

export const useComponentsPure = <OptionType>(
  useMemoParam: typeof useMemo,
  components: SelectComponentsConfig<OptionType>,
): SelectComponentsConfig<OptionType> => useMemoParam(() => ({
    MenuList: (MenuList as unknown as ComponentType<MenuListComponentProps<OptionType>>),
    ...components,
  }), [components]);

export const useComponents = <OptionType = any>(
  components: SelectComponentsConfig<OptionType>,
): SelectComponentsConfig<OptionType> => useComponentsPure(
    useMemo,
    components,
  );
