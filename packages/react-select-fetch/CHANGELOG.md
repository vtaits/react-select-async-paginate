## 0.5.6 (06 dec 2024)

### Improvement

- Support `react` 19

## 0.5.5 (19 sep 2024)

### New features

- Added `reloadOnErrorTimeout` prop [#173](https://github.com/vtaits/react-select-async-paginate/issues/173)

## 0.5.2 (11 apr 2024)

### Internal changes

- Migrate `eslint` -> `@biomejs/biome`
- Migrate `jest` -> `vitest`

## 0.5.1 (23 jun 2023)

### Bugfix

- Fixed types import in modern environments [#150](https://github.com/vtaits/react-select-async-paginate/issues/150)

### Improvement

- Migrate `defaultProps` to default arguments [#147](https://github.com/vtaits/react-select-async-paginate/issues/147)

## 0.5.0 (06 oct 2022)

- Improved typing
- Types are strict now

## 0.4.0 (28 sep 2021)

Migrate to `react-select` v5

## 0.3.2 (02 jun 2021)

- Support `react-select@^4.0.0` in `peerDependencies`

## 0.3.1 (05 dec 2020)

- Fixed `typescript` crash with latest `@types/react-select`

## 0.3.0 (26 nov 2020)

### Internal changes

- Migrate to [new JSX transform](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html)

### Breaking changes

- Drop `react` less than `16.14.0`

## 0.2.1 (30 sep 2020)

### New features

- Add `initialPage` and `defaultInitialPage` props

### Bugfix

- Fixed page number in query if `options` or `defaultOptions` defined

## 0.2.0-alpha.1

### Breaking changes

- `withSelectFetchBase` is removed. `withSelectFetch` supports `inputValue`, `menuIsOpen`, `onInputChange`, `onMenuClose`, `onMenuOpen` now.

## 0.2.0-alpha.0

The project was fully rewritten to **typescript** and **react hooks**.

### Breaking changes

- `withSelectFetch` now works with `react-select`-like components instead of `react-select-async-paginate`-like components
