import { stringifyParams } from '../stringifyParams';
import { getPure } from '../get';

jest.mock('../stringifyParams');

beforeEach(() => {
  (stringifyParams as jest.Mock).mockReturnValue('');
});

afterEach(() => {
  jest.clearAllMocks();
});

test('should return response', async () => {
  const testResponse = {
    key: 'value',
  };

  const response = await getPure(
    (async () => ({
      json: async (): Promise<any> => testResponse,
    })) as unknown as typeof fetch,
    '/test/',
    {},
  );

  expect(response).toBe(testResponse);
});

test('should throw an error if fetch failed', async () => {
  let hasError = false;

  try {
    await getPure(
      (async () => {
        throw new Error();
      }) as unknown as typeof fetch,
      '/test/',
      {},
    );
  } catch (e) {
    hasError = true;
  }

  expect(hasError).toBe(true);
});

test('should throw an error if status of response bigger than 400', async () => {
  let hasError = false;

  try {
    await getPure(
      (async () => ({
        status: 405,
      })) as unknown as typeof fetch,
      '/test/',
      {},
    );
  } catch (e) {
    hasError = true;
  }

  expect(hasError).toBe(true);
});

test('should throw an error if status of response is 400', async () => {
  let hasError = false;

  try {
    await getPure(
      (async () => ({
        status: 400,
      })) as unknown as typeof fetch,
      '/test/',
      {},
    );
  } catch (e) {
    hasError = true;
  }

  expect(hasError).toBe(true);
});

test('should call stringifyParams with correct params', async () => {
  const params = {
    key: 'value',
  };

  await getPure(
    (async () => ({
      json: async (): Promise<any> => ({}),
    })) as unknown as typeof fetch,
    '/test/',
    params,
  );

  expect(stringifyParams).toHaveBeenCalledTimes(1);
  expect(stringifyParams).toHaveBeenCalledWith(params);
});

test('should call fetch with correct params', async () => {
  const fetchMock = jest.fn()
    .mockResolvedValue({
      json: async (): Promise<any> => ({}),
    });

  (stringifyParams as jest.Mock).mockReturnValue('paramsStr');

  await getPure(
    fetchMock as unknown as typeof fetch,
    '/test/',
    {},
  );

  expect(fetchMock).toBeCalledTimes(1);
  expect(fetchMock).toBeCalledWith('/test/?paramsStr', {
    credentials: 'same-origin',
  });
});
