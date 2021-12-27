import {
  MenuList,
  useComponentsPure,
} from '../useComponents';

const defaultUseMemo = (callback: () => any): any => callback();

test('should provide correct deps to useMemo', () => {
  function Test() {
    return <div />;
  }

  const useMemo = jest.fn();

  const components = {
    Menu: Test,
  };

  useComponentsPure(useMemo, components);

  expect(useMemo).toHaveBeenCalledTimes(1);
  expect(useMemo.mock.calls[0][1]).toEqual([components]);
});

test('should add MenuList to existing components', () => {
  function Test() {
    return <div />;
  }

  const components = {
    Menu: Test,
  };

  const result = useComponentsPure(defaultUseMemo, components);

  expect(result).toEqual({
    Menu: Test,
    MenuList,
  });
});

test('should redefine MenuList', () => {
  function Test() {
    return <div />;
  }

  const components = {
    MenuList: Test,
  };

  const result = useComponentsPure(defaultUseMemo, components);

  expect(result).toEqual({
    MenuList: Test,
  });
});
