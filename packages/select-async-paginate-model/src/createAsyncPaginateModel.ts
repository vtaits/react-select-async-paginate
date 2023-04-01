import { legacy_createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import { createReducer } from './createReducer';
import { getInitialCache } from './getInitialCache';
import { getInitialState } from './getInitialState';

import { loadMore } from './thunks/loadMore';
import { requestOptions } from './thunks/requestOptions';
import { reset } from './thunks/reset';
import { setInputValue } from './thunks/setInputValue';
import { setMenuIsOpen } from './thunks/setMenuIsOpen';

import type {
  Dispatch,
} from './types/thunkHelpers';

import {
  RequestOptionsCaller,
} from './types/internal';
import type {
  Model,
  Params,
} from './types/public';

/**
 * Creates the model for asyncronous select that supports pagination on menu scroll
 * @param initialParams parameters
 * @returns the model
 */
export const createAsyncPaginateModel = <OptionType, Additional>(
  initialParams: Params<OptionType, Additional>,
): Model<OptionType, Additional> => {
  let params = initialParams;

  const getParams = () => params;

  const updateParams = (nextParams: Params<OptionType, Additional>) => {
    params = nextParams;
  };

  const initalState = getInitialState(params);

  const reducer = createReducer(params, initalState);

  const store = legacy_createStore(
    reducer,
    applyMiddleware(thunk.withExtraArgument(getParams)),
  );

  const dispatch = store.dispatch as Dispatch<OptionType, Additional>;

  const onToggleMenu = (menuIsOpen: boolean) => {
    dispatch(setMenuIsOpen(menuIsOpen));
  };

  const onChangeInputValue = (inputValue: string) => {
    dispatch(setInputValue<OptionType, Additional>(inputValue));
  };

  const handleLoadMore = () => {
    dispatch(loadMore<OptionType, Additional>());
  };

  const handleReset = () => {
    dispatch(reset<OptionType, Additional>());
  };

  const getCurrentCache = () => {
    const {
      cache,
      inputValue,
    } = store.getState();

    return cache[inputValue] || getInitialCache(params);
  };

  if (params.autoload) {
    dispatch(requestOptions(RequestOptionsCaller.Autoload));
  }

  return {
    getCurrentCache,
    handleLoadMore,
    handleReset,
    onChangeInputValue,
    onToggleMenu,
    subscribe: store.subscribe,
    updateParams,
  };
};
