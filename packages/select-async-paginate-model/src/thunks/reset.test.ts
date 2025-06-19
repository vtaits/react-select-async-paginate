import { beforeEach, expect, test, vi } from "vitest";
import { type ResetAction, reset as resetAction } from "../actions";
import { RESET } from "../actionTypes";
import { RequestOptionsCaller } from "../types/internal";
import { requestOptions } from "./requestOptions";
import { reset } from "./reset";

vi.mock("../actions");
const mockedResetAction = vi.mocked(resetAction);

vi.mock("./requestOptions");
const mockedRequestOptions = vi.mocked(requestOptions);

beforeEach(() => {
	vi.clearAllMocks();
});

const resetThunkAction = reset();

const action: ResetAction = {
	type: RESET,
};

mockedResetAction.mockReturnValue(action);

test("should call reset and not load options", () => {
	const dispatch = vi.fn();

	const getParams = vi.fn().mockReturnValue({
		autoload: false,
	});

	resetThunkAction(dispatch, vi.fn(), getParams);

	expect(mockedResetAction).toHaveBeenCalledTimes(1);

	expect(mockedRequestOptions).toHaveBeenCalledTimes(0);

	expect(dispatch).toHaveBeenCalledTimes(1);
	expect(dispatch).toHaveBeenCalledWith(action);
});

test("should call reset and load options", () => {
	const requestOptionsThunkAction = vi.fn();
	mockedRequestOptions.mockReturnValue(requestOptionsThunkAction);

	const dispatch = vi.fn();

	const getParams = vi.fn().mockReturnValue({
		autoload: true,
	});

	resetThunkAction(dispatch, vi.fn(), getParams);

	expect(mockedResetAction).toHaveBeenCalledTimes(1);

	expect(mockedRequestOptions).toHaveBeenCalledTimes(1);
	expect(mockedRequestOptions).toHaveBeenCalledWith(
		RequestOptionsCaller.Autoload,
	);

	expect(dispatch).toHaveBeenCalledTimes(2);
	expect(dispatch).toHaveBeenNthCalledWith(1, action);
	expect(dispatch).toHaveBeenNthCalledWith(2, requestOptionsThunkAction);
});
