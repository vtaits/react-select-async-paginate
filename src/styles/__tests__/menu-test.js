import menu from '../menu';

test('should return base styles and opacity = 0 on first load', () => {
  const result = menu({
    width: 300,
    height: 150,
  }, {
    selectProps: {
      isFirstLoad: true,
    },
  });

  expect(result).toEqual({
    width: 300,
    height: 150,
    opacity: 0,
  });
});

test('should return only base styles on not first load', () => {
  const result = menu({
    width: 300,
    height: 150,
  }, {
    selectProps: {
      isFirstLoad: false,
    },
  });

  expect(result).toEqual({
    width: 300,
    height: 150,
  });
});
