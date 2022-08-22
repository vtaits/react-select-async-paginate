import type {
  GroupBase,
} from 'react-select';

import type {
  Response,
} from './types';

export const errorText = '[react-select-async-paginate] response of "loadOptions" should be an object with "options" prop, which contains array of options.';

export const checkIsResponse = (
  response: unknown,
): response is Response<unknown, GroupBase<unknown>, unknown> => {
  if (!response) {
    return false;
  }

  const {
    options,
    hasMore,
  } = response as {
    options?: unknown;
    hasMore?: unknown;
  };

  if (!Array.isArray(options)) {
    return false;
  }

  if (typeof hasMore !== 'boolean' && typeof hasMore !== 'undefined') {
    return false;
  }

  return true;
};

export const validateResponse = (response: unknown): void => {
  if (!checkIsResponse(response)) {
    console.error(errorText, 'Received:', response);
    throw new Error(errorText);
  }
};
