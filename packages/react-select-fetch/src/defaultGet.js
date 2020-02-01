import qs from 'qs';

export const stringifyParams = (params) => qs.stringify(params, {
  arrayFormat: 'repeat',
});

const get = async (url, params) => {
  const paramsStr = stringifyParams(params);

  const response = await fetch(`${url}?${paramsStr}`, {
    credentials: 'same-origin',
  });

  if (response.status >= 400) {
    throw new Error('Failed to fetch');
  }

  const responseJSON = await response.json();

  return responseJSON;
};

export default get;
