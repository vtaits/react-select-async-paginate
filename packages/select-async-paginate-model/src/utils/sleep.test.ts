import { expect, test, vi } from "vitest";
import { sleep } from "./sleep";

vi.useFakeTimers();
vi.spyOn(global, "setTimeout");

const mockedSetTimeout = vi.mocked(setTimeout);

test("sholud resolve from `setTimeout`", async () => {
	const onComplete = vi.fn();

	const delay = 123;

	const promise = sleep(delay).then(onComplete);

	expect(onComplete).toHaveBeenCalledTimes(0);

	expect(mockedSetTimeout).toHaveBeenCalledTimes(1);
	expect(mockedSetTimeout.mock.calls[0][1]).toBe(delay);

	const handler = mockedSetTimeout.mock.calls[0][0];

	if (typeof handler !== "function") {
		throw new Error("timeout handler is not a function");
	}

	handler();

	await promise;

	expect(onComplete).toHaveBeenCalledTimes(1);
});
