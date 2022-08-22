import { stringifyParams } from './stringifyParams';

export const getPure = async (
  fetchParam: typeof fetch,
  url: string,
  params: Record<string, unknown>,
): Promise<any> => {
  const paramsStr = stringifyParams(params);

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
  params: Record<string, unknown>,
): Promise<any> => getPure(
  fetch,
  url,
  params,
);
