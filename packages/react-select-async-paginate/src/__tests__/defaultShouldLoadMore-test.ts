import { defaultShouldLoadMore } from '../defaultShouldLoadMore';

test('should load more', () => {
  expect(defaultShouldLoadMore(
    600,
    300,
    295,
  )).toBe(true);
});

test('should not load more', () => {
  expect(defaultShouldLoadMore(
    600,
    300,
    285,
  )).toBe(false);
});
