import type {
  ComponentType,
  FC,
  Ref,
} from 'react';
import type {
  GroupBase,
  Props as SelectProps,
  SelectInstance,
} from 'react-select';

import {
  useAsyncPaginate,
} from './useAsyncPaginate';
import {
  useComponents,
} from './useComponents';

import type {
  UseAsyncPaginateResult,
  UseAsyncPaginateParams,
  ComponentProps,
} from './types';

export type Props<
OptionType,
Group extends GroupBase<OptionType>,
Additional,
IsMulti extends boolean,
> =
  & SelectProps<OptionType, IsMulti, Group>
  & UseAsyncPaginateParams<OptionType, Group, Additional>
  & ComponentProps<OptionType, Group, IsMulti>
  & {
    useComponents?: typeof useComponents;
    useAsyncPaginate?: typeof useAsyncPaginate;
  };

export function withAsyncPaginate<
OptionType,
Group extends GroupBase<OptionType>,
Additional,
IsMulti extends boolean,
>(
  // eslint-disable-next-line @typescript-eslint/naming-convention
  SelectComponent: ComponentType<SelectProps<OptionType, IsMulti, Group> & {
    ref?: Ref<SelectInstance<OptionType, IsMulti, Group>>;
  }>,
): FC<Props<OptionType, Group, Additional, IsMulti>> {
  const WithAsyncPaginate: FC<Props<OptionType, Group, Additional, IsMulti>> = (props) => {
    const {
      components,
      selectRef,
      useComponents: useComponentsProp,
      useAsyncPaginate: useAsyncPaginateProp,
      cacheUniqs,
      ...rest
    } = props;

    const asyncPaginateProps: UseAsyncPaginateResult<OptionType, Group> = useAsyncPaginateProp(
      rest,
      cacheUniqs,
    );

    const processedComponents = useComponentsProp<OptionType, Group, IsMulti>(components);

    return (
      <SelectComponent
        {...props}
        {...asyncPaginateProps}
        components={processedComponents}
        ref={selectRef}
      />
    );
  };

  WithAsyncPaginate.defaultProps = {
    selectRef: null,
    cacheUniqs: [],
    components: {},
    useComponents,
    useAsyncPaginate,
  };

  return WithAsyncPaginate;
}
