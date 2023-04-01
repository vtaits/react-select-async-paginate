import { requestOptions } from '../requestOptions';

import { loadMore } from '../loadMore';

import {
  RequestOptionsCaller,
} from '../../types/internal';

jest.mock('../requestOptions');
const mockedRequestOptions = jest.mocked(requestOptions);

beforeEach(() => {
  jest.clearAllMocks();
});

const loadMoreThunkAction = loadMore();

test('should call not load options if cache is not defined for current input', () => {
  const dispatch = jest.fn();

  loadMoreThunkAction(
    dispatch,
    jest.fn().mockReturnValue({
      cache: {},
      inputValue: 'test',
      menuIsOpen: false,
    }),
  );

  expect(mockedRequestOptions).toHaveBeenCalledTimes(0);

  expect(dispatch).toHaveBeenCalledTimes(0);
});

test('should call not load options if cache is defined for current input', () => {
  const dispatch = jest.fn();

  const requestOptionsThunkAction = jest.fn();
  mockedRequestOptions.mockReturnValue(requestOptionsThunkAction);

  loadMoreThunkAction(
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
      menuIsOpen: false,
    }),
  );

  expect(mockedRequestOptions).toHaveBeenCalledTimes(1);
  expect(mockedRequestOptions).toHaveBeenCalledWith(RequestOptionsCaller.MenuScroll);

  expect(dispatch).toHaveBeenCalledTimes(1);
  expect(dispatch).toHaveBeenCalledWith(requestOptionsThunkAction);
});
