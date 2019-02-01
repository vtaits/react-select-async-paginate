[![NPM](https://img.shields.io/npm/v/react-select-async-paginate.svg)](https://www.npmjs.com/package/react-select-async-paginate)
[![Build Status](https://img.shields.io/travis/vtaits/react-select-async-paginate.svg?style=flat)](https://travis-ci.org/vtaits/react-select-async-paginate)
[![codecov.io](https://codecov.io/gh/vtaits/react-select-async-paginate/branch/master/graph/badge.svg)](https://codecov.io/gh/vtaits/react-select-async-paginate)

# react-select-async-paginate

Wrapper above `react-select` that supports pagination on menu scroll.

## Sandbox examples

- [Simple](https://codesandbox.io/s/o75rno2w65)
- [Multi](https://codesandbox.io/s/2323yrlo9r)
- [Initial options](https://codesandbox.io/s/q111nqw9j)
- [Debounce](https://codesandbox.io/s/5y2xq39v5k)
- [Request by page number](https://codesandbox.io/s/10r1k12vk7)
- [Customization check of the need of load options](https://codesandbox.io/s/kokz6j65zv)
- [Grouped options](https://codesandbox.io/s/oxv62x8j4y)
- [Custom select base](https://codesandbox.io/s/l2pjrv0ryl)

## Versions

| react-select | react-select-async-paginate |
|--------------|-----------------------------|
| 2.x | 0.2.x |
| 1.x | 0.1.x |

## Installation

```
npm install react-select react-select-async-paginate
```

or

```
yarn add react-select react-select-async-paginate
```

## Usage

`AsyncPaginate` is an alternative of `Async` but supports loading page by page. It is wrapper above default `react-select` thus it accepts all props of default `Select` except `isLoading`. And there are some new props:

### loadOptions

Required. Async function that take next arguments:

1. Current value of search input.
2. Loaded options for current search.
3. Collected additional data e.g. current page number etc. For first load it is `additional` from props, for next is `additional` from previous response for current search. `null` by default.

It should return next object:

```
{
  options: Array,
  hasMore: boolean,
  additional?: any,
}
```

It similar to `loadOptions` from `Select.Async` but there is some differences:

1. Loaded options as 2nd argument.
2. Additional data as 3nd argument.
3. Not supports callback.
4. Should return `hasMore` for detect end of options list for current search.

### debounceTimeout

Not required. Number. Debounce timeout for `loadOptions` calls. `0` by default.

### additional

Not required. Default `additional` for first request for every search.

### shouldLoadMore

Not required. Function. By default new options will load only after scroll menu to bottom. Arguments:

- scrollHeight
- clientHeight
- scrollTop

Should return boolean.

### reduceOptions

Not required. Function. By default new loaded options are concat with previous. Arguments:

- previous options
- loaded options
- next additional

Should return new options.

### cacheUniq

Not required. Can take any value. When this prop changed, `AsyncPaginate` cleans all cached options.

### selectRef

Ref for take `react-select` instance.

## SelectComponent

Not required. React component that will be used instead of `SelectBase` from `react-select`.

## Example

### offset way

```
import AsyncPaginate from 'react-select-async-paginate';

...

/*
 * assuming the API returns something like this:
 *   const json = {
 *     results: [
 *       {
 *         value: 1,
 *         label: 'Audi',
 *       },
 *       {
 *         value: 2,
 *         label: 'Mercedes',
 *       },
 *       {
 *         value: 3,
 *         label: 'BMW',
 *       },
 *     ],
 *     has_more: true,
 *   };
 */

async function loadOptions(search, loadedOptions) {
  const response = await fetch(`/awesome-api-url/?search=${search}&offset=${loadedOptions.length}`);
  const responseJSON = await response.json();

  return {
    options: responseJSON.results,
    hasMore: responseJSON.has_more,
  };
}

<AsyncPaginate
  value={value}
  loadOptions={loadOptions}
  onChange={setValue}
/>
```

### page way

```
import AsyncPaginate from 'react-select-async-paginate';

...

async function loadOptions(search, loadedOptions, { page }) {
  const response = await fetch(`/awesome-api-url/?search=${search}&page=${page}`);
  const responseJSON = await response.json();

  return {
    options: responseJSON.results,
    hasMore: responseJSON.has_more,
    additional: {
      page: page + 1,
    },
  };
}

<AsyncPaginate
  value={value}
  loadOptions={loadOptions}
  onChange={setValue}
  additional={{
    page: 1,
  }}
/>
```

## Grouped options

You can use `reduceGroupedOptions` util to group options by `label` key.

```
import AsyncPaginate, { reduceGroupedOptions } from 'react-select-async-paginate';

/*
 * assuming the API returns something like this:
 *   const json = {
 *     options: [
 *       label: 'Cars',
 *       options: [
 *         {
 *           value: 1,
 *           label: 'Audi',
 *         },
 *         {
 *           value: 2,
 *           label: 'Mercedes',
 *         },
 *         {
 *           value: 3,
 *           label: 'BMW',
 *         },
 *       ]
 *     ],
 *     hasMore: true,
 *   };
 */

...

<AsyncPaginate
  {...otherProps}
  reduceOptions={reduceGroupedOptions}
/>
```

## Replacing Components

Usage of replacing components is similar with `react-select`, but there is one difference. If you redefine `MenuList` you should wrap it with `wrapMenuList` for workaround of some internal bugs of `react-select`.

```
import AsyncPaginate, { wrapMenuList } from 'react-select-async-paginate';

...

const MenuList = wrapMenuList(CustomMenuList);

<AsyncPaginate
  {...otherProps}
  components={{
    ...otherComponents,
    MenuList,
  }}
/>
```
