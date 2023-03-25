import {
  reset as resetAction,
} from '../../actions';
import type {
  ResetAction,
} from '../../actions';

import {
  RESET,
} from '../../actionTypes';

import { requestOptions } from '../requestOptions';

import { reset } from '../reset';

jest.mock('../../actions');
const mockedResetAction = jest.mocked(resetAction);

jest.mock('../requestOptions');
const mockedRequestOptions = jest.mocked(requestOptions);

beforeEach(() => {
  jest.clearAllMocks();
});

const resetThunkAction = reset();

const action: ResetAction = {
  type: RESET,
};

mockedResetAction.mockReturnValue(action);

test('should call reset and not load options', () => {
  const dispatch = jest.fn();

  const getParams = jest.fn()
    .mockReturnValue({
      autoload: false,
    });

  resetThunkAction(
    dispatch,
    jest.fn(),
    getParams,
  );

  expect(mockedResetAction).toHaveBeenCalledTimes(1);

  expect(mockedRequestOptions).toHaveBeenCalledTimes(0);

  expect(dispatch).toHaveBeenCalledTimes(1);
  expect(dispatch).toHaveBeenCalledWith(action);
});

test('should call reset and load options', () => {
  const requestOptionsThunkAction = jest.fn();
  mockedRequestOptions.mockReturnValue(requestOptionsThunkAction);

  const dispatch = jest.fn();

  const getParams = jest.fn()
    .mockReturnValue({
      autoload: true,
    });

  resetThunkAction(
    dispatch,
    jest.fn(),
    getParams,
  );

  expect(mockedResetAction).toHaveBeenCalledTimes(1);

  expect(mockedRequestOptions).toHaveBeenCalledTimes(1);
  expect(mockedRequestOptions).toHaveBeenCalledWith('autoload');

  expect(dispatch).toHaveBeenCalledTimes(2);
  expect(dispatch).toHaveBeenNthCalledWith(
    1,
    action,
  );
  expect(dispatch).toHaveBeenNthCalledWith(
    2,
    requestOptionsThunkAction,
  );
});
