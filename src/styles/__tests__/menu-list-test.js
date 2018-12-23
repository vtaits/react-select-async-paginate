import menuList from '../menu-list';

test('should return base styles and height = 1 on first load', () => {
  const result = menuList({
    width: 300,
    padding: 10,
  }, {
    selectProps: {
      isFirstLoad: true,
    },
  });

  expect(result).toEqual({
    width: 300,
    padding: 10,
    height: 1,
  });
});

test('should return only base styles on not first load', () => {
  const result = menuList({
    width: 300,
    padding: 10,
  }, {
    selectProps: {
      isFirstLoad: false,
    },
  });

  expect(result).toEqual({
    width: 300,
    padding: 10,
  });
});
