import React from 'react';
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

export type Props<OptionType = any> =
  & SelectProps<OptionType>
  & UseSelectFetchParams<OptionType>
  & ComponentProps
  & {
    useComponents?: typeof useComponents;
    useSelectFetch?: typeof useSelectFetch;
  };

export const withSelectFetch = <OptionType = any, Additional = any>(
  SelectComponent: ComponentType<SelectProps<OptionType>>,
): FC<Props<OptionType>> => {
  const WithAsyncPaginate: FC<Props<OptionType>> = (props) => {
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

    const processedComponents = useComponentsProp<OptionType>(components);

    return React.createElement(
      SelectComponent,
      {
        ...props,
        ...asyncPaginateProps,
        components: processedComponents,
        ref: selectRef,
      },
    );
  };

  WithAsyncPaginate.defaultProps = {
    selectRef: null,
    cacheUniqs: [],
    components: {},
    useComponents,
    useSelectFetch,
  };

  return WithAsyncPaginate;
};
