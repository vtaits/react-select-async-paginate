import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';

import { stringifyParams } from '../stringifyParams';
import { get } from '../get';

jest.mock('../stringifyParams');

enableFetchMocks();

const mockedStringifyParams = jest.mocked(stringifyParams);

beforeEach(() => {
  fetchMock.doMock();
  mockedStringifyParams.mockReturnValue('');
});

afterEach(() => {
  jest.clearAllMocks();
});

test('should return response', async () => {
  const testResponse = {
    key: 'value',
  };

  fetchMock.mockResponseOnce(JSON.stringify(testResponse));

  const response = await get(
    'https://test/',
    {},
  );

  expect(response).toEqual(testResponse);
});

test('should throw an error if fetch failed', async () => {
  let hasError = false;

  fetchMock.mockRejectOnce(new Error());

  try {
    await get(
      'https://test/',
      {},
    );
  } catch (e) {
    hasError = true;
  }

  expect(hasError).toBe(true);
});

test('should throw an error if status of response bigger than 400', async () => {
  let hasError = false;

  fetchMock.mockResponseOnce('', {
    status: 405,
  });

  try {
    await get(
      'https://test/',
      {},
    );
  } catch (e) {
    hasError = true;
  }

  expect(hasError).toBe(true);
});

test('should throw an error if status of response is 400', async () => {
  let hasError = false;

  fetchMock.mockResponseOnce('', {
    status: 400,
  });

  try {
    await get(
      'https://test/',
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

  fetchMock.mockResponseOnce('{}');

  await get(
    'https://test/',
    params,
  );

  expect(mockedStringifyParams).toHaveBeenCalledTimes(1);
  expect(mockedStringifyParams).toHaveBeenCalledWith(params);
});

test('should call fetch with correct params', async () => {
  fetchMock.mockResponseOnce('{}');

  mockedStringifyParams.mockReturnValue('paramsStr');

  await get(
    'https://test/',
    {},
  );

  expect(fetchMock).toHaveBeenCalledTimes(1);
  expect(fetchMock).toHaveBeenCalledWith('https://test/?paramsStr', {
    credentials: 'same-origin',
  });
});
