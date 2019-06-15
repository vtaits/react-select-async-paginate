## 0.3.4 (15 jun 2019)

### Bugfix

- Changed TypeScript typings

## 0.3.3 (06 jun 2019)

### New features

- Added TypeScript typings

## 0.3.2 (03 jun 2019)

### New features

- Support `react-select` v3

## 0.3.1 (24 may 2019)

### Bugfix

- Disabled filtering of options in select by default.

## 0.3.0 (25 apr 2019)

### New features

- Moved logic of opening and closing menu to `AsyncPaginateBase`.

### Breaking changes

- `AsyncPaginateBase` now requires `menuIsOpen` prop.
- `AsyncPaginate` not supports `onMenuOpen` and `onMenuClose`. You should use `AsyncPaginateBase` for those cases now.

## 0.2.9 (25 mar 2019)

### New features

- Added `AsyncPaginateBase` component for manual control of input value.
- Added `onMenuClose` and `onMenuOpen` callbacks.

## 0.2.8 (31 jan 2019)

### New features

- Added `SelectComponent` prop for usage of custom base select component.

## 0.2.7 (23 jan 2019)

### New features

- Added `reduceOptions` prop for reduce grouped options from different groups into one.
- Added `reduceGroupedOptions` util.

## 0.2.6 (15 jan 2019)

### New features

- Added `shouldLoadMore` prop.

## 0.2.5 (11 jan 2019)

### New features

- Added `debounceTimeout` prop.
- Added `additional` prop for collect additional data of requests (e.g. current page number).
