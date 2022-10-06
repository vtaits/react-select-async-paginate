import {
  useMemo,
} from 'react';
import type {
  GroupBase,
  Props as SelectProps,
} from 'react-select';

import { components as defaultComponents } from 'react-select';

import { wrapMenuList } from './wrapMenuList';

export const MenuList = wrapMenuList(defaultComponents.MenuList);

export type SelectComponentsConfig<
OptionType,
IsMulti extends boolean,
Group extends GroupBase<OptionType>,
> = Partial<SelectProps<OptionType, IsMulti, Group>['components']>;

export const useComponents = <
OptionType,
Group extends GroupBase<OptionType>,
IsMulti extends boolean,
>(
    components: SelectComponentsConfig<OptionType, IsMulti, Group>,
  ): SelectComponentsConfig<OptionType, IsMulti, Group> => useMemo(() => ({
    MenuList,
    ...components,
  }), [components]);
