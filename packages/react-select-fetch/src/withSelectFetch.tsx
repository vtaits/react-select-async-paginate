import type {
  FC,
  ComponentType,
} from 'react';
import type {
  Props as SelectProps,
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
IsMulti extends boolean,
> =
  & SelectProps<OptionType, IsMulti>
  & UseSelectFetchParams<OptionType>
  & ComponentProps
  & {
    useComponents?: typeof useComponents;
    useSelectFetch?: typeof useSelectFetch;
  };

export function withSelectFetch<
OptionType,
IsMulti extends boolean,
>(
  // eslint-disable-next-line @typescript-eslint/naming-convention
  SelectComponent: ComponentType<SelectProps<OptionType, IsMulti>>,
): FC<Props<OptionType, IsMulti>> {
  const WithSelectFetch: FC<Props<OptionType, IsMulti>> = (props) => {
    const {
      components,
      selectRef,
      useComponents: useComponentsProp,
      useSelectFetch: useSelectFetchProp,
      cacheUniqs,
      ...rest
    } = props;

    const asyncPaginateProps: UseAsyncPaginateResult<OptionType> = useSelectFetchProp(
      rest,
      cacheUniqs,
    );

    const processedComponents = useComponentsProp<OptionType, IsMulti>(components);

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
