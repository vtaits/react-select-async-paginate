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

type SelectComponentsConfig<
OptionType,
IsMulti extends boolean,
Group extends GroupBase<OptionType>,
> = Partial<SelectProps<OptionType, IsMulti, Group>['components']>;

export const useComponentsPure = <
OptionType,
Group extends GroupBase<OptionType>,
IsMulti extends boolean,
>(
    useMemoParam: typeof useMemo,
    components: SelectComponentsConfig<OptionType, IsMulti, Group>,
  ): SelectComponentsConfig<OptionType, IsMulti, Group> => useMemoParam(() => ({
    MenuList,
    ...components,
  } as SelectComponentsConfig<OptionType, IsMulti, Group>), [components]);

export const useComponents = <
OptionType,
Group extends GroupBase<OptionType>,
IsMulti extends boolean,
>(
    components: SelectComponentsConfig<OptionType, IsMulti, Group>,
  ): SelectComponentsConfig<OptionType, IsMulti, Group> => useComponentsPure(
    useMemo,
    components,
  );
