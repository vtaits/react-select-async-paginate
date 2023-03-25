import {
  ON_LOAD_SUCCESS,
  RESET,
  SET_INPUT_VALUE,
  SET_LOADING,
  SET_MENU_IS_OPEN,
  UNSET_LOADING,
} from '../actionTypes';

import { onLoadSuccess } from '../stateMappers/onLoadSuccess';
import { reset } from '../stateMappers/reset';
import { setInputValue } from '../stateMappers/setInputValue';
import { setLoading } from '../stateMappers/setLoading';
import { setMenuIsOpen } from '../stateMappers/setMenuIsOpen';
import { unsetLoading } from '../stateMappers/unsetLoading';

import { createReducer } from '../createReducer';

import type {
  Params,
  State,
} from '../types';

jest.mock('../stateMappers/onLoadSuccess');
jest.mock('../stateMappers/setInputValue');
jest.mock('../stateMappers/setLoading');
jest.mock('../stateMappers/unsetLoading');
jest.mock('../stateMappers/setMenuIsOpen');
jest.mock('../stateMappers/reset');

const mockedOnLoadSuccess = jest.mocked(onLoadSuccess);
const mockedReset = jest.mocked(reset);
const mockedSetInputValue = jest.mocked(setInputValue);
const mockedSetLoading = jest.mocked(setLoading);
const mockedSetMenuIsOpen = jest.mocked(setMenuIsOpen);
const mockedUnsetLoading = jest.mocked(unsetLoading);

const initialState: State<any, any> = {
  cache: {
    initial: {
      hasMore: true,
      isFirstLoad: false,
      isLoading: false,
      options: [],
      additional: null,
    },
  },
  inputValue: 'initial',
  menuIsOpen: true,
};

const currentState: State<any, any> = {
  cache: {
    current: {
      hasMore: true,
      isFirstLoad: false,
      isLoading: false,
      options: [1, 2, 3],
      additional: 'not_null',
    },
  },
  inputValue: 'current',
  menuIsOpen: true,
};

const nextState: State<any, any> = {
  cache: {
    next: {
      hasMore: true,
      isFirstLoad: false,
      isLoading: false,
      options: [1, 2, 3],
      additional: 'not_null',
    },
  },
  inputValue: 'next',
  menuIsOpen: true,
};

const params: Params<any, any> = {
  loadOptions: jest.fn(),
};

const reducer = createReducer(params, initialState);

beforeEach(() => {
  jest.resetAllMocks();
});

[
  {
    prevState: undefined,
    providedPrevState: initialState,
    testGroupName: 'Initial state',
  },

  {
    prevState: currentState,
    providedPrevState: currentState,
    testGroupName: 'Setted state',
  },
].forEach(({
  prevState,
  providedPrevState,
  testGroupName,
}) => {
  describe(testGroupName, () => {
    test('ON_LOAD_SUCCESS', () => {
      mockedOnLoadSuccess.mockReturnValue(nextState);

      const result = reducer(prevState, {
        type: ON_LOAD_SUCCESS,
        payload: {
          inputValue: 'test',
          response: {
            options: [1, 2, 3],
          },
        },
      });

      expect(mockedOnLoadSuccess).toHaveBeenCalledTimes(1);
      expect(mockedOnLoadSuccess).toHaveBeenCalledWith(
        providedPrevState,
        params,
        {
          inputValue: 'test',
          response: {
            options: [1, 2, 3],
          },
        },
      );

      expect(result).toBe(nextState);
    });

    test('RESET', () => {
      mockedReset.mockReturnValue(nextState);

      const result = reducer(prevState, {
        type: RESET,
      });

      expect(mockedReset).toHaveBeenCalledTimes(1);
      expect(mockedReset).toHaveBeenCalledWith(
        providedPrevState,
      );

      expect(result).toBe(nextState);
    });

    test('SET_INPUT_VALUE', () => {
      mockedSetInputValue.mockReturnValue(nextState);

      const result = reducer(prevState, {
        type: SET_INPUT_VALUE,
        payload: {
          inputValue: 'test',
        },
      });

      expect(mockedSetInputValue).toHaveBeenCalledTimes(1);
      expect(mockedSetInputValue).toHaveBeenCalledWith(
        providedPrevState,
        {
          inputValue: 'test',
        },
      );

      expect(result).toBe(nextState);
    });

    test('SET_LOADING', () => {
      mockedSetLoading.mockReturnValue(nextState);

      const result = reducer(prevState, {
        type: SET_LOADING,
        payload: {
          inputValue: 'test',
        },
      });

      expect(mockedSetLoading).toHaveBeenCalledTimes(1);
      expect(mockedSetLoading).toHaveBeenCalledWith(
        providedPrevState,
        params,
        {
          inputValue: 'test',
        },
      );

      expect(result).toBe(nextState);
    });

    test('SET_MENU_IS_OPEN', () => {
      mockedSetMenuIsOpen.mockReturnValue(nextState);

      const result = reducer(prevState, {
        type: SET_MENU_IS_OPEN,
        payload: {
          menuIsOpen: true,
        },
      });

      expect(mockedSetMenuIsOpen).toHaveBeenCalledTimes(1);
      expect(mockedSetMenuIsOpen).toHaveBeenCalledWith(
        providedPrevState,
        {
          menuIsOpen: true,
        },
      );

      expect(result).toBe(nextState);
    });

    test('UNSET_LOADING', () => {
      mockedUnsetLoading.mockReturnValue(nextState);

      const result = reducer(prevState, {
        type: UNSET_LOADING,
        payload: {
          inputValue: 'test',
          isClean: true,
        },
      });

      expect(mockedUnsetLoading).toHaveBeenCalledTimes(1);
      expect(mockedUnsetLoading).toHaveBeenCalledWith(
        providedPrevState,
        {
          inputValue: 'test',
          isClean: true,
        },
      );

      expect(result).toBe(nextState);
    });

    test('should throw error on unknown action', () => {
      expect(() => {
        reducer(prevState, {
          type: 'unknown',
        } as any);
      }).toThrow();
    });
  });
});
