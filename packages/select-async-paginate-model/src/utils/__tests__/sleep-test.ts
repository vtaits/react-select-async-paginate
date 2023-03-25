import { sleep } from '../sleep';

jest.useFakeTimers();
jest.spyOn(global, 'setTimeout');

const mockedSetTimeout = jest.mocked(setTimeout);

test('sholud resolve from `setTimeout`', async () => {
  const onComplete = jest.fn();

  const delay = 123;

  const promise = sleep(delay).then(onComplete);

  expect(onComplete).toHaveBeenCalledTimes(0);

  expect(mockedSetTimeout).toHaveBeenCalledTimes(1);
  expect(mockedSetTimeout.mock.calls[0][1]).toBe(delay);

  mockedSetTimeout.mock.calls[0][0]();

  await promise;

  expect(onComplete).toHaveBeenCalledTimes(1);
});
