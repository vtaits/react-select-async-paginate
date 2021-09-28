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
