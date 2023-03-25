import { setInputValue } from '../setInputValue';

test('should set input value', () => {
  expect(setInputValue({
    inputValue: 'test1',
    menuIsOpen: true,
    cache: {
      test: {
        hasMore: false,
        isFirstLoad: false,
        isLoading: false,
        options: [1, 2, 3],
      },
    },
  }, {
    inputValue: 'test2',
  })).toEqual({
    inputValue: 'test2',
    menuIsOpen: true,
    cache: {
      test: {
        hasMore: false,
        isFirstLoad: false,
        isLoading: false,
        options: [1, 2, 3],
      },
    },
  });
});
