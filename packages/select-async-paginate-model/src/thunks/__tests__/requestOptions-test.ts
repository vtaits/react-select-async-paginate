import {
  onLoadSuccess,
  setLoading,
  unsetLoading,
} from '../../actions';
import type {
  OnLoadSuccessAction,
  SetLoadingAction,
  UnsetLoadingAction,
} from '../../actions';

import {
  ON_LOAD_SUCCESS,
  SET_LOADING,
  UNSET_LOADING,
} from '../../actionTypes';

import { sleep } from '../../utils/sleep';

import { getInitialCache } from '../../getInitialCache';
import { validateResponse } from '../../validateResponse';

import { requestOptions } from '../requestOptions';

import {
  RequestOptionsCaller,
} from '../../types/internal';
import type {
  State,
} from '../../types/internal';
import type {
  LoadOptions,
  OptionsCacheItem,
  Params,
  Response,
} from '../../types/public';

jest.mock('../../actions');

const mockedOnLoadSuccess = jest.mocked(onLoadSuccess);
const onLoadSuccessAction: OnLoadSuccessAction<unknown, unknown> = {
  type: ON_LOAD_SUCCESS,
  payload: {
    inputValue: 'actionInputValue',
    response: {
      options: [],
    },
  },
};

const mockedSetLoading = jest.mocked(setLoading);
const setLoadingAction: SetLoadingAction = {
  type: SET_LOADING,
  payload: {
    inputValue: 'actionInputValue',
  },
};

const mockedUnsetLoading = jest.mocked(unsetLoading);
const unsetLoadingAction: UnsetLoadingAction = {
  type: UNSET_LOADING,
  payload: {
    inputValue: 'actionInputValue',
    isClean: false,
  },
};

jest.mock('../../getInitialCache');
const mockedGetInitialCache = jest.mocked(getInitialCache);

jest.mock('../../validateResponse');
const mockedValidateResponse = jest.mocked(validateResponse);

jest.mock('../../utils/sleep');

const mockedSleep = jest.mocked(sleep);

const dispatch = jest.fn();
const getState = jest.fn<State<unknown, unknown>, []>();
const getParams = jest.fn<Params<unknown, unknown>, []>();
const loadOptions = jest.fn<
ReturnType<LoadOptions<unknown, unknown>>,
Parameters<LoadOptions<unknown, unknown>>
>();

const defaultCacheItem: OptionsCacheItem<unknown, unknown> = {
  hasMore: true,
  isFirstLoad: false,
  isLoading: false,
  options: [],
  additional: 'defaultAdditional',
};

const defaultParams = {
  loadOptions,
};

beforeEach(() => {
  jest.resetAllMocks();

  mockedSetLoading.mockReturnValue(setLoadingAction);
  mockedOnLoadSuccess.mockReturnValue(onLoadSuccessAction);
  mockedUnsetLoading.mockReturnValue(unsetLoadingAction);

  mockedValidateResponse.mockReturnValue(true);

  mockedGetInitialCache.mockReturnValue(defaultCacheItem);

  getState.mockReturnValue({
    cache: {},
    inputValue: '',
    menuIsOpen: false,
  });

  getParams.mockReturnValue(defaultParams);

  loadOptions.mockReturnValue({
    options: [],
    hasMore: true,
  });
});

const setup = async (caller: RequestOptionsCaller): Promise<void> => {
  const thunkAction = requestOptions(caller);

  await thunkAction(
    dispatch,
    getState,
    getParams,
  );
};

test('should not request options if options are loading', async () => {
  getState.mockReturnValue({
    cache: {
      test: {
        ...defaultCacheItem,
        isLoading: true,
        hasMore: true,
      },
    },
    inputValue: 'test',
    menuIsOpen: false,
  });

  await setup(RequestOptionsCaller.Autoload);

  expect(dispatch).toHaveBeenCalledTimes(0);
});

test('should not request options if there are not more options', async () => {
  getState.mockReturnValue({
    cache: {
      test: {
        ...defaultCacheItem,
        isLoading: false,
        hasMore: false,
      },
    },
    inputValue: 'test',
    menuIsOpen: false,
  });

  await setup(RequestOptionsCaller.Autoload);

  expect(dispatch).toHaveBeenCalledTimes(0);
});

test('should make request if options are not cached', async () => {
  getState.mockReturnValue({
    cache: {},
    inputValue: 'test',
    menuIsOpen: false,
  });

  await setup(RequestOptionsCaller.Autoload);

  expect(dispatch).toHaveBeenCalledTimes(2);
  expect(dispatch).toHaveBeenNthCalledWith(1, setLoadingAction);
  expect(dispatch).toHaveBeenNthCalledWith(2, onLoadSuccessAction);

  expect(mockedGetInitialCache).toHaveBeenCalledTimes(1);
  expect(mockedGetInitialCache).toHaveBeenCalledWith(defaultParams);

  expect(loadOptions).toHaveBeenCalledTimes(1);
  expect(loadOptions).toHaveBeenCalledWith(
    'test',
    [],
    'defaultAdditional',
  );
});

test('should make request if options are cached', async () => {
  getState.mockReturnValue({
    cache: {
      test: {
        ...defaultCacheItem,
        options: [1, 2, 3],
        additional: 'testAdditional',
      },
    },
    inputValue: 'test',
    menuIsOpen: false,
  });

  await setup(RequestOptionsCaller.Autoload);

  expect(dispatch).toHaveBeenCalledTimes(2);
  expect(dispatch).toHaveBeenNthCalledWith(1, setLoadingAction);
  expect(dispatch).toHaveBeenNthCalledWith(2, onLoadSuccessAction);

  expect(mockedGetInitialCache).toHaveBeenCalledTimes(0);

  expect(loadOptions).toHaveBeenCalledTimes(1);
  expect(loadOptions).toHaveBeenCalledWith(
    'test',
    [1, 2, 3],
    'testAdditional',
  );
});

test('should request successfully', async () => {
  const response: Response<unknown, unknown> = {
    options: [1, 2, 3],
    additional: 'testAdditional',
  };

  getState.mockReturnValue({
    cache: {},
    inputValue: 'test',
    menuIsOpen: false,
  });

  loadOptions.mockResolvedValue(response);

  await setup(RequestOptionsCaller.Autoload);

  expect(dispatch).toHaveBeenCalledTimes(2);
  expect(dispatch).toHaveBeenNthCalledWith(1, setLoadingAction);
  expect(dispatch).toHaveBeenNthCalledWith(2, onLoadSuccessAction);

  expect(mockedValidateResponse).toHaveBeenCalledTimes(1);
  expect(mockedValidateResponse).toHaveBeenCalledWith(response);

  expect(mockedSetLoading).toHaveBeenCalledTimes(1);
  expect(mockedSetLoading).toHaveBeenCalledWith(
    'test',
  );

  expect(mockedOnLoadSuccess).toHaveBeenCalledTimes(1);
  expect(mockedOnLoadSuccess).toHaveBeenCalledWith(
    'test',
    response,
  );
});

test('should request with error', async () => {
  getState.mockReturnValue({
    cache: {},
    inputValue: 'test',
    menuIsOpen: false,
  });

  loadOptions.mockRejectedValue(null);

  await setup(RequestOptionsCaller.Autoload);

  expect(dispatch).toHaveBeenCalledTimes(2);
  expect(dispatch).toHaveBeenNthCalledWith(1, setLoadingAction);
  expect(dispatch).toHaveBeenNthCalledWith(2, unsetLoadingAction);

  expect(mockedValidateResponse).toHaveBeenCalledTimes(0);

  expect(mockedSetLoading).toHaveBeenCalledTimes(1);
  expect(mockedSetLoading).toHaveBeenCalledWith(
    'test',
  );

  expect(mockedUnsetLoading).toHaveBeenCalledTimes(1);
  expect(mockedUnsetLoading).toHaveBeenCalledWith(
    'test',
    false,
  );
});

test('should validate response', async () => {
  const response: Response<unknown, unknown> = {
    options: [1, 2, 3],
    additional: 'testAdditional',
  };

  getState.mockReturnValue({
    cache: {},
    inputValue: 'test',
    menuIsOpen: false,
  });

  loadOptions.mockResolvedValue(response);

  mockedValidateResponse.mockReturnValue(false);

  await setup(RequestOptionsCaller.Autoload);

  expect(dispatch).toHaveBeenCalledTimes(2);
  expect(dispatch).toHaveBeenNthCalledWith(1, setLoadingAction);
  expect(dispatch).toHaveBeenNthCalledWith(2, unsetLoadingAction);

  expect(mockedValidateResponse).toHaveBeenCalledTimes(1);
  expect(mockedValidateResponse).toHaveBeenCalledWith(response);

  expect(mockedSetLoading).toHaveBeenCalledTimes(1);
  expect(mockedSetLoading).toHaveBeenCalledWith(
    'test',
  );

  expect(mockedUnsetLoading).toHaveBeenCalledTimes(1);
  expect(mockedUnsetLoading).toHaveBeenCalledWith(
    'test',
    false,
  );
});

test('should not sleep if `debounceTimeout` is 0', async () => {
  await setup(RequestOptionsCaller.Autoload);

  expect(dispatch).toHaveBeenCalledTimes(2);
  expect(dispatch).toHaveBeenNthCalledWith(1, setLoadingAction);
  expect(dispatch).toHaveBeenNthCalledWith(2, onLoadSuccessAction);

  expect(mockedSleep).toHaveBeenCalledTimes(0);
});

test('should not sleep if `debounceTimeout` bigger than 0 and caller is not "input-change"', async () => {
  getParams.mockReturnValue({
    ...defaultParams,
    debounceTimeout: 100,
  });

  await setup(RequestOptionsCaller.Autoload);

  expect(dispatch).toHaveBeenCalledTimes(2);
  expect(dispatch).toHaveBeenNthCalledWith(1, setLoadingAction);
  expect(dispatch).toHaveBeenNthCalledWith(2, onLoadSuccessAction);

  expect(mockedSleep).toHaveBeenCalledTimes(0);
});

test('should sleep if `debounceTimeout` bigger than 0 and caller is "input-change"', async () => {
  getParams.mockReturnValue({
    ...defaultParams,
    debounceTimeout: 100,
  });

  await setup(RequestOptionsCaller.InputChange);

  expect(dispatch).toHaveBeenCalledTimes(2);
  expect(dispatch).toHaveBeenNthCalledWith(1, setLoadingAction);
  expect(dispatch).toHaveBeenNthCalledWith(2, onLoadSuccessAction);

  expect(mockedSleep).toHaveBeenCalledTimes(1);
  expect(mockedSleep).toHaveBeenCalledWith(100);
});

test('should cancel loading if `inputValue` has changed during sleep for empty cache', async () => {
  getState
    .mockReturnValueOnce({
      cache: {},
      inputValue: 'test1',
      menuIsOpen: false,
    })
    .mockReturnValueOnce({
      cache: {},
      inputValue: 'test2',
      menuIsOpen: false,
    });

  getParams.mockReturnValue({
    ...defaultParams,
    debounceTimeout: 100,
  });

  await setup(RequestOptionsCaller.InputChange);

  expect(dispatch).toHaveBeenCalledTimes(2);
  expect(dispatch).toHaveBeenNthCalledWith(1, setLoadingAction);
  expect(dispatch).toHaveBeenNthCalledWith(2, unsetLoadingAction);

  expect(mockedSetLoading).toHaveBeenCalledTimes(1);
  expect(mockedSetLoading).toHaveBeenCalledWith(
    'test1',
  );

  expect(mockedUnsetLoading).toHaveBeenCalledTimes(1);
  expect(mockedUnsetLoading).toHaveBeenCalledWith(
    'test1',
    true,
  );
});

test('should cancel loading if `inputValue` has changed during sleep for filled cache', async () => {
  getState
    .mockReturnValueOnce({
      cache: {
        test1: defaultCacheItem,
      },
      inputValue: 'test1',
      menuIsOpen: false,
    })
    .mockReturnValueOnce({
      cache: {},
      inputValue: 'test2',
      menuIsOpen: false,
    });

  getParams.mockReturnValue({
    ...defaultParams,
    debounceTimeout: 100,
  });

  await setup(RequestOptionsCaller.InputChange);

  expect(dispatch).toHaveBeenCalledTimes(2);
  expect(dispatch).toHaveBeenNthCalledWith(1, setLoadingAction);
  expect(dispatch).toHaveBeenNthCalledWith(2, unsetLoadingAction);

  expect(mockedSetLoading).toHaveBeenCalledTimes(1);
  expect(mockedSetLoading).toHaveBeenCalledWith(
    'test1',
  );

  expect(mockedUnsetLoading).toHaveBeenCalledTimes(1);
  expect(mockedUnsetLoading).toHaveBeenCalledWith(
    'test1',
    false,
  );
});
