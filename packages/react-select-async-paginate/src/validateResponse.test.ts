import { afterAll, describe, expect, test, vi } from "vitest";
import {
	checkIsResponse,
	errorText,
	validateResponse,
} from "./validateResponse";

describe("checkIsResponse", () => {
	test("should return false if response is falsy", () => {
		expect(checkIsResponse(null)).toBe(false);
	});

	test("should return false if list of options is not an array", () => {
		expect(
			checkIsResponse({
				options: 123,
			}),
		).toBe(false);
	});

	test("should return false if `hasMore` is not boolean or undefined", () => {
		expect(
			checkIsResponse({
				options: [],
				hasMore: null,
			}),
		).toBe(false);

		expect(
			checkIsResponse({
				options: [],
				hasMore: 123,
			}),
		).toBe(false);
	});

	test("should return true if `hasMore` is boolean or undefined", () => {
		expect(
			checkIsResponse({
				options: [],
				hasMore: true,
			}),
		).toBe(true);

		expect(
			checkIsResponse({
				options: [],
				hasMore: false,
			}),
		).toBe(true);

		expect(
			checkIsResponse({
				options: [],
				hasMore: undefined,
			}),
		).toBe(true);

		expect(
			checkIsResponse({
				options: [],
			}),
		).toBe(true);
	});
});

describe("validateResponse", () => {
	const consoleMock = vi
		.spyOn(console, "error")
		.mockImplementation(() => undefined);

	afterAll(() => {
		consoleMock.mockReset();
	});

	test("should throw error if response is invalid", () => {
		const response = {
			options: 123,
		};

		expect(() => {
			validateResponse(response);
		}).toThrow();

		expect(console.error).toHaveBeenCalledTimes(1);
		expect(console.error).toHaveBeenCalledWith(
			errorText,
			"Received:",
			response,
		);
	});

	test("should accept valid response", () => {
		const response = {
			options: [1, 2, 3],
		};

		expect(validateResponse(response)).toBe(true);
	});
});
