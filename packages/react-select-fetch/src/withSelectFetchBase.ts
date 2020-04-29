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
  UseAsyncPaginateBaseResult,
} from 'react-select-async-paginate';

import {
  useSelectFetchBase,
} from './useSelectFetchBase';

import type {
  UseSelectFetchBaseParams,
} from './types';

export type Props<OptionType = any> =
  & SelectProps<OptionType>
  & UseSelectFetchBaseParams<OptionType>
  & ComponentProps
  & {
    useComponents?: typeof useComponents;
    useSelectFetchBase?: typeof useSelectFetchBase;
  };

export const withSelectFetchBase = <OptionType = any, Additional = any>(
  SelectComponent: ComponentType<SelectProps<OptionType>>,
): FC<Props<OptionType>> => {
  const WithAsyncPaginate: FC<Props<OptionType>> = (props) => {
    const {
      components,
      selectRef,
      useComponents: useComponentsProp,
      useSelectFetchBase: useSelectFetchBaseProp,
      cacheUniqs,
      ...rest
    } = props;

    const asyncPaginateBaseProps: UseAsyncPaginateBaseResult<OptionType> = useSelectFetchBaseProp(
      rest,
      cacheUniqs,
    );

    const processedComponents = useComponentsProp<OptionType>(components);

    return React.createElement(
      SelectComponent,
      {
        ...props,
        ...asyncPaginateBaseProps,
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
    useSelectFetchBase,
  };

  return WithAsyncPaginate;
};
