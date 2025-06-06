import { afterEach, beforeEach, expect, test, vi } from "vitest";
import createFetchMock from "vitest-fetch-mock";
import { get } from "./get";

const fetchMocker = createFetchMock(vi);
fetchMocker.enableMocks();

beforeEach(() => {
	fetchMock.doMock();
});

afterEach(() => {
	vi.clearAllMocks();
});

test("should return response", async () => {
	const testResponse = {
		key: "value",
	};

	fetchMock.mockResponseOnce(JSON.stringify(testResponse));

	const response = await get("https://test/", {});

	expect(response).toEqual(testResponse);
});

test("should throw an error if fetch failed", async () => {
	let hasError = false;

	fetchMock.mockRejectOnce(new Error());

	try {
		await get("https://test/", {});
	} catch (e) {
		hasError = true;
	}

	expect(hasError).toBe(true);
});

test("should throw an error if status of response bigger than 400", async () => {
	let hasError = false;

	fetchMock.mockResponseOnce("", {
		status: 405,
	});

	try {
		await get("https://test/", {});
	} catch (e) {
		hasError = true;
	}

	expect(hasError).toBe(true);
});

test("should throw an error if status of response is 400", async () => {
	let hasError = false;

	fetchMock.mockResponseOnce("", {
		status: 400,
	});

	try {
		await get("https://test/", {});
	} catch (e) {
		hasError = true;
	}

	expect(hasError).toBe(true);
});

test("should call stringifyParams with correct params", async () => {
	const params = {
		key: "value",
	};

	fetchMock.mockResponseOnce("{}");

	await get("https://test/", params);
});

test("should call fetch with correct params", async () => {
	fetchMock.mockResponseOnce("{}");

	await get("https://test/", {
		foo: "bar",
	});

	expect(fetchMock).toHaveBeenCalledTimes(1);
	expect(fetchMock).toHaveBeenCalledWith("https://test/?foo=bar", {
		credentials: "same-origin",
	});
});
