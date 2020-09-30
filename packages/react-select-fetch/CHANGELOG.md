## 0.2.1 (30 sep 2020)

### New features

- Add `initialPage` and `defaultInitialPage` props

### Bugfix

- Fixed page number in query if `options` or `defaultOptions` defined

## 0.2.0-alpha.1

### Breaking changes

* `withSelectFetchBase` is removed. `withSelectFetch` supports `inputValue`, `menuIsOpen`, `onInputChange`, `onMenuClose`, `onMenuOpen` now.

## 0.2.0-alpha.0

The project was fully rewritten to **typescript** and **react hooks**.

### Breaking changes

* `withSelectFetch` now works with `react-select`-like components instead of `react-select-async-paginate`-like components
