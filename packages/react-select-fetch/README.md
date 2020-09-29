[![NPM](https://img.shields.io/npm/v/react-select-fetch.svg)](https://www.npmjs.com/package/react-select-fetch)
[![Build Status](https://img.shields.io/travis/vtaits/react-select-async-paginate.svg?style=flat)](https://travis-ci.org/vtaits/react-select-async-paginate)
[![codecov.io](https://codecov.io/gh/vtaits/react-select-async-paginate/branch/master/graph/badge.svg)](https://codecov.io/gh/vtaits/react-select-async-paginate)
[![dependencies status](https://david-dm.org/vtaits/react-select-async-paginate/status.svg?path=packages/react-select-fetch)](https://david-dm.org/vtaits/react-select-async-paginate?path=packages/react-select-fetch)
[![devDependencies status](https://david-dm.org/vtaits/react-select-async-paginate/dev-status.svg?path=packages/react-select-fetch)](https://david-dm.org/vtaits/react-select-async-paginate?path=packages/react-select-fetch&type=dev)
[![Types](https://img.shields.io/npm/types/react-select-fetch.svg)](https://www.npmjs.com/package/react-select-fetch)

# react-select-fetch

Wrapper above `react-select-async-paginate` that loads options from specified url.

## Sandbox examples

- [Simple](https://codesandbox.io/s/9nfmg)
- [Manual control of input value and menu opening](https://codesandbox.io/s/34pjt)
- [Initial options](https://codesandbox.io/s/8cgpp)

## Installation

```
npm install react-select react-select-async-paginate react-select-fetch
```

or

```
yarn add react-select react-select-async-paginate react-select-fetch
```

## Motivation

Abstractions are wonderful but the most common task for async select is load list of options by specified url and query params. E.g.

```javascript
// With SelectFetch

import { SelectFetch } from 'react-select-fetch';

...

<SelectFetch
  value={value}
  url="/awesome-api-url/"
  mapResponse={(response) => ({
    options: response.results,
    hasMore: response.has_more,
  })}
  onChange={setValue}
/>
```

```javascript
// Without SelectFetch

import { AsyncPaginate } from 'react-select-async-paginate';

...

<AsyncPaginate
  value={value}
  loadOptions={async (search, loadedOptions, { page }) => {
    const response = await fetch(`/awesome-api-url/?search=${search}&page=${page}`);
    const responseJSON = await response.json();

    return {
      options: responseJSON.results,
      hasMore: responseJSON.has_more,
      additional: {
        page: page + 1,
      },
    };
  }}
  onChange={setValue}
  additional={{
    page: 1,
  }}
/>
```

## Props

`SelectFetch` receives props of `react-select` and `react-select-async-paginate`. And there are some new props:

### url

Required. String.

### queryParams

Not required. Object. Object of permanent query params for requests.

### searchParamName

Not required. String. Name of param that contains value of search input. `"search"` by default.

### pageParamName

Not required. String. Name of param that contains index of loaded page. Starts from `1`. `"page"` by default.

### offsetParamName

Not required. String. Name of param that contains number of loaded optons. `"offset"` by default.

### mapResponse

Not required. Function. Mapper from server's response to format of `react-select-async-paginate`. Arguments:

  1. `response` - response of server;

  2. `payload` - object:

    - `payload.search` - current search;
    - `payload.prevPage` - page number before requrest;
    - `payload.prevOptions` - options before request;

### initialPage

Not required. Page number for first request for every search. `1` by default.

### defaultInitialPage

Not required. Page number for first request for empty search if `options` or `defaultOptions` defined. `2` by default.

### get

Not required. Async function. Arguments:

1. url;
2. object of query params;

Should return parsed response of server.

Example with `axios`:

```javascript
import axios from 'axios';

...

const get = async (url, params) => {
  const response = await axios.get(url, {
    params,
  });

  return response.data;
};
```

## Replacing react-select component

You can use `withSelectFetch` HOC.

```javascript
import { withSelectFetch } from 'react-select-fetch';

...

const CustomSelectFetch = withSelectFetch(CustomSelect);
```
