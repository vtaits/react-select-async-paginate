import React from 'react';
import type {
  FC,
} from 'react';

import {
  MenuList,
  useComponentsPure,
} from '../useComponents';

const defaultUseMemo = (callback: () => any): any => callback();

test('should provide correct deps to useMemo', () => {
  const Test: FC = () => <div />;
  const useMemo = jest.fn();

  const components = {
    Menu: Test,
  };

  useComponentsPure(useMemo, components);

  expect(useMemo.mock.calls.length).toBe(1);
  expect(useMemo.mock.calls[0][1]).toEqual([components]);
});

test('should add MenuList to existing components', () => {
  const Test: FC = () => <div />;

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
  const Test: FC = () => <div />;

  const components = {
    MenuList: Test,
  };

  const result = useComponentsPure(defaultUseMemo, components);

  expect(result).toEqual({
    MenuList: Test,
  });
});
