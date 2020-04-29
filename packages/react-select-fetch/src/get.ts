import qs from 'qs';

export const stringifyParams = (params: Record<string, any>): string => qs.stringify(params, {
  arrayFormat: 'repeat',
});

export const getPure = async (
  fetchParam: typeof fetch,
  stringifyParamsParam: typeof stringifyParams,
  url: string,
  params: Record<string, any>,
): Promise<any> => {
  const paramsStr: string = stringifyParamsParam(params);

  const response: Response = await fetchParam(`${url}?${paramsStr}`, {
    credentials: 'same-origin',
  });

  if (response.status >= 400) {
    throw new Error('Failed to fetch');
  }

  const responseJSON: any = await response.json();

  return responseJSON;
};

export const get = (
  url: string,
  params: Record<string, any>,
): Promise<any> => getPure(
  fetch,
  stringifyParams,
  url,
  params,
);
