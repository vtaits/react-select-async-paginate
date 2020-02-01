import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import AsyncPaginate from 'react-select-async-paginate';

import defaultGet from './defaultGet';

export const defaultAdditional = {
  page: 1,
};

export const defaultResponseMapper = (response) => response;

const SelectFetch = (props) => {
  const {
    url,
    queryParams,
    searchParamName,
    pageParamName,
    offsetParamName,
    mapResponse,
    get,

    ...rest
  } = props;

  const loadOptions = useCallback(
    async (q, loadedOptions, { page }) => {
      const params = {
        ...queryParams,
        [searchParamName]: q,
      };

      if (pageParamName) {
        params[pageParamName] = page;
      }

      if (offsetParamName) {
        params[offsetParamName] = loadedOptions.length;
      }

      let responseRaw;
      let hasError = false;

      try {
        responseRaw = await get(url, params);
      } catch (e) {
        hasError = true;
      }

      if (hasError) {
        return {
          options: [],
          hasMore: false,
        };
      }

      const response = mapResponse(responseRaw);

      return {
        ...response,

        additional: {
          page: page + 1,
        },
      };
    },

    [
      url,
      queryParams,
      searchParamName,
      pageParamName,
      offsetParamName,
      mapResponse,
      get,
    ],
  );

  return (
    <AsyncPaginate
      {...rest}
      additional={defaultAdditional}
      loadOptions={loadOptions}
    />
  );
};

SelectFetch.propTypes = {
  url: PropTypes.string.isRequired,
  queryParams: PropTypes.objectOf(PropTypes.any),
  searchParamName: PropTypes.string,
  pageParamName: PropTypes.string,
  offsetParamName: PropTypes.string,
  mapResponse: PropTypes.func,
  get: PropTypes.func,
};

SelectFetch.defaultProps = {
  queryParams: {},
  searchParamName: 'search',
  pageParamName: 'page',
  offsetParamName: null,
  mapResponse: defaultResponseMapper,
  get: defaultGet,
};

export default SelectFetch;
