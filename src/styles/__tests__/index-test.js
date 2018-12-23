import menu from '../menu';
import menuList from '../menu-list';

import mergeStyles, { mergeStylesItem } from '../index';

test('should return base function if second not defined', () => {
  const base = jest.fn();

  const merged = mergeStylesItem(base, null);

  expect(merged).toBe(base);
});

test('should call base and additional function with correct arguments', () => {
  const base = jest.fn(() => 'Intermediate');
  const additional = jest.fn(() => 'Result');

  const merged = mergeStylesItem(base, additional);

  const result = merged('Base', 2, 3);

  expect(base.mock.calls.length).toBe(1);
  expect(base.mock.calls[0]).toEqual(['Base', 2, 3]);

  expect(additional.mock.calls.length).toBe(1);
  expect(additional.mock.calls[0]).toEqual(['Intermediate', 2, 3]);

  expect(result).toBe('Result');
});

test('should merge styles', () => {
  const style1 = jest.fn();
  const style2 = jest.fn();

  const mergedStyles = mergeStyles({
    style1,
    style2,
  });

  expect(mergedStyles.style1).toBe(style1);
  expect(mergedStyles.style2).toBe(style2);
  expect(mergedStyles.menu).toBe(menu);
  expect(mergedStyles.menuList).toBe(menuList);
});
