import type {
  FC,
  ComponentType,
} from 'react';
import type {
  Props as SelectProps,
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

export type Props<OptionType, Additional, IsMulti extends boolean> =
  & SelectProps<OptionType, IsMulti>
  & UseAsyncPaginateParams<OptionType, Additional>
  & ComponentProps
  & {
    useComponents?: typeof useComponents;
    useAsyncPaginate?: typeof useAsyncPaginate;
  };

export function withAsyncPaginate<
OptionType,
Additional,
IsMulti extends boolean,
>(
  // eslint-disable-next-line @typescript-eslint/naming-convention
  SelectComponent: ComponentType<SelectProps<OptionType, IsMulti>>,
): FC<Props<OptionType, Additional, IsMulti>> {
  const WithAsyncPaginate: FC<Props<OptionType, Additional, IsMulti>> = (props) => {
    const {
      components,
      selectRef,
      useComponents: useComponentsProp,
      useAsyncPaginate: useAsyncPaginateProp,
      cacheUniqs,
      ...rest
    } = props;

    const asyncPaginateProps: UseAsyncPaginateResult<OptionType> = useAsyncPaginateProp(
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

  WithAsyncPaginate.defaultProps = {
    selectRef: null,
    cacheUniqs: [],
    components: {},
    useComponents,
    useAsyncPaginate,
  };

  return WithAsyncPaginate;
}
