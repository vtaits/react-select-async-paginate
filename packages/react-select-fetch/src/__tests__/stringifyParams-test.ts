import { stringifyParams } from '../stringifyParams';

test('should stringify params', () => {
  expect(stringifyParams({
    param1: 'value1',
    param2: ['value2', 'value3'],
  })).toBe('param1=value1&param2=value2&param2=value3');
});
