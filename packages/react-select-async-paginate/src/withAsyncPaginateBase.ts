import React from 'react';
import type {
  FC,
  ComponentType,
} from 'react';
import type {
  Props as SelectProps,
} from 'react-select';

import {
  useAsyncPaginateBase,
} from './useAsyncPaginateBase';
import {
  useComponents,
} from './useComponents';

import type {
  UseAsyncPaginateBaseResult,
  UseAsyncPaginateBaseParams,
  ComponentProps,
} from './types';

export type Props<OptionType = any, Additional = any> =
  & SelectProps<OptionType>
  & UseAsyncPaginateBaseParams<OptionType, Additional>
  & ComponentProps
  & {
    useComponents?: typeof useComponents;
    useAsyncPaginateBase?: typeof useAsyncPaginateBase;
  };

export const withAsyncPaginateBase = <OptionType = any, Additional = any>(
  SelectComponent: ComponentType<SelectProps<OptionType>>,
): FC<Props<OptionType, Additional>> => {
  const WithAsyncPaginateBase: FC<Props<OptionType, Additional>> = (props) => {
    const {
      components,
      selectRef,
      useComponents: useComponentsProp,
      useAsyncPaginateBase: useAsyncPaginateBaseProp,
      cacheUniqs,
      ...rest
    } = props;

    const asyncPaginateBaseProps: UseAsyncPaginateBaseResult<OptionType> = useAsyncPaginateBaseProp(
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

  WithAsyncPaginateBase.defaultProps = {
    selectRef: null,
    cacheUniqs: [],
    components: {},
    useComponents,
    useAsyncPaginateBase,
  };

  return WithAsyncPaginateBase;
};
