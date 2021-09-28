import type {
  ComponentType,
  Ref,
  ReactElement,
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
  AsyncPaginateProps,
  WithAsyncPaginateType,
} from './types';

export type Props<
OptionType,
Group extends GroupBase<OptionType>,
Additional,
IsMulti extends boolean,
> =
  & AsyncPaginateProps<OptionType, Group, Additional, IsMulti>
  & {
    useComponents?: typeof useComponents;
    useAsyncPaginate?: typeof useAsyncPaginate;
  };

export function withAsyncPaginate(
  // eslint-disable-next-line @typescript-eslint/naming-convention
  SelectComponent: ComponentType<SelectProps<any, boolean, any> & {
    ref?: Ref<SelectInstance<any, boolean, any>>;
  }>,
): WithAsyncPaginateType {
  function WithAsyncPaginate<
  OptionType,
  Group extends GroupBase<OptionType>,
  Additional,
  IsMulti extends boolean = false,
  >(props: Props<OptionType, Group, Additional, IsMulti>): ReactElement {
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
  }

  WithAsyncPaginate.defaultProps = {
    selectRef: null,
    cacheUniqs: [],
    components: {},
    useComponents,
    useAsyncPaginate,
  };

  return WithAsyncPaginate;
}
