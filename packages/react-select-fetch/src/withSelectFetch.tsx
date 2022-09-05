import type {
  ComponentType,
  ReactElement,
  Ref,
} from 'react';

import type {
  GroupBase,
  Props as SelectProps,
  SelectInstance,
} from 'react-select';

import {
  useComponents,
} from 'react-select-async-paginate';
import type {
  UseAsyncPaginateResult,
} from 'react-select-async-paginate';

import {
  useSelectFetch,
} from './useSelectFetch';

import type {
  SelectFetchProps,
  SelectFetchType,
} from './types';

export function withSelectFetch(
  // eslint-disable-next-line @typescript-eslint/naming-convention
  SelectComponent: ComponentType<SelectProps<unknown, boolean, GroupBase<unknown>> & {
    ref?: Ref<SelectInstance<unknown, boolean, GroupBase<unknown>>>;
  }>,
): SelectFetchType {
  function WithSelectFetch<
  OptionType,
  Group extends GroupBase<OptionType>,
  IsMulti extends boolean = false,
  >(props: SelectFetchProps<OptionType, Group, IsMulti>): ReactElement {
    const {
      components,
      selectRef,
      cacheUniqs,
      ...rest
    } = props;

    const asyncPaginateProps: UseAsyncPaginateResult<OptionType, Group> = useSelectFetch(
      rest,
      cacheUniqs,
    );

    const processedComponents = useComponents<OptionType, Group, IsMulti>(components);

    return (
      <SelectComponent
        {...props}
        {...asyncPaginateProps}
        components={processedComponents}
        ref={selectRef}
      />
    );
  }

  WithSelectFetch.defaultProps = {
    selectRef: null,
    cacheUniqs: [],
    components: {},
  };

  return WithSelectFetch;
}
