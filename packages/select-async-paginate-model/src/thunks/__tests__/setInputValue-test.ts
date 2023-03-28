import {
  setInputValue as setInputValueAction,
} from '../../actions';
import type {
  SetInputValueAction,
} from '../../actions';

import {
  SET_INPUT_VALUE,
} from '../../actionTypes';

import { requestOptions } from '../requestOptions';

import { setInputValue } from '../setInputValue';

import {
  RequestOptionsCaller,
} from '../../types';

jest.mock('../../actions');
const mockedSetInputValueAction = jest.mocked(setInputValueAction);

jest.mock('../requestOptions');
const mockedRequestOptions = jest.mocked(requestOptions);

beforeEach(() => {
  jest.clearAllMocks();
});

const setInputValueThunkAction = setInputValue('testInput');

const action: SetInputValueAction = {
  type: SET_INPUT_VALUE,
  payload: {
    inputValue: 'testInput',
  },
};

mockedSetInputValueAction.mockReturnValue(action);

test('should not load options if menu is closed', () => {
  const dispatch = jest.fn();

  setInputValueThunkAction(
    dispatch,
    jest.fn().mockReturnValue({
      cache: {},
      inputValue: '',
      menuIsOpen: false,
    }),
  );

  expect(mockedSetInputValueAction).toHaveBeenCalledTimes(1);
  expect(mockedSetInputValueAction).toHaveBeenCalledWith('testInput');

  expect(mockedRequestOptions).toHaveBeenCalledTimes(0);

  expect(dispatch).toHaveBeenCalledTimes(1);
  expect(dispatch).toHaveBeenCalledWith(action);
});

test('should not load options if cache for input value is not empty', () => {
  const dispatch = jest.fn();

  setInputValueThunkAction(
    dispatch,
    jest.fn().mockReturnValue({
      cache: {
        testInput: {
          isFirstLoad: false,
          isLoading: false,
          hasMore: true,
          options: [],
          additional: undefined,
        },
      },
      inputValue: '',
      menuIsOpen: true,
    }),
  );

  expect(mockedSetInputValueAction).toHaveBeenCalledTimes(1);
  expect(mockedSetInputValueAction).toHaveBeenCalledWith('testInput');

  expect(mockedRequestOptions).toHaveBeenCalledTimes(0);

  expect(dispatch).toHaveBeenCalledTimes(1);
  expect(dispatch).toHaveBeenCalledWith(action);
});

test('should load options', () => {
  const requestOptionsThunkAction = jest.fn();
  mockedRequestOptions.mockReturnValue(requestOptionsThunkAction);

  const dispatch = jest.fn();

  setInputValueThunkAction(
    dispatch,
    jest.fn().mockReturnValue({
      cache: {},
      inputValue: '',
      menuIsOpen: true,
    }),
  );

  expect(mockedSetInputValueAction).toHaveBeenCalledTimes(1);
  expect(mockedSetInputValueAction).toHaveBeenCalledWith('testInput');

  expect(mockedRequestOptions).toHaveBeenCalledTimes(1);
  expect(mockedRequestOptions).toHaveBeenCalledWith(RequestOptionsCaller.InputChange);

  expect(dispatch).toHaveBeenCalledTimes(2);
  expect(dispatch).toHaveBeenNthCalledWith(1, action);
  expect(dispatch).toHaveBeenNthCalledWith(2, requestOptionsThunkAction);
});
