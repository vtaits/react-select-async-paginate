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
  useComponents,
} from 'react-select-async-paginate';
import type {
  ComponentProps,
  UseAsyncPaginateResult,
} from 'react-select-async-paginate';

import {
  useSelectFetch,
} from './useSelectFetch';

import type {
  UseSelectFetchParams,
} from './types';

export type Props<
OptionType,
Group extends GroupBase<OptionType>,
IsMulti extends boolean,
> =
  & SelectProps<OptionType, IsMulti, Group>
  & UseSelectFetchParams<OptionType, Group>
  & ComponentProps<OptionType, Group, IsMulti>
  & {
    useComponents?: typeof useComponents;
    useSelectFetch?: typeof useSelectFetch;
  };

export function withSelectFetch<
OptionType,
Group extends GroupBase<OptionType>,
IsMulti extends boolean,
>(
  // eslint-disable-next-line @typescript-eslint/naming-convention
  SelectComponent: ComponentType<SelectProps<OptionType, IsMulti, Group> & {
    ref?: Ref<SelectInstance<OptionType, IsMulti, Group>>;
  }>,
): FC<Props<OptionType, Group, IsMulti>> {
  const WithSelectFetch: FC<Props<OptionType, Group, IsMulti>> = (props) => {
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
  };

  WithSelectFetch.defaultProps = {
    selectRef: null,
    cacheUniqs: [],
    components: {},
    useComponents,
    useSelectFetch,
  };

  return WithSelectFetch;
}
