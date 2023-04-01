import {
  setMenuIsOpen as setMenuIsOpenAction,
} from '../../actions';
import type {
  SetMenuIsOpenAction,
} from '../../actions';

import {
  SET_MENU_IS_OPEN,
} from '../../actionTypes';

import { requestOptions } from '../requestOptions';

import { setMenuIsOpen } from '../setMenuIsOpen';

import {
  RequestOptionsCaller,
} from '../../types/internal';

jest.mock('../../actions');
const mockedSetMenuIsOpenAction = jest.mocked(setMenuIsOpenAction);

jest.mock('../requestOptions');
const mockedRequestOptions = jest.mocked(requestOptions);

beforeEach(() => {
  jest.clearAllMocks();
});

const action: SetMenuIsOpenAction = {
  type: SET_MENU_IS_OPEN,
  payload: {
    menuIsOpen: true,
  },
};

mockedSetMenuIsOpenAction.mockReturnValue(action);

test('should not load options if menu is closed', () => {
  const setMenuIsOpenThunkAction = setMenuIsOpen(false);

  const dispatch = jest.fn();

  setMenuIsOpenThunkAction(
    dispatch,
    jest.fn().mockReturnValue({
      cache: {},
      inputValue: '',
      menuIsOpen: true,
    }),
    jest.fn().mockReturnValue({}),
  );

  expect(mockedSetMenuIsOpenAction).toHaveBeenCalledTimes(1);
  expect(mockedSetMenuIsOpenAction).toHaveBeenCalledWith(false);

  expect(mockedRequestOptions).toHaveBeenCalledTimes(0);

  expect(dispatch).toHaveBeenCalledTimes(1);
  expect(dispatch).toHaveBeenCalledWith(action);
});

test('should not load options if cache for input value is not empty', () => {
  const setMenuIsOpenThunkAction = setMenuIsOpen(true);

  const dispatch = jest.fn();

  setMenuIsOpenThunkAction(
    dispatch,
    jest.fn().mockReturnValue({
      cache: {
        test: {
          isFirstLoad: false,
          isLoading: false,
          hasMore: true,
          options: [],
          additional: undefined,
        },
      },
      inputValue: 'test',
      menuIsOpen: true,
    }),
    jest.fn().mockReturnValue({}),
  );

  expect(mockedSetMenuIsOpenAction).toHaveBeenCalledTimes(1);
  expect(mockedSetMenuIsOpenAction).toHaveBeenCalledWith(true);

  expect(mockedRequestOptions).toHaveBeenCalledTimes(0);

  expect(dispatch).toHaveBeenCalledTimes(1);
  expect(dispatch).toHaveBeenCalledWith(action);
});

test('should not load options if `loadOptionsOnMenuOpen` is false', () => {
  const setMenuIsOpenThunkAction = setMenuIsOpen(true);

  const dispatch = jest.fn();

  setMenuIsOpenThunkAction(
    dispatch,
    jest.fn().mockReturnValue({
      cache: {},
      inputValue: '',
      menuIsOpen: true,
    }),
    jest.fn().mockReturnValue({
      loadOptionsOnMenuOpen: false,
    }),
  );

  expect(mockedSetMenuIsOpenAction).toHaveBeenCalledTimes(1);
  expect(mockedSetMenuIsOpenAction).toHaveBeenCalledWith(true);

  expect(mockedRequestOptions).toHaveBeenCalledTimes(0);

  expect(dispatch).toHaveBeenCalledTimes(1);
  expect(dispatch).toHaveBeenCalledWith(action);
});

test('should load options', () => {
  const requestOptionsThunkAction = jest.fn();
  mockedRequestOptions.mockReturnValue(requestOptionsThunkAction);

  const setMenuIsOpenThunkAction = setMenuIsOpen(true);

  const dispatch = jest.fn();

  setMenuIsOpenThunkAction(
    dispatch,
    jest.fn().mockReturnValue({
      cache: {},
      inputValue: '',
      menuIsOpen: true,
    }),
    jest.fn().mockReturnValue({}),
  );

  expect(mockedSetMenuIsOpenAction).toHaveBeenCalledTimes(1);
  expect(mockedSetMenuIsOpenAction).toHaveBeenCalledWith(true);

  expect(mockedRequestOptions).toHaveBeenCalledTimes(1);
  expect(mockedRequestOptions).toHaveBeenCalledWith(RequestOptionsCaller.MenuToggle);

  expect(dispatch).toHaveBeenCalledTimes(2);
  expect(dispatch).toHaveBeenNthCalledWith(1, action);
  expect(dispatch).toHaveBeenNthCalledWith(2, requestOptionsThunkAction);
});
