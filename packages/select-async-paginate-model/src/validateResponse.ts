import type {
  Response,
} from './types/public';

export const errorText = '[select-async-paginate-model] response of "loadOptions" should be an object with "options" prop, which contains array of options.';

export const checkIsResponse = <OptionType, Additional>(
  response: unknown,
): response is Response<OptionType, Additional> => {
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

export const validateResponse = <OptionType, Additional>(
  response: unknown,
): response is Response<OptionType, Additional> => {
  if (!checkIsResponse(response)) {
    // eslint-disable-next-line no-console
    console.error(errorText, 'Received:', response);
    throw new Error(errorText);
  }

  return true;
};
