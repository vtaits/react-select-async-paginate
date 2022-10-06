import type {
  GroupBase,
} from 'react-select';

import type {
  Response,
} from './types';

export const errorText = '[react-select-async-paginate] response of "loadOptions" should be an object with "options" prop, which contains array of options.';

export const checkIsResponse = <OptionType, Group extends GroupBase<OptionType>, Additional>(
  response: unknown,
): response is Response<OptionType, Group, Additional> => {
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

export const validateResponse = <OptionType, Group extends GroupBase<OptionType>, Additional>(
  response: unknown,
): response is Response<OptionType, Group, Additional> => {
  if (!checkIsResponse(response)) {
    // eslint-disable-next-line no-console
    console.error(errorText, 'Received:', response);
    throw new Error(errorText);
  }

  return true;
};
