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

export type Props<
OptionType,
Group extends GroupBase<OptionType>,
IsMulti extends boolean,
> =
  & SelectFetchProps<OptionType, Group, IsMulti>
  & {
    useComponents?: typeof useComponents;
    useSelectFetch?: typeof useSelectFetch;
  };

export function withSelectFetch(
  // eslint-disable-next-line @typescript-eslint/naming-convention
  SelectComponent: ComponentType<SelectProps<any, boolean, any> & {
    ref?: Ref<SelectInstance<any, boolean, any>>;
  }>,
): SelectFetchType {
  function WithSelectFetch<
  OptionType,
  Group extends GroupBase<OptionType>,
  IsMulti extends boolean = false,
  >(props: Props<OptionType, Group, IsMulti>): ReactElement {
    const {
      components,
      selectRef,
      useComponents: useComponentsProp,
      useSelectFetch: useSelectFetchProp,
      cacheUniqs,
      ...rest
    } = props;

    const asyncPaginateProps: UseAsyncPaginateResult<OptionType, Group> = useSelectFetchProp(
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

  WithSelectFetch.defaultProps = {
    selectRef: null,
    cacheUniqs: [],
    components: {},
    useComponents,
    useSelectFetch,
  };

  return WithSelectFetch;
}
