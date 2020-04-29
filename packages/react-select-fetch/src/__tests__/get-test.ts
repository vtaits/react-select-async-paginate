import {
  stringifyParams,
  getPure,
} from '../get';

describe('stringifyParams', () => {
  test('should stringify params', () => {
    expect(stringifyParams({
      param1: 'value1',
      param2: ['value2', 'value3'],
    })).toBe('param1=value1&param2=value2&param2=value3');
  });
});

describe('getPure', () => {
  test('should return response', async () => {
    const testResponse = {
      key: 'value',
    };

    const response = await getPure(
      (async () => ({
        json: async (): Promise<any> => testResponse,
      })) as unknown as typeof fetch,
      () => '',
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
        () => '',
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
        () => '',
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
        () => '',
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

    const stringifyParamsMock = jest.fn();

    await getPure(
      (async () => ({
        json: async (): Promise<any> => ({}),
      })) as unknown as typeof fetch,
      stringifyParamsMock,
      '/test/',
      params,
    );

    expect(stringifyParamsMock).toBeCalledTimes(1);
    expect(stringifyParamsMock).toBeCalledWith(params);
  });

  test('should call fetch with correct params', async () => {
    const fetchMock = jest.fn(async () => ({
      json: async (): Promise<any> => ({}),
    }));

    await getPure(
      fetchMock as unknown as typeof fetch,
      () => 'paramsStr',
      '/test/',
      {},
    );

    expect(fetchMock).toBeCalledTimes(1);
    expect(fetchMock).toBeCalledWith('/test/?paramsStr', {
      credentials: 'same-origin',
    });
  });
});
