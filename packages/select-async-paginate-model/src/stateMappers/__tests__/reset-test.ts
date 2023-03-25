import { reset } from '../reset';

test('should reset cache', () => {
  expect(reset({
    inputValue: 'input',
    menuIsOpen: true,
    cache: {
      test: {
        hasMore: false,
        isFirstLoad: false,
        isLoading: false,
        options: [1, 2, 3],
      },
    },
  })).toEqual({
    inputValue: 'input',
    menuIsOpen: true,
    cache: {},
  });
});
