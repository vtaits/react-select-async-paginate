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
  >(props: AsyncPaginateProps<OptionType, Group, Additional, IsMulti>): ReactElement {
    const {
      components,
      selectRef,
      isLoading: isLoadingProp,
      cacheUniqs,
      ...rest
    } = props;

    const asyncPaginateProps: UseAsyncPaginateResult<OptionType, Group> = useAsyncPaginate(
      rest,
      cacheUniqs,
    );

    const processedComponents = useComponents<OptionType, Group, IsMulti>(components);

    const isLoading = typeof isLoadingProp === 'boolean'
      ? isLoadingProp
      : asyncPaginateProps.isLoading;

    return (
      <SelectComponent
        {...props}
        {...asyncPaginateProps}
        isLoading={isLoading}
        components={processedComponents}
        ref={selectRef}
      />
    );
  }

  WithAsyncPaginate.defaultProps = {
    selectRef: null,
    cacheUniqs: [],
    components: {},
  };

  return WithAsyncPaginate;
}
